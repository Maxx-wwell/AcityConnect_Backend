import { TradeStatus } from "@prisma/client";
import { z } from "zod";

export const createTradeSchema = z.object({
  listingId: z.uuid(),
  requesterId: z.uuid(),
});

export const updateTradeSchema = z.object({
  userId: z.uuid(),
  status: z.nativeEnum(TradeStatus),
});

export const listTradesQuerySchema = z.object({
  userId: z.uuid(),
});
