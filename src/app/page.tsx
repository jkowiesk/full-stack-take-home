import Link from "next/link";

import { LatestPost } from "~/components/post";
import HomePage from "~/pages/homepage";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  void api.userAccount.getAllUserAccounts.prefetch();

  return (
    <HydrateClient>
      <HomePage />
    </HydrateClient>
  );
}
