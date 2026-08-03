import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";
import { generateCommission } from "@/services/commission.service";

export const createPurchase = async (
  userId: string,
  purchaseAmount: number
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        purchaseAmount,
        userId,
      },
    });

    const updatedPurchase = await tx.purchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status: "SUCCESS",
      },
    });

    await generateCommission(tx, updatedPurchase);

    return updatedPurchase;
  });
};