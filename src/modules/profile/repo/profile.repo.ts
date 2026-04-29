import prisma from "../../../config/prisma";
import { CreateProfileInput, UpdateProfileInput } from "./profile.types";

export const createProfile = async (input: CreateProfileInput) => {
  const data = {
    userId: input.userId,
    ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
    ...(input.bio !== undefined ? { bio: input.bio } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
  };

  const profile = await prisma.profile.create({
    data,
  });

  return profile;
};

export const updateProfile = async (input: UpdateProfileInput) => {
  const data = {
    ...(input.data.fullName !== undefined ? { fullName: input.data.fullName } : {}),
    ...(input.data.bio !== undefined ? { bio: input.data.bio } : {}),
    ...(input.data.phone !== undefined ? { phone: input.data.phone } : {}),
  };

  const profile = await prisma.profile.update({
    where: { userId: input.userId },
    data,
  });
  return profile;
};