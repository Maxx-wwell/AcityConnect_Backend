import { TradeStatus } from "@prisma/client";
import * as tradesRepo from "./repo/trades.repo";

export const tradesService = {
  requestTrade: async (listingId: string, requesterId: string) => {
    const trade = await tradesRepo.createTradeForListing(listingId, requesterId);
    if (!trade) throw new Error("Failed to create trade");
    return trade;
  },

  listForUser: async (userId: string) => {
    return await tradesRepo.listTradesForUser(userId);
  },

  updateStatus: async (tradeId: string, userId: string, status: TradeStatus) => {
    const trade = await tradesRepo.findTradeById(tradeId);
    if (!trade) throw new Error("Trade not found");

    const isOwner = trade.ownerId === userId;
    const isRequester = trade.requesterId === userId;

    if (!isOwner && !isRequester) {
      throw new Error("Not authorized for this trade");
    }

    if (status === TradeStatus.ACCEPTED || status === TradeStatus.REJECTED) {
      if (!isOwner) throw new Error("Only the listing owner can accept or reject");
      if (trade.status !== TradeStatus.PENDING) {
        throw new Error("Trade is no longer pending");
      }
    }

    if (status === TradeStatus.COMPLETED) {
      if (trade.status !== TradeStatus.ACCEPTED) {
        throw new Error("Trade must be accepted before it can be completed");
      }
    }

    if (trade.status === TradeStatus.REJECTED || trade.status === TradeStatus.COMPLETED) {
      throw new Error("Trade is already closed");
    }

    return await tradesRepo.updateTradeStatus(tradeId, status);
  },
};
