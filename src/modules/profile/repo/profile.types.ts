import { z } from "zod";

export const createProfileSchema = z.object({
  userId: z.uuid().min(1),
  fullName: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});



export const updateProfileSchema = z.object({
  userId: z.uuid().min(1),
  data: createProfileSchema.omit({ userId: true }),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;