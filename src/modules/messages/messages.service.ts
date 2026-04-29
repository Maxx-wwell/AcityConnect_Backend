import * as messagesRepo from "./repo/messages.repo";

export const messagesService = {
  listMessages: async (conversationId: string, requesterId: string) => {
    await messagesRepo.assertParticipant(conversationId, requesterId);
    return await messagesRepo.listMessagesForConversation(conversationId);
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    content: string
  ) => {
    await messagesRepo.assertParticipant(conversationId, senderId);
    return await messagesRepo.createMessage(conversationId, senderId, content);
  },
};
