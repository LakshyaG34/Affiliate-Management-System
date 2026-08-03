import { Request, Response } from "express";

import asyncHandler from "@/middleware/asyncHandler";
import { createPurchaseSchema } from "@/validations/purchase.validation";
import { createPurchase } from "@/services/purchase.service";

export const createPurchaseController = asyncHandler(
  async (req: Request, res: Response) => {
    const { purchaseAmount } = createPurchaseSchema.parse(req.body);

    const purchase = await createPurchase(
      req.user!.id,
      purchaseAmount
    );

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  }
);