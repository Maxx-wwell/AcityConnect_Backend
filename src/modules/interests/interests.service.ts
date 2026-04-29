import * as interestsRepo from "./repo/interests.repo";

export const interestsService = {
  expressInterest: async (listingId: string, userId: string) => {
    return await interestsRepo.createInterest(listingId, userId);
  },

  removeInterest: async (listingId: string, userId: string) => {
    await interestsRepo.deleteInterest(listingId, userId);
  },

  listMine: async (userId: string) => {
    return await interestsRepo.listMyInterests(userId);
  },

  listForListing: async (listingId: string, ownerUserId: string) => {
    return await interestsRepo.listInterestsForListing(listingId, ownerUserId);
  },
};
