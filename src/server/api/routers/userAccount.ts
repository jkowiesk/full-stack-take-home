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
  deleteUserAccountById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.userAccount.delete({
        where: { id: input.id },
      });
    }),
  createUserAccount: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        location: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        address: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newAccount = await ctx.db.userAccount.create({
        data: {
          name: input.name,
          location: input.location,
          email: input.email,
          phone: input.phone,
          address: input.address,
          createdById: ctx.session.user.id,
        },
      });

      return newAccount;
    }),
});
