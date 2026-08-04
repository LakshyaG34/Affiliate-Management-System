import { z } from "zod";

export const requestPayoutSchema = z.object({});

export const updatePayoutStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});