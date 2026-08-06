import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import { updateCommissionSettingsSchema, updateCommissionStatusSchema } from "@/validations/admin.validation";
import { getAllCommissions, getCommissionSettings, updateCommissionSettings, updateCommissionStatus } from "@/services/admin.service";
import { CommissionStatus } from "@prisma/client/edge";

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
    asyncHandler(async (req: Request, res: Response) => {

        const {
            page = "1",
            limit = "10",
            search = "",
            status,
        } = req.query;

        const commissions = await getAllCommissions({
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            status:
                status && status !== "all"
                    ? (status as CommissionStatus)
                    : undefined,
        });

        res.status(200).json({
            success: true,
            data: commissions,
        });

    });


export const getCommissionSettingsController =
    asyncHandler(async (_req: Request, res: Response) => {

        const settings =
            await getCommissionSettings();

        res.json({
            success: true,
            data: settings,
        });

    });

export const updateCommissionSettingsController =
    asyncHandler(async (req: Request, res: Response) => {

        const {
            commissionPercentage,
            minimumPayoutAmount,
        } =
            updateCommissionSettingsSchema.parse(
                req.body
            );

        const settings =
            await updateCommissionSettings(
                commissionPercentage,
                minimumPayoutAmount
            );

        res.json({
            success: true,
            message:
                "Commission settings updated successfully",
            data: settings,
        });

    });