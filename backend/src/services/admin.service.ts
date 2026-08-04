import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";
import { CommissionStatus } from "@/generated/prisma/client";

export const updateCommissionStatus = async (
  commissionId: string,
  status: CommissionStatus
) => {
  const commission = await prisma.commission.findUnique({
    where: {
      id: commissionId,
    },
  });

  if (!commission) {
    throw new ApiError(404, "Commission not found");
  }

  if (commission.status === "PAID") {
    throw new ApiError(
      400,
      "Paid commission cannot be modified"
    );
  }

  return await prisma.commission.update({
    where: {
      id: commissionId,
    },
    data: {
      status,
    },
  });
};

export const getAllCommissions = async () => {
  return await prisma.commission.findMany({
    include: {
      affiliate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
  });
};

export const getCommissionSettings = async () => {
  const settings = await prisma.commissionSetting.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    throw new ApiError(404, "Commission settings not found");
  }

  return settings;
};

export const updateCommissionSettings = async (
  commissionPercentage: number,
  minimumPayoutAmount: number
) => {
  return prisma.commissionSetting.update({
    where: {
      id: 1,
    },
    data: {
      commissionPercentage,
      minimumPayoutAmount,
    },
  });
};