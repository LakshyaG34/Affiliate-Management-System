import prisma from "@/lib/prisma";
import ApiError from "@/utils/ApiError";

export const requestPayout = async (affiliateId: string) => {
  const settings = await prisma.commissionSetting.findUnique({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    throw new ApiError(500, "Commission settings not found");
  }

  const commissions = await prisma.commission.findMany({
    where: {
      affiliateId,
      status: "APPROVED",
      payoutId: null,
    },
  });

  if (commissions.length === 0) {
    throw new ApiError(
      400,
      "No approved commissions available"
    );
  }

  const payoutAmount = commissions.reduce(
    (sum, commission) =>
      sum + commission.commissionAmount,
    0
  );

  if (
    payoutAmount <
    settings.minimumPayoutAmount
  ) {
    throw new ApiError(
      400,
      `Minimum payout amount is ₹${settings.minimumPayoutAmount}`
    );
  }

  return prisma.$transaction(async (tx) => {
    const payout = await tx.payout.create({
      data: {
        affiliateId,
        payoutAmount,
      },
    });

    await tx.commission.updateMany({
      where: {
        id: {
          in: commissions.map((c) => c.id),
        },
      },
      data: {
        payoutId: payout.id,
      },
    });

    return payout;
  });
};

export const getMyPayouts = async (
  affiliateId: string
) => {
  return prisma.payout.findMany({
    where: {
      affiliateId,
    },
    include: {
      commissions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllPayouts = async () => {
  return prisma.payout.findMany({
    include: {
      affiliate: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      commissions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updatePayoutStatus = async (
  payoutId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const payout = await prisma.payout.findUnique({
    where: {
      id: payoutId,
    },
    include: {
      commissions: true,
    },
  });

  if (!payout) {
    throw new ApiError(404, "Payout not found");
  }

  return prisma.$transaction(async (tx) => {
    const updatedPayout =
      await tx.payout.update({
        where: {
          id: payoutId,
        },
        data: {
          status,
        },
      });

    if (status === "APPROVED") {
      await tx.commission.updateMany({
        where: {
          payoutId,
        },
        data: {
          status: "PAID",
        },
      });
    }

    if (status === "REJECTED") {
      await tx.commission.updateMany({
        where: {
          payoutId,
        },
        data: {
          payoutId: null,
        },
      });
    }

    return updatedPayout;
  });
};