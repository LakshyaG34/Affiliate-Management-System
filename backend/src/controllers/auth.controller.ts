import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import { loginSchema, registerSchema } from "@/validations/auth.validation";
import { loginUser, registerUser } from "@/services/auth.service";
import generateToken from "@/utils/generateToken";

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

export const login = asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const user = await loginUser(data.email, data.password);

    const token = generateToken(user.id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            referralCode: user.referralCode,
        },
    });
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);

export const logout = asyncHandler(
  async (_req: Request, res: Response) => {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);