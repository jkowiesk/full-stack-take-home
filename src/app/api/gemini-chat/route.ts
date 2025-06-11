// app/api/gemini-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface RequestBody {
  documentId: string;
  question: string;
  chatHistory: ChatMessage[];
}

// Helper function to prepare chat history for Gemini
function prepareChatHistory(messages: ChatMessage[]) {
  return messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { documentId, question, chatHistory } = body;

    if (!documentId || !question.trim()) {
      return NextResponse.json(
        { error: "Document ID and question are required" },
        { status: 400 },
      );
    }

    // Verify document exists and user has access
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        account: {
          createdById: session.user.id,
        },
      },
      include: {
        account: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 },
      );
    }

    // Check if document has base64 content
    if (!document.content) {
      return NextResponse.json(
        { error: "Document content not available" },
        { status: 400 },
      );
    }

    try {
      // Convert base64 to proper format for Gemini
      const base64Data = document.content.includes(",")
        ? document.content.split(",")[1]
        : document.content;

      // Determine the MIME type for Gemini
      const mimeType = document.mimeType || "application/pdf";

      // System prompt for document analysis
      const systemPrompt = `You are a helpful AI assistant analyzing a document.

Document Information:
- Filename: ${document.originalName}
- Account: ${document.account.name}
- Upload Date: ${document.uploadedAt.toLocaleDateString()}
- File Type: ${document.mimeType}

Please analyze the provided document and answer questions about it accurately and helpfully. If a question cannot be answered based on the document content, please let the user know.`;

      // Prepare the request payload for Gemini API
      let contents;

      if (chatHistory.length > 0) {
        // Include chat history
        contents = [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: "I understand. I've analyzed the document and I'm ready to help you with questions about it. What would you like to know?",
              },
            ],
          },
          ...prepareChatHistory(chatHistory),
          {
            role: "user",
            parts: [{ text: question }],
          },
        ];
      } else {
        // First message - include document and question
        contents = [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nUser Question: ${question}` },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ];
      }

      // Make request to Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        },
      );

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini API error:", errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();

      // Extract the response text
      const responseText =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error("No response text from Gemini");
      }

      return NextResponse.json({
        response: responseText,
      });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
      return NextResponse.json(
        { error: "Failed to generate response from AI" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
