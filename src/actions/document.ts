"use server";

import { auth } from "~/server/auth"; // Adjust path based on your auth setup
import { api } from "~/trpc/server";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
  try {
    // Get the current user session
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Extract form data
    const file = formData.get("file") as File;
    const accountId = formData.get("accountId") as string;

    if (!file || !accountId) {
      throw new Error("Missing required fields");
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are supported");
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB");
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert PDF to base64 using built-in operations
    const base64Content = buffer.toString("base64");

    console.log(`File saved: ${filename} (${file.size} bytes)`);
    console.log(
      `Base64 content generated (${base64Content.length} characters)`,
    );

    // Create document record using tRPC with base64 content
    const document = await api.document.createDocument({
      accountId: accountId,
      filename: filename,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      filePath: `/uploads/documents/${filename}`, // Relative path for serving
      content: base64Content, // Store as base64
    });

    revalidatePath(`/`); // Adjust path as needed
    revalidatePath("/documents"); // Adjust path as needed

    return {
      success: true,
      document: document,
      message: "Document uploaded successfully",
    };
  } catch (error) {
    console.error("Upload error:", error);

    // Return appropriate error message
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to upload document",
    };
  }
}
