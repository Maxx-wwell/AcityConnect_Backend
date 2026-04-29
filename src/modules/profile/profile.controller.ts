import { Request, Response } from "express";
import { profileService } from "./profile.service";
import { createProfileSchema, updateProfileSchema } from "./repo/profile.types";

export const createProfileController = async (req: Request, res: Response) => {
  const input = createProfileSchema.safeParse(req.body);
  if (!input.success) {
    throw new Error(input.error.message || "Invalid input");
  }
  try {
    const profile = await profileService.createProfile(input.data);
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create profile");
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
    const input = updateProfileSchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const profile = await profileService.updateProfile({
            userId: req.params.userId as string,
            data: input.data.data,
        });
        res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update profile");
    }
};