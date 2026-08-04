import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import { updateCommissionStatusSchema } from "@/validations/admin.validation";
import { getAllCommissions, updateCommissionStatus } from "@/services/admin.service";

export const updateCommissionStatusController =
    asyncHandler(async (req: Request, res: Response) => {
        const { status } =
            updateCommissionStatusSchema.parse(req.body);

        const commission =
            await updateCommissionStatus(
                req.params.id as string,
                status
            );

        res.status(200).json({
            success: true,
            message: `Commission ${status.toLowerCase()} successfully`,
            data: commission,
        });
    });

export const getAllCommissionsController =
    asyncHandler(async (_req: Request, res: Response) => {

        const commissions = await getAllCommissions();

        res.status(200).json({
            success: true,
            data: commissions,
        });

    });