import { getMyCommissions } from "@/services/commission.service";
import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

export const getMyCommissionsController =
  asyncHandler(async (req: Request, res: Response) => {

    const commissions =
      await getMyCommissions(req.user!.id);

    res.status(200).json({
      success: true,
      data: commissions,
    });

  });