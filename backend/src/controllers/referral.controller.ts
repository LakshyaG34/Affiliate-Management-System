import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import { getMyReferrals } from "@/services/referral.service";

export const getMyReferralsController =
    asyncHandler(async (req: Request, res: Response) => {
        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const result =
            await getMyReferrals({
                affiliateId: req.user!.id,
                page,
                limit,
            });

        res.status(200).json({
            success: true,
            message:
                "Referrals fetched successfully",
            data: result,
        });
    });