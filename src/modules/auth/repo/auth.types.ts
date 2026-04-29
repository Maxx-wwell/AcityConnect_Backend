import { z } from "zod";

const normalizedEmailSchema = z
  .email()
  .transform((email) => email.trim().toLowerCase());

export const registerUserSchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(8),
});

export const loginUserSchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(8),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;