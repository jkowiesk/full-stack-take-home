import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const documentRouter = createTRPCRouter({
  getDocumentByAccountId: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      const documents = await ctx.db.document.findMany({
        where: {
          accountId: input.accountId,
          // Ensure user has access to this account
          account: {
            createdById: ctx.session.user.id,
          },
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });
      return documents;
    }),

  deleteDocument: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First verify the user owns this document
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.id,
          uploadedById: ctx.session.user.id,
        },
      });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      const deletedDocument = await ctx.db.document.delete({
        where: { id: input.id },
      });

      return deletedDocument;
    }),

  createDocument: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        filename: z.string(),
        originalName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
        filePath: z.string(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the account belongs to the user
      const account = await ctx.db.userAccount.findFirst({
        where: {
          id: input.accountId,
          createdById: ctx.session.user.id,
        },
      });

      if (!account) {
        throw new Error("Account not found or access denied");
      }

      const newDocument = await ctx.db.document.create({
        data: {
          filename: input.filename,
          originalName: input.originalName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          filePath: input.filePath,
          content: input.content,
          accountId: input.accountId,
          uploadedById: ctx.session.user.id,
        },
      });

      return newDocument;
    }),

  getDocumentContent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.id,
          uploadedById: ctx.session.user.id,
        },
        select: {
          id: true,
          filename: true,
          originalName: true,
          content: true,
          uploadedAt: true,
        },
      });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      return document;
    }),

  getDocument: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.id,
          uploadedById: ctx.session.user.id,
        },
        include: {
          account: true,
        },
      });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      return document;
    }),
});
