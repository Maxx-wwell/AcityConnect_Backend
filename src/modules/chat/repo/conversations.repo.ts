import prisma from "../../../config/prisma";

export const findConversationBetweenUsersOnListing = async (
  listingId: string,
  userA: string,
  userB: string
) => {
  const candidates = await prisma.conversation.findMany({
    where: {
      listingId,
      AND: [
        { participants: { some: { userId: userA } } },
        { participants: { some: { userId: userB } } },
      ],
    },
    include: {
      participants: true,
    },
  });

  const pair = new Set([userA, userB]);
  return (
    candidates.find((c) => {
      if (c.participants.length !== 2) return false;
      const ids = new Set(c.participants.map((p) => p.userId));
      return pair.size === ids.size && [...pair].every((id) => ids.has(id));
    }) ?? null
  );
};

export const createConversationWithParticipants = async (
  listingId: string,
  ownerId: string,
  initiatorId: string
) => {
  return prisma.conversation.create({
    data: {
      listingId,
      participants: {
        create: [{ userId: ownerId }, { userId: initiatorId }],
      },
    },
    include: {
      listing: {
        select: { id: true, title: true, status: true },
      },
      participants: {
        include: {
          user: { select: { id: true, email: true } },
        },
      },
    },
  });
};

export const listConversationsForUser = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
    },
    include: {
      listing: {
        select: { id: true, title: true, status: true },
      },
      participants: {
        include: {
          user: { select: { id: true, email: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getListingOwnerId = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });
  return listing?.userId ?? null;
};

export const getConversationById = async (conversationId: string) => {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      listing: {
        select: { id: true, title: true, status: true },
      },
      participants: {
        include: {
          user: { select: { id: true, email: true } },
        },
      },
    },
  });
};
