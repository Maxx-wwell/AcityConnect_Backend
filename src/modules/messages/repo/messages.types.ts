import { z } from "zod";

export const listMessagesQuerySchema = z.object({
  userId: z.uuid(),
});

export const sendMessageBodySchema = z.object({
  userId: z.uuid(),
  content: z.string().min(1).max(5000),
});
