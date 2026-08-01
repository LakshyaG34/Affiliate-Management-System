import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateReferralCode } from "@/utils/generateReferralCode";
import ApiError from "@/utils/ApiError";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let referralCode = generateReferralCode();

  while (
    await prisma.user.findUnique({
      where: {
        referralCode,
      },
    })
  ) {
    referralCode = generateReferralCode();
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      referralCode,
    },
  });

  return user;
};