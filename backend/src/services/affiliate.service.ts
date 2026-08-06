import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";

interface GetAllAffiliatesParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const getAllAffiliates = async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
}: GetAllAffiliatesParams) => {
    const skip = (page - 1) * limit;
    const sortableFields = [
        "createdAt",
        "name",
        "email",
    ] as const;

    type SortField = (typeof sortableFields)[number];

    const safeSortBy: SortField =
        sortableFields.includes(sortBy as SortField)
            ? (sortBy as SortField)
            : "createdAt";

    const where = {
        role: "USER" as const,

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
                referralCode: {
                    contains: search,
                    mode: "insensitive" as const,
                },
            },
        ],
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,

            include: {
                referrals: true,

                purchases: {
                    where: {
                        status: "SUCCESS",
                    },
                },

                commissions: true,

                payouts: true,
            },

            orderBy: {
                [safeSortBy]: sortOrder,
            },

            skip,
            take: limit,
        }),

        prisma.user.count({ where }),
    ]);

    const affiliates = users.map((user) => {
        const totalSales = user.purchases.reduce(
            (sum, purchase) => sum + purchase.purchaseAmount,
            0
        );

        const totalCommission = user.commissions.reduce(
            (sum, commission) => sum + commission.commissionAmount,
            0
        );

        const availableBalance = user.commissions
            .filter((commission) => commission.status === "APPROVED")
            .reduce(
                (sum, commission) => sum + commission.commissionAmount,
                0
            );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,

            joinedAt: user.createdAt,

            referralCount: user.referrals.length,

            totalSales,

            totalCommission,

            availableBalance,
        };
    });

    return {
        affiliates,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAffiliateDetails = async (
    affiliateId: string
) => {
    const affiliate = await prisma.user.findUnique({
        where: {
            id: affiliateId,
        },

        include: {
            referrals: {
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
            },

            purchases: true,

            commissions: {
                include: {
                    purchase: {
                        include: {
                            user: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            },

            payouts: {
                include: {
                    commissions: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!affiliate)
        throw new ApiError(
            404,
            "Affiliate not found"
        );

    const totalSales = affiliate.purchases.reduce(
        (sum, purchase) => sum + purchase.purchaseAmount,
        0
    );

    const totalCommission =
        affiliate.commissions.reduce(
            (sum, commission) =>
                sum + commission.commissionAmount,
            0
        );

    const approvedCommission =
        affiliate.commissions
            .filter(
                (commission) =>
                    commission.status === "APPROVED"
            )
            .reduce(
                (sum, commission) =>
                    sum + commission.commissionAmount,
                0
            );

    const paidCommission =
        affiliate.commissions
            .filter(
                (commission) =>
                    commission.status === "PAID"
            )
            .reduce(
                (sum, commission) =>
                    sum + commission.commissionAmount,
                0
            );

    const referrals = affiliate.referrals.map((referral) => {
        const totalPurchases = referral.purchases.length;

        const totalPurchaseAmount = referral.purchases.reduce(
            (sum, purchase) => sum + purchase.purchaseAmount,
            0
        );

        const totalCommissionEarned =
            referral.commissions.reduce(
                (sum, commission) =>
                    sum + commission.commissionAmount,
                0
            );

        return {
            id: referral.id,
            name: referral.name,
            email: referral.email,
            referralCode: referral.referralCode,

            joinedAt: referral.createdAt,

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
        ...affiliate,
        referrals,

        stats: {
            referralCount:
                affiliate.referrals.length,

            totalSales,

            totalCommission,

            approvedCommission,

            paidCommission,

            availableBalance:
                approvedCommission,
        },
    };
};

export const getTopAffiliates =
    async () => {
        const affiliates =
            await prisma.user.findMany({
                where: {
                    role: "USER",
                },

                include: {
                    referrals: true,
                    commissions: true,
                },
            });

        return affiliates
            .map((user) => ({
                id: user.id,

                name: user.name,

                email: user.email,

                referralCount:
                    user.referrals.length,

                totalCommission:
                    user.commissions.reduce(
                        (sum, commission) =>
                            sum +
                            commission.commissionAmount,
                        0
                    ),
            }))
            .sort(
                (a, b) =>
                    b.totalCommission -
                    a.totalCommission
            )
            .slice(0, 10);
    };

export const getPlatformStats =
    async () => {
        const [
            totalUsers,
            totalPurchases,
            totalReferrals,
            commissions,
            payouts,
            purchases,
        ] = await Promise.all([
            prisma.user.count(),

            prisma.purchase.count(),

            prisma.user.count({
                where: {
                    referredById: {
                        not: null,
                    },
                },
            }),

            prisma.commission.findMany(),

            prisma.payout.findMany(),

            prisma.purchase.findMany({
                where: {
                    status: "SUCCESS",
                },
            }),
        ]);

        const totalRevenue =
            purchases.reduce(
                (sum, purchase) =>
                    sum +
                    purchase.purchaseAmount,
                0
            );

        const totalCommission =
            commissions.reduce(
                (sum, commission) =>
                    sum +
                    commission.commissionAmount,
                0
            );

        let pendingCommissionAmount = 0;
        let approvedCommissionAmount = 0;
        let paidCommissionAmount = 0;

        for (const commission of commissions) {
            switch (commission.status) {
                case "PENDING":
                    pendingCommissionAmount +=
                        commission.commissionAmount;
                    break;

                case "APPROVED":
                    approvedCommissionAmount +=
                        commission.commissionAmount;
                    break;

                case "PAID":
                    paidCommissionAmount +=
                        commission.commissionAmount;
                    break;
            }
        }

        let pendingPayoutAmount = 0;
        let approvedPayoutAmount = 0;

        for (const payout of payouts) {
            switch (payout.status) {
                case "PENDING":
                    pendingPayoutAmount +=
                        payout.payoutAmount;
                    break;

                case "APPROVED":
                    approvedPayoutAmount +=
                        payout.payoutAmount;
                    break;
            }
        }

        return {
            totalUsers,

            totalAffiliates: totalUsers,

            totalReferrals,

            totalPurchases,

            totalRevenue,

            totalCommission,

            pendingCommissionAmount,

            approvedCommissionAmount,

            paidCommissionAmount,

            pendingPayoutAmount,

            approvedPayoutAmount,
        };
    };