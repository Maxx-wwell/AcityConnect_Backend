import * as profileRepo from "./repo/profile.repo";
import { CreateProfileInput, UpdateProfileInput } from "./repo/profile.types";

export const profileService = {
  createProfile: async (input: CreateProfileInput) => {
    return await profileRepo.createProfile(input);
  },
  updateProfile: async (input: UpdateProfileInput) => {
    return await profileRepo.updateProfile(input);
  },
};