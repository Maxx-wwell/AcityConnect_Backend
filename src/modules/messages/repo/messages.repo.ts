import prisma from "../../../config/prisma";

export const assertParticipant = async (
  conversationId: string,
  userId: string
) => {
  const row = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });
  if (!row) {
    throw new Error("Not a participant in this conversation");
  }
};

export const listMessagesForConversation = async (conversationId: string) => {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, email: true },
      },
    },
  });
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: { id: true, email: true },
      },
    },
  });
};
