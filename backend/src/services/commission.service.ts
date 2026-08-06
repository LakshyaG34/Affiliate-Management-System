import type { Prisma, Purchase } from "@prisma/client";
import ApiError from "@/utils/ApiError";
import prisma from "@/lib/prisma";

export const generateCommission = async (
  tx: Prisma.TransactionClient,
  purchase: Purchase
) => {
  if (purchase.status !== "SUCCESS") {
    return;
  }

  const buyer = await tx.user.findUnique({
    where: {
      id: purchase.userId,
    },
  });

  if (!buyer || !buyer.referredById) {
    return;
  }

  const existingCommission = await tx.commission.findUnique({
    where: {
      purchaseId: purchase.id,
    },
  });

  if (existingCommission) {
    return;
  }

  const settings = await tx.commissionSetting.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    throw new ApiError(500, "Commission settings not found");
  }

  const commissionAmount =
    (purchase.purchaseAmount * settings.commissionPercentage) / 100;

  await tx.commission.create({
    data: {
      affiliateId: buyer.referredById,
      purchaseId: purchase.id,
      commissionAmount,
      status: "PENDING",
    },
  });
};

interface GetMyCommissionsParams {
  page?: number;
  limit?: number;
}

export const getMyCommissions = async (
  affiliateId: string,
  {
    page = 1,
    limit = 10,
  }: GetMyCommissionsParams
) => {
  const skip = (page - 1) * limit;

  const [commissions, total] = await Promise.all([
    prisma.commission.findMany({
      where: {
        affiliateId,
      },
      include: {
        purchase: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.commission.count({
      where: {
        affiliateId,
      },
    }),
  ]);

  return {
    commissions,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};