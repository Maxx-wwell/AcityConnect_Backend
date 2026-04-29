import prisma from "../../../config/prisma";

const interestInclude = {
  listing: {
    select: { id: true, title: true, status: true },
  },
  user: { select: { id: true, email: true } },
} as const;

export const createInterest = async (listingId: string, userId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, userId: true, title: true },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.userId === userId) {
    throw new Error("You cannot express interest in your own listing");
  }

  const existing = await prisma.interest.findUnique({
    where: {
      listingId_userId: { listingId, userId },
    },
    include: interestInclude,
  });
  if (existing) return existing;

  return prisma.interest.create({
    data: { listingId, userId },
    include: interestInclude,
  });
};

export const deleteInterest = async (listingId: string, userId: string) => {
  await prisma.interest.deleteMany({
    where: { listingId, userId },
  });
};

export const listMyInterests = async (userId: string) => {
  return prisma.interest.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          category: true,
          user: { select: { id: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const listInterestsForListing = async (
  listingId: string,
  ownerUserId: string
) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  if (!listing) throw new Error("Listing not found");
  if (listing.userId !== ownerUserId) {
    throw new Error("Only the listing owner can view interests");
  }

  return prisma.interest.findMany({
    where: { listingId },
    include: {
      user: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
