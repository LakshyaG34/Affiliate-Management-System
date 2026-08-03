import { z } from "zod";

export const createPurchaseSchema = z.object({
  purchaseAmount: z
    .number({
      error: "Purchase amount is required",
    })
    .positive("Purchase amount must be greater than 0"),
});

export type CreatePurchaseInput = z.infer<
  typeof createPurchaseSchema
>;