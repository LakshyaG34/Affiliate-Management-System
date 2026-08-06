import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";
import { CommissionStatus } from "@prisma/client";

interface GetAllCommissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CommissionStatus;
}

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

export const getAllCommissions = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}: GetAllCommissionsParams) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),

    OR: [
      {
        affiliate: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
      {
        affiliate: {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
      {
        purchase: {
          user: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      },
      {
        purchase: {
          user: {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      },
    ],
  };

  const [commissions, total] = await Promise.all([
    prisma.commission.findMany({
      where,

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

      skip,
      take: limit,
    }),

    prisma.commission.count({
      where,
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