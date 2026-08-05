import prisma from "@/lib/prisma";

export const getMyReferrals = async (
  affiliateId: string
) => {
  const referrals = await prisma.user.findMany({
    where: {
      referredById: affiliateId,
    },

    include: {
      purchases: {
        where: {
          status: "SUCCESS",
        },
      },

      commissions: {
        where: {
          affiliateId,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return referrals.map((user) => {
    const totalPurchases =
      user.purchases.length;

    const totalPurchaseAmount =
      user.purchases.reduce(
        (sum, purchase) =>
          sum + purchase.purchaseAmount,
        0
      );

    const totalCommissionEarned =
      user.commissions.reduce(
        (sum, commission) =>
          sum +
          commission.commissionAmount,
        0
      );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode:
        user.referralCode,

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
};