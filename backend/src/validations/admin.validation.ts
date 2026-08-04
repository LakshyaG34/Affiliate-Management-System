import { z } from "zod";

export const updateCommissionStatusSchema = z.object({
  status: z.enum([
    "APPROVED",
    "REJECTED",
  ]),
});

export const updateCommissionSettingsSchema = z.object({
  commissionPercentage: z
    .number()
    .min(0)
    .max(100),

  minimumPayoutAmount: z
    .number()
    .positive(),
});