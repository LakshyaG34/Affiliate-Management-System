import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";

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

    const purchase = await prisma.purchase.create({
        data: {
            purchaseAmount,
            userId,
        },
    });

    const updatedPurchase = await prisma.purchase.update({
        where: {
            id: purchase.id,
        },
        data: {
            status: "SUCCESS",
        },
    });

    return updatedPurchase;
};