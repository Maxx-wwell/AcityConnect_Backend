import { TradeStatus } from "@prisma/client";
import prisma from "../../../config/prisma";

export const createTradeForListing = async (
  listingId: string,
  requesterId: string
) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, userId: true, title: true },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.userId === requesterId) {
    throw new Error("You cannot request a trade on your own listing");
  }

  const existing = await prisma.trade.findFirst({
    where: {
      listingId,
      requesterId,
      status: TradeStatus.PENDING,
    },
  });
  if (existing) {
    return prisma.trade.findUnique({
      where: { id: existing.id },
      include: tradeInclude,
    });
  }

  return prisma.trade.create({
    data: {
      listingId,
      requesterId,
      ownerId: listing.userId,
      status: TradeStatus.PENDING,
    },
    include: tradeInclude,
  });
};

const tradeInclude = {
  listing: {
    select: {
      id: true,
      title: true,
      status: true,
      listingType: true,
    },
  },
  requester: { select: { id: true, email: true } },
  owner: { select: { id: true, email: true } },
} as const;

export const listTradesForUser = async (userId: string) => {
  return prisma.trade.findMany({
    where: {
      OR: [{ requesterId: userId }, { ownerId: userId }],
    },
    include: tradeInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const findTradeById = async (id: string) => {
  return prisma.trade.findUnique({
    where: { id },
    include: tradeInclude,
  });
};

export const updateTradeStatus = async (
  id: string,
  status: TradeStatus
) => {
  return prisma.trade.update({
    where: { id },
    data: { status },
    include: tradeInclude,
  });
};
