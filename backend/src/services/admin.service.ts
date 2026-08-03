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