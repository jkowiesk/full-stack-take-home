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
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-4">
              Selected Account
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
        <CardDescription>
          Currently viewing data for this account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-sm">
            <span className="font-semibold">Account Name: </span>
            {currentAccount?.name}
          </p>
          {/* add email */}
          <p className="text-sm">
            <span className="font-semibold">Email: </span>
            {currentAccount?.email}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Location: </span>
            {currentAccount?.location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
