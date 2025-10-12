-- AlterTable
ALTER TABLE "public"."registrations" ADD COLUMN     "npm" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProof" TEXT,
ADD COLUMN     "step1Completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "step2Completed" BOOLEAN NOT NULL DEFAULT false;
