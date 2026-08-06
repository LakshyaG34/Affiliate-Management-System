import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";

import {
    getAffiliateDetails,
    getAllAffiliates,
    getPlatformStats,
    getTopAffiliates,
} from "@/services/affiliate.service";

export const getAllAffiliatesController =
    asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = (req.query.search as string) || "";

        const sortBy =
            (req.query.sortBy as string) || "createdAt";

        const sortOrder =
            (req.query.sortOrder as
                | "asc"
                | "desc") || "desc";

        const result = await getAllAffiliates({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
        });

        res.status(200).json({
            success: true,
            message: "Affiliates fetched successfully",
            data: result,
        });
    });

export const getAffiliateDetailsController =
    asyncHandler(async (req: Request, res: Response) => {
        const affiliate =
            await getAffiliateDetails(req.params.id as string);

        res.status(200).json({
            success: true,
            message: "Affiliate fetched successfully",
            data: affiliate,
        });
    });

export const getTopAffiliatesController =
    asyncHandler(async (_req: Request, res: Response) => {
        const affiliates = await getTopAffiliates();

        res.status(200).json({
            success: true,
            message: "Top affiliates fetched successfully",
            data: affiliates,
        });
    });

export const getPlatformStatsController =
    asyncHandler(async (_req: Request, res: Response) => {
        const stats = await getPlatformStats();

        res.status(200).json({
            success: true,
            message:
                "Platform statistics fetched successfully",
            data: stats,
        });
    });