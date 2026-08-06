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


interface GetReferralHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getReferralHistory = async ({
  page = 1,
  limit = 10,
  search = "",
}: GetReferralHistoryParams) => {
  const skip = (page - 1) * limit;

  const where = {
    referredById: {
      not: null,
    },

    OR: [
      {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive" as const,
        },
      },
      {
        referredBy: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
      {
        referredBy: {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,

      include: {
        referredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        purchases: {
          where: {
            status: "SUCCESS",
          },
        },

        commissions: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  const referrals = users.map((user) => ({
    id: user.id,

    name: user.name,

    email: user.email,

    joinedAt: user.createdAt,

    affiliate: user.referredBy,

    totalPurchases: user.purchases.length,

    totalPurchaseAmount: user.purchases.reduce(
      (sum, purchase) => sum + purchase.purchaseAmount,
      0
    ),

    totalCommission: user.commissions.reduce(
      (sum, commission) => sum + commission.commissionAmount,
      0
    ),

    status:
      user.purchases.length > 0
        ? "ACTIVE"
        : "PENDING_PURCHASE",
  }));

  return {
    referrals,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};