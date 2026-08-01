import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await registerUser(data);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
    },
  });
});