import { getMyCommissions } from "@/services/commission.service";
import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

export const getMyCommissionsController =
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getMyCommissions(
      req.user!.id,
      {
        page,
        limit,
      }
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  });