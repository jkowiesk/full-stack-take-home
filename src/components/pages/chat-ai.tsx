"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  MessageCircle,
  FileText,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { api } from "~/trpc/react";
import AccountsCard from "~/components/accountsCard";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface GeminiResponse {
  response: string;
  error?: string;
}

export function GeminiChatPage() {
  const { data: allAccounts = [] } =
    api.userAccount.getAllUserAccounts.useQuery();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    allAccounts[0]?.id ?? "",
  );

  const {
    data: documents = [],
    isLoading: loadingDocuments,
    refetch: refetchDocuments,
  } = api.document.getDocumentByAccountId.useQuery(
    { accountId: selectedAccountId },
    { enabled: !!selectedAccountId },
  );

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedAccount = allAccounts.find(
    (acc) => acc.id === selectedAccountId,
  );

  const selectedDocument = documents.find(
    (doc) => doc.id === selectedDocumentId,
  );

  // Clear selections when account changes
  useEffect(() => {
    setSelectedDocumentId("");
    setChatMessages([]);
  }, [selectedAccountId]);

  // Set first document as default when documents load
  useEffect(() => {
    if (documents.length > 0 && !selectedDocumentId) {
      setSelectedDocumentId(documents[0]!.id);
    }
  }, [documents, selectedDocumentId]);

  const sendMessage = async () => {
    if (!question.trim() || !selectedDocumentId || isProcessing) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: selectedDocumentId,
          question: question,
          chatHistory: chatMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini");
      }

      const result: GeminiResponse = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat failed:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const canSendMessage = question.trim() && selectedDocumentId && !isProcessing;

  useEffect(() => {
    if (selectedAccountId) {
      void refetchDocuments();
    }
  }, [selectedAccountId, refetchDocuments]);

  const clearChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Account Selection */}
      <AccountsCard
        accounts={allAccounts}
        currentAccount={selectedAccount}
        onAccountSelect={async (id) => {
          setSelectedAccountId(id);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Document Selection & Question Input */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Document Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Select Document
              </CardTitle>
              <CardDescription>
                Choose a PDF document from {selectedAccount?.name} to chat about
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDocuments ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No documents available for this account
                </p>
              ) : (
                <Select
                  value={selectedDocumentId}
                  onValueChange={setSelectedDocumentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {doc.originalName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB •{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Question Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Ask a Question
              </CardTitle>
              <CardDescription>
                Ask questions about the selected document. Gemini AI will
                analyze the content and respond.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What would you like to know about this document? (Press Enter to send, Shift+Enter for new line)"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value as unknown as string)
                }
                onKeyDown={handleKeyPress}
                className="min-h-[100px] resize-none"
                disabled={!selectedDocumentId}
              />
              <div className="flex gap-2">
                <Button
                  onClick={sendMessage}
                  disabled={!canSendMessage}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Question
                    </>
                  )}
                </Button>
                {chatMessages.length > 0 && (
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    disabled={isProcessing}
                  >
                    Clear Chat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Chat History */}
        <Card className="flex-1 lg:min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Chat with Gemini
            </CardTitle>
            <CardDescription>
              Conversation history with AI about your document
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-6">
              {chatMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <Bot className="mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    No messages yet. Select a document and ask a question to
                    start chatting with Gemini AI.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] gap-3 ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                            message.role === "user"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              message.role === "user"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start gap-3">
                      <div className="flex max-w-[80%] gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="rounded-lg bg-gray-100 px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-gray-600">
                              Gemini is thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
