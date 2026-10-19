-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "notificationPrefs" JSONB NOT NULL DEFAULT '{"invoicePaid":true,"paymentLinkClicked":true,"deadlineApproaching":true,"proposalResponse":true}';
