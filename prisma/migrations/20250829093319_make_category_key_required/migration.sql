/*
  Warnings:

  - Made the column `category_key` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- Update existing NULL values with a default key
UPDATE "public"."transactions" SET "category_key" = 'other-expenses' WHERE "category_key" IS NULL;

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "category_key" SET NOT NULL;
