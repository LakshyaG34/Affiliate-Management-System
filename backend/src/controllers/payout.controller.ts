import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import {
  requestPayout,
  getMyPayouts,
  getAllPayouts,
  updatePayoutStatus,
} from "@/services/payout.service";

import {
  requestPayoutSchema,
  updatePayoutStatusSchema,
} from "@/validations/payout.validation";

export const requestPayoutController =
  asyncHandler(async (req: Request, res: Response) => {
    // const payout = await requestPayout(
    //   req.user!.id
    // );
    const { commissionIds } =
  requestPayoutSchema.parse(req.body);

const payout = await requestPayout(
  req.user!.id,
  commissionIds
);

    res.status(201).json({
      success: true,
      message: "Payout requested successfully",
      data: payout,
    });
  });

export const getMyPayoutsController =
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getMyPayouts(
      req.user!.id,
      {
        page,
        limit,
      }
    );

    res.json({
      success: true,
      data: result,
    });
  });

export const getAllPayoutsController =
  asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllPayouts({
      page,
      limit,
    });

    res.json({
      success: true,
      data: result,
    });
  });

export const updatePayoutStatusController =
  asyncHandler(async (req: Request, res: Response) => {
    const { status } =
      updatePayoutStatusSchema.parse(
        req.body
      );

    const payout =
      await updatePayoutStatus(
        req.params.id as string,
        status
      );

    res.json({
      success: true,
      data: payout,
    });
  });