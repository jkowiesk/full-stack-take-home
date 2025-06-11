import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userAccountRouter = createTRPCRouter({
  getAllUserAccounts: protectedProcedure.query(async ({ ctx }) => {
    const userAccounts = await ctx.db.userAccount.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return userAccounts;
  }),
});
