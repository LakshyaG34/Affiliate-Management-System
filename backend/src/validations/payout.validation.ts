import { z } from "zod";

// export const requestPayoutSchema = z.object({});
export const requestPayoutSchema = z.object({
  commissionIds: z
    .array(z.string().uuid())
    .min(1, "Select at least one commission"),
});

export const updatePayoutStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});