"use client";

import { useState } from "react";
import type { UserAccount } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { CreateAccountDialog } from "./createAccountDialog";

type Props = {
  accounts: UserAccount[];
};

export default function AccountsTableCard({ accounts }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    setDeletingId(id);
    try {
      // Replace with your actual delete function
      // await deleteAccount(id);
      console.log("Deleting account:", id);
      // For now, just simulate the delete
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      alert("Failed to delete account");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>
              Manage your accounts and associated documents
            </CardDescription>
          </div>
          <CreateAccountDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CreateAccountDialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No accounts found. Create your first account to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell>{account.location}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {account.email && (
                          <div className="text-sm text-gray-600">
                            {account.email}
                          </div>
                        )}
                        {account.phone && (
                          <div className="text-sm text-gray-600">
                            {account.phone}
                          </div>
                        )}
                        {!account.email && !account.phone && (
                          <div className="text-sm text-gray-400">
                            No contact info
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(account.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/accounts/${account.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(account.id)}
                            disabled={deletingId === account.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingId === account.id
                              ? "Deleting..."
                              : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
