import prisma from "@/lib/prisma";

export const getDashboard = async (
  userId: string,
  role: "USER" | "ADMIN"
) => {
  if (role === "ADMIN") {
    const [
      totalUsers,
      totalPurchases,
      totalCommissions,
      pendingCommissions,
      totalPayouts,
      pendingPayouts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.purchase.count(),
      prisma.commission.count(),
      prisma.commission.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.payout.count(),
      prisma.payout.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    return {
      role: "ADMIN",
      totalUsers,
      totalPurchases,
      totalCommissions,
      pendingCommissions,
      totalPayouts,
      pendingPayouts,
    };
  }

  const [
    totalReferrals,
    totalPurchases,
    pendingCommission,
    approvedCommission,
    paidCommission,
    totalEarnings,
    totalPayouts,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        referredById: userId,
      },
    }),

    prisma.purchase.count({
      where: {
        userId,
      },
    }),

    prisma.commission.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        affiliateId: userId,
        status: "PENDING",
      },
    }),

    prisma.commission.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        affiliateId: userId,
        status: "APPROVED",
      },
    }),

    prisma.commission.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        affiliateId: userId,
        status: "PAID",
      },
    }),

    prisma.commission.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        affiliateId: userId,
      },
    }),

    prisma.payout.count({
      where: {
        affiliateId: userId,
      },
    }),
  ]);

  return {
    role: "USER",

    totalReferrals,
    totalPurchases,

    pendingCommission:
      pendingCommission._sum.commissionAmount ?? 0,

    approvedCommission:
      approvedCommission._sum.commissionAmount ?? 0,

    paidCommission:
      paidCommission._sum.commissionAmount ?? 0,

    totalEarnings:
      totalEarnings._sum.commissionAmount ?? 0,

    totalPayouts,
  };
};