-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('income', 'expense', 'other');

-- CreateTable
CREATE TABLE "public"."political_organizations" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "political_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" BIGSERIAL NOT NULL,
    "political_organization_id" BIGINT NOT NULL,
    "transaction_no" VARCHAR(255),
    "transaction_date" DATE NOT NULL,
    "financial_year" INTEGER NOT NULL,
    "transaction_type" "public"."TransactionType" NOT NULL,
    "debit_account" VARCHAR(255) NOT NULL,
    "debit_sub_account" VARCHAR(255),
    "debit_department" VARCHAR(255),
    "debit_partner" VARCHAR(255),
    "debit_tax_category" VARCHAR(255),
    "debit_amount" DECIMAL(15,2) NOT NULL,
    "credit_account" VARCHAR(255) NOT NULL,
    "credit_sub_account" VARCHAR(255),
    "credit_department" VARCHAR(255),
    "credit_partner" VARCHAR(255),
    "credit_tax_category" VARCHAR(255),
    "credit_amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "description_1" TEXT,
    "description_2" TEXT,
    "description_3" TEXT,
    "description_detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_no_key" ON "public"."transactions"("transaction_no");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_political_organization_id_fkey" FOREIGN KEY ("political_organization_id") REFERENCES "public"."political_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
