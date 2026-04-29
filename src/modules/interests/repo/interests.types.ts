import { z } from "zod";

export const createInterestSchema = z.object({
  listingId: z.uuid(),
  userId: z.uuid(),
});

export const deleteInterestQuerySchema = z.object({
  userId: z.uuid(),
});

export const userQuerySchema = z.object({
  userId: z.uuid(),
});
