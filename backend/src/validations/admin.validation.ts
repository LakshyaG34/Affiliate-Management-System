import { z } from "zod";

export const updateCommissionStatusSchema = z.object({
  status: z.enum([
    "APPROVED",
    "REJECTED",
  ]),
});