import * as authRepo from "./repo/auth.repo";
import { LoginUserInput, RegisterUserInput } from "./repo/auth.types";

export const authService = {
  register: async (input: RegisterUserInput) => {
    return await authRepo.registerUser(input);
  },
  login: async (input: LoginUserInput) => {
    return await authRepo.loginUser(input);
  },
};