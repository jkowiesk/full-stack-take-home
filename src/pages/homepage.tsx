"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountsCombobox } from "~/components/AccountsCombobox";
import DocumentsCard from "~/components/documentsCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export default function HomePage() {
  const [accounts] = api.userAccount.getAllUserAccounts.useSuspenseQuery();
  console.log("Accounts:", accounts);
  const [selectedAccount, setSelectedAccount] = useState<string>(
    accounts[0]?.id ?? "",
  );

  const currentAccount = accounts.find(
    (account) => account.id === selectedAccount,
  ) ?? {
    id: "",
    name: "No account selected",
    email: "N/A",
    location: "N/A",
    createdAt: new Date(),
  };

  return (
    <>
      <Card className="text-sm">
        <CardHeader>
          <CardTitle>
            <div className="flex items-baseline gap-4">
              Selected Account
              <AccountsCombobox
                accounts={accounts}
                selectedAccountId={selectedAccount}
                onAccountSelect={(accountId) => {
                  setSelectedAccount(accountId);
                }}
              />
            </div>
          </CardTitle>
          <CardDescription>
            Currently viewing data for this account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-sm">
              <span className="font-semibold">Account Name: </span>
              {currentAccount.name}
            </p>
            {/* add email */}
            <p className="text-sm">
              <span className="font-semibold">Email: </span>
              {currentAccount.email}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Location: </span>
              {currentAccount.location}
            </p>
          </div>
        </CardContent>
      </Card>

      <DocumentsCard
        accountId={currentAccount.id}
        accountName={currentAccount.name}
      />
    </>
  );
}
