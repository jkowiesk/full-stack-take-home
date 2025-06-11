"use client";

import { api } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  FileText,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { UploadDocumentDialog } from "~/components/uploadDocumentDialog";
import { DocumentViewer } from "./ui/documentViewer";

type Props = {
  accountId: string;
  accountName: string;
};

export default function DocumentsCard({ accountId, accountName }: Props) {
  const {
    data: documents,
    isLoading,
    refetch,
  } = api.document.getDocumentByAccountId.useQuery({ accountId });

  const mutate = api.document.deleteDocument.useMutation();

  const handleDelete = async (documentId: string) => {
    mutate.mutate(
      { id: documentId },
      {
        onSuccess: () => {
          void refetch();
        },
      },
    );
  };

  if (isLoading) {
    return <Skeleton className="h-[240px] w-full py-2" />;
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="mt-4 text-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents for {accountName}</CardTitle>
            <UploadDocumentDialog
              accountId={accountId}
              onUploadSuccess={() => {
                console.log("Document uploaded successfully");
              }}
            >
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </UploadDocumentDialog>
          </div>
          <CardDescription>
            Documents associated with this account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-4 text-center">
            No documents found for this account.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documents for {accountName}</CardTitle>
          <UploadDocumentDialog
            accountId={accountId}
            onUploadSuccess={() => {
              console.log("Document uploaded successfully");
            }}
          >
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </UploadDocumentDialog>
        </div>
        <CardDescription>
          Documents associated with this account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{document.originalName}</span>
                  </div>
                </TableCell>
                <TableCell>{document.fileSize}</TableCell>
                <TableCell>
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => document.id && handleDelete(document.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DocumentViewer documentId={document.id}>
                        <Button variant="ghost" className="w-full text-left">
                          <Search className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DocumentViewer>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
