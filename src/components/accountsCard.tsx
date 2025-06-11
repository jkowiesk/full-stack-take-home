"use client";

import type { UserAccount } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import AccountsCombobox from "./accounts-combobox";

type Props = {
  accounts: UserAccount[];
  currentAccount?: UserAccount;
  onAccountSelect: (accountId: string) => void;
};

export default function AccountsCard({
  accounts,
  onAccountSelect,
  currentAccount,
}: Props) {
  return (
    <Card className="text-sm">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
              <span>Account</span>
              <AccountsCombobox
                accounts={accounts}
                selectedAccountId={currentAccount?.id}
                onAccountSelect={(accountId) => {
                  onAccountSelect(accountId);
                }}
              />
            </div>
            <Link href="/accounts" className="text-blue-500 hover:underline">
              Manage All Accounts
            </Link>
          </div>
        </CardTitle>
        <CardDescription>Account information and details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">Account Name: </span>
              {currentAccount?.name ?? "Not specified"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              {currentAccount?.email ?? "Not specified"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Location: </span>
              {currentAccount?.location ?? "Not specified"}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              {currentAccount ? "Active" : "No account selected"}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Last Updated: </span>
              {currentAccount ? "Today" : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
