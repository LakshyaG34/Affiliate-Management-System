import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import { getDashboard } from "@/services/dashboard.service";

export const getDashboardController =
  asyncHandler(async (req: Request, res: Response) => {
    const dashboard =
      await getDashboard(
        req.user!.id,
        req.user!.role
      );

    res.json({
      success: true,
      data: dashboard,
    });
  });