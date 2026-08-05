import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import { getMyReferrals } from "@/services/referral.service";

export const getMyReferralsController =
    asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const referrals =
                await getMyReferrals(
                    req.user!.id
                );

            res.status(200).json({
                success: true,
                message:
                    "Referrals fetched successfully",
                data: referrals,
            });
        }
    );