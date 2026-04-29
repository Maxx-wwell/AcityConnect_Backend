import { z } from "zod";

export const createConversationSchema = z.object({
  listingId: z.uuid(),
  userId: z.uuid(),
});

export const listConversationsQuerySchema = z.object({
  userId: z.uuid(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
