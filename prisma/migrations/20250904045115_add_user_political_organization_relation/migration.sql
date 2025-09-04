/*
  Warnings:

  - A unique constraint covering the columns `[political_organization_id,transaction_no]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `transaction_no` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."transactions_transaction_no_key";

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "transaction_no" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."user_political_organizations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "political_organization_id" BIGINT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_political_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_political_organizations_user_id_political_organization_key" ON "public"."user_political_organizations"("user_id", "political_organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_political_organization_id_transaction_no_key" ON "public"."transactions"("political_organization_id", "transaction_no");

-- AddForeignKey
ALTER TABLE "public"."user_political_organizations" ADD CONSTRAINT "user_political_organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_political_organizations" ADD CONSTRAINT "user_political_organizations_political_organization_id_fkey" FOREIGN KEY ("political_organization_id") REFERENCES "public"."political_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their organization transactions" ON "public"."transactions"
FOR ALL
TO authenticated
USING (
  political_organization_id IN (
    SELECT upo.political_organization_id 
    FROM user_political_organizations upo
    JOIN users u ON u.id = upo.user_id
    WHERE u.auth_id = auth.uid()
  )
);

CREATE POLICY "Admins can access all transactions" ON "public"."transactions"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.auth_id = auth.uid() AND u.role = 'admin'
  )
);
