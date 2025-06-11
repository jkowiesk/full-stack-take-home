import AccountsTableCard from "~/components/accountsTableCard";
import { api, HydrateClient } from "~/trpc/server";

export default async function AccountsPage() {
  const userAccounts = await api.userAccount.getAllUserAccounts();
  return (
    <HydrateClient>
      <main className="relative mx-auto my-2 flex w-full max-w-[1000px] flex-1 flex-col gap-4 px-2">
        <AccountsTableCard accounts={userAccounts} />
      </main>
    </HydrateClient>
  );
}
