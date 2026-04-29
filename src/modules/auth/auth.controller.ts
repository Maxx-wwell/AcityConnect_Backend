import { Request, Response } from "express";
import { authService } from "./auth.service";
import { loginUserSchema, registerUserSchema } from "./repo/auth.types";
import { hashPassword } from "../../shared/utils/password";


export const registerUserController = async (req: Request, res: Response) => {
  const input = registerUserSchema.safeParse(req.body);
  if (!input.success) {
    throw new Error(input.error.message || "Invalid input");
  }
  const hashedPassword = await hashPassword(input.data.password);
  try {
    const user = await authService.register({ ...input.data, password: hashedPassword });
    const { passwordHash: _p, ...safeUser } = user;
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to register user");
  }
};


export const loginUserController = async (req: Request, res: Response) => {
  const input = loginUserSchema.safeParse(req.body);
  if (!input.success) {
    throw new Error(input.error.message || "Invalid input");
  }
  try {
    const user = await authService.login(input.data);
    const { passwordHash: _p, ...safeUser } = user;
    res.status(200).json({ message: "Login successful", user: safeUser });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to login user");
  }
};