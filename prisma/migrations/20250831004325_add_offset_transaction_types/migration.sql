/*
  Warnings:

  - The values [other] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TransactionType_new" AS ENUM ('income', 'expense', 'offset_income', 'offset_expense');
ALTER TABLE "public"."transactions" ALTER COLUMN "transaction_type" TYPE "public"."TransactionType_new" USING ("transaction_type"::text::"public"."TransactionType_new");
ALTER TYPE "public"."TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "public"."TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;
