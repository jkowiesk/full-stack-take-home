"use client";

import { useState } from "react";
import AccountsCard from "~/components/accountsCard";
import DocumentsCard from "~/components/documentsCard";
import { api } from "~/trpc/react";

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
    phone: "N/A",
    address: "N/A",
    createdById: "",
    updatedById: "",
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  return (
    <>
      <AccountsCard
        accounts={accounts}
        currentAccount={currentAccount}
        onAccountSelect={setSelectedAccount}
      />

      <DocumentsCard
        accountId={currentAccount.id}
        accountName={currentAccount.name}
      />
    </>
  );
}
