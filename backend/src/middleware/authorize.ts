import { NextFunction, Request, Response } from "express";

import ApiError from "@/utils/ApiError";

const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };

export default authorize;