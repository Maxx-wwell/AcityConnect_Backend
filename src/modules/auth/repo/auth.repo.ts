import prisma from "../../../config/prisma";
import { comparePassword } from "../../../shared/utils/password";
import { LoginUserInput, RegisterUserInput } from "./auth.types";

const extractDomain = (email: string) => {
  const [, domain] = email.split("@");
  if (!domain) {
    throw new Error("Invalid email domain");
  }
  return domain.toLowerCase();
};

const assertAllowedDomain = async (domain: string) => {
  const allowedDomain = await prisma.allowedEmailDomain.findUnique({
    where: { domain },
  });

  if (!allowedDomain || !allowedDomain.isActive) {
    throw new Error("Email domain is not allowed");
  }
};


// Register a new user
export const registerUser = async (input: RegisterUserInput) => {
  const domain = extractDomain(input.email);
  await assertAllowedDomain(domain);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: input.password,
      allowedEmailDomain: {
        connect: { domain },
      },
    },
  });
  return user;
};

// Login a user
export const loginUser = async (input: LoginUserInput) => {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    return user;
};