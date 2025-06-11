"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { parseFileSize } from "~/lib/utils";

type Props = {
  documentId: string;
  children: React.ReactNode;
};

export function DocumentViewer({ documentId, children }: Props) {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const {
    data: document,
    isLoading,
    error,
  } = api.document.getDocumentContent.useQuery(
    { id: documentId },
    { enabled: open },
  );

  // Create PDF URL when document data is available
  useEffect(() => {
    if (document?.content && typeof document.content === "string" && !pdfUrl) {
      createPdfUrl(document.content as string);
    }
  }, [document?.content, pdfUrl]);

  const createPdfUrl = (base64Content: string) => {
    try {
      console.log("Creating PDF URL from base64 content...");

      // Check if content looks like base64
      if (!base64Content || base64Content.length < 100) {
        console.error("Invalid base64 content");
        return;
      }

      // Convert base64 to blob URL
      const base64Data = base64Content.includes(",")
        ? base64Content.split(",")[1]!
        : base64Content;

      console.log("Base64 data length:", base64Data.length);

      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log("Binary data created, size:", bytes.length);

      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      console.log("PDF URL created:", url);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error creating PDF URL:", error);
    }
  };

  const downloadPDF = () => {
    if (!document?.content) return;

    try {
      const content = document?.content;
      const base64Data =
        content && typeof content === "string" && content.includes(",")
          ? content.split(",")[1]
          : content;

      if (!base64Data || typeof base64Data !== "string") {
        console.error("No valid base64 data available");
        return;
      }

      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Use proper DOM access
      if (typeof window !== "undefined") {
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.originalName;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDialogClose = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && pdfUrl) {
      // Clean up blob URL when dialog closes
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {document?.originalName ?? "Document Viewer"}
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                className="flex items-center gap-1"
                disabled={!document?.content}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading document...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8 text-red-500">
              <p>Failed to load document</p>
            </div>
          )}

          {document && !document.content && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <div className="text-center">
                <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No content available</p>
              </div>
            </div>
          )}

          {pdfUrl && (
            <div className="flex-1 overflow-hidden rounded-lg border">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                className="h-full min-h-[600px] w-full"
                title={document?.originalName ?? "PDF Document"}
                style={{ border: "none" }}
              />
            </div>
          )}

          {document?.content && !pdfUrl && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Preparing PDF...</span>
            </div>
          )}
        </div>

        {document && (
          <div className="flex items-center justify-between border-t pt-4 text-xs text-gray-500">
            <span>
              Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
            </span>
            <span>
              Size:{" "}
              {document?.content && typeof document.content === "string"
                ? parseFileSize(document.fileSize)
                : "0"}{" "}
              bytes
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
