-- CreateTable
CREATE TABLE "political_organizations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "political_organization_id" INTEGER NOT NULL,
    "transaction_no" TEXT,
    "transaction_date" DATETIME NOT NULL,
    "financial_year" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "debit_account" TEXT NOT NULL,
    "debit_sub_account" TEXT,
    "debit_department" TEXT,
    "debit_partner" TEXT,
    "debit_tax_category" TEXT,
    "debit_amount" DECIMAL NOT NULL,
    "credit_account" TEXT NOT NULL,
    "credit_sub_account" TEXT,
    "credit_department" TEXT,
    "credit_partner" TEXT,
    "credit_tax_category" TEXT,
    "credit_amount" DECIMAL NOT NULL,
    "description" TEXT,
    "description_1" TEXT,
    "description_2" TEXT,
    "description_3" TEXT,
    "description_detail" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "transactions_political_organization_id_fkey" FOREIGN KEY ("political_organization_id") REFERENCES "political_organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_no_key" ON "transactions"("transaction_no");
