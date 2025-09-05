/*
  Warnings:

  - A unique constraint covering the columns `[political_organization_id,transaction_no]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `transaction_no` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."transactions_transaction_no_key";

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "transaction_no" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_political_organization_id_transaction_no_key" ON "public"."transactions"("political_organization_id", "transaction_no");
