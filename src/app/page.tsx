import Link from "next/link";
import { Suspense } from "react";

import { LatestPost } from "~/components/post";
import Spinner from "~/components/spinner";
import HomePage from "~/pages/homepage";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  void api.userAccount.getAllUserAccounts.prefetch();

  return (
    <HydrateClient>
      <main className="relative mx-auto my-2 flex w-full max-w-[1000px] flex-1 flex-col gap-4 px-2">
        <Suspense fallback={<Spinner className="absolute inset-0 m-auto" />}>
          <HomePage />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
