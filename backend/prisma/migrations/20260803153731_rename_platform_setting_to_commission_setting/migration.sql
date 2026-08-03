/*
  Warnings:

  - You are about to drop the `PlatformSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PlatformSetting";

-- CreateTable
CREATE TABLE "CommissionSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "commissionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "minimumPayoutAmount" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionSetting_pkey" PRIMARY KEY ("id")
);
