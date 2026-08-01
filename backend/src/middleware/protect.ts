import { NextFunction, Request, Response } from "express";

import prisma from "@/lib/prisma";

import asyncHandler from "./asyncHandler";
import ApiError from "@/utils/ApiError";
import verifyToken from "@/utils/verifyToken";

const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;

    next();
  }
);

export default protect;