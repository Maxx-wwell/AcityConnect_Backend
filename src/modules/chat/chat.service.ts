import * as conversationsRepo from "./repo/conversations.repo";
import type { CreateConversationInput } from "./repo/chat.types";

export const chatService = {
  listConversations: async (userId: string) => {
    return await conversationsRepo.listConversationsForUser(userId);
  },

  createOrGetConversation: async (input: CreateConversationInput) => {
    const ownerId = await conversationsRepo.getListingOwnerId(input.listingId);
    if (!ownerId) {
      throw new Error("Listing not found");
    }
    if (ownerId === input.userId) {
      throw new Error("You cannot start a conversation on your own listing");
    }

    const existing = await conversationsRepo.findConversationBetweenUsersOnListing(
      input.listingId,
      input.userId,
      ownerId
    );

    if (existing) {
      const detail = await conversationsRepo.getConversationById(existing.id);
      if (!detail) throw new Error("Conversation not found");
      return detail;
    }

    return await conversationsRepo.createConversationWithParticipants(
      input.listingId,
      ownerId,
      input.userId
    );
  },
};
