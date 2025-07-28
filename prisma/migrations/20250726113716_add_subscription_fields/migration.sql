-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionPlan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'free';
