import { NextFunction, Request, Response } from "express";
import ApiError from "@/utils/ApiError";

const adminOnly = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied");
  }

  next();
};

export default adminOnly;