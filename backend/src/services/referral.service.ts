import prisma from "@/lib/prisma";

interface GetMyReferralsParams {
  affiliateId: string;
  page?: number;
  limit?: number;
}

export const getMyReferrals = async ({
  affiliateId,
  page = 1,
  limit = 10,
}: GetMyReferralsParams) => {
  const skip = (page - 1) * limit;

  const where = {
    referredById: affiliateId,
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,

      include: {
        purchases: {
          where: {
            status: "SUCCESS",
          },

          include: {
            commission: true,
          },
        },
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

  const referrals = users.map((user) => {
    const totalPurchases = user.purchases.length;

    const totalPurchaseAmount =
      user.purchases.reduce(
        (sum, purchase) =>
          sum + purchase.purchaseAmount,
        0
      );

    const totalCommissionEarned =
      user.purchases.reduce(
        (sum, purchase) =>
          sum +
          (purchase.commission?.commissionAmount ??
            0),
        0
      );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,

      joinedAt: user.createdAt,

      totalPurchases,

      totalPurchaseAmount,

      totalCommissionEarned,

      status:
        totalPurchases > 0
          ? "ACTIVE"
          : "PENDING_PURCHASE",
    };
  });

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