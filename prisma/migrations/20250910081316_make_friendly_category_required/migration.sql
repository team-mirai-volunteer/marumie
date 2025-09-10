/*
  Warnings:

  - Made the column `friendly_category` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- Update NULL values to empty string before making column required
UPDATE "public"."transactions" SET "friendly_category" = '' WHERE "friendly_category" IS NULL;

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "friendly_category" SET NOT NULL;
