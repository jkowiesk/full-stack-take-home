import { WorkflowPage } from "~/components/pages/workflow";
import { api, HydrateClient } from "~/trpc/server";

export default async function Workflow() {
  void api.userAccount.getAllUserAccounts.prefetch();

  return (
    <HydrateClient>
      <main className="relative mx-auto my-2 flex w-full max-w-[1000px] flex-1 flex-col gap-4 px-2">
        <WorkflowPage />
      </main>
    </HydrateClient>
  );
}
