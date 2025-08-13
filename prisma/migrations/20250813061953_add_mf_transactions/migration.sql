-- CreateTable
CREATE TABLE "public"."mf_transactions" (
    "id" SERIAL NOT NULL,
    "transactionNo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "debitAccount" TEXT,
    "debitSubaccount" TEXT,
    "debitDepartment" TEXT,
    "debitCounterparty" TEXT,
    "debitTaxCategory" TEXT,
    "debitInvoice" TEXT,
    "debitAmountYen" INTEGER,
    "creditAccount" TEXT,
    "creditSubaccount" TEXT,
    "creditDepartment" TEXT,
    "creditCounterparty" TEXT,
    "creditTaxCategory" TEXT,
    "creditInvoice" TEXT,
    "creditAmountYen" INTEGER,
    "summary" TEXT,
    "tags" TEXT,
    "memo" TEXT,
    "note1" TEXT,
    "note2" TEXT,
    "note3" TEXT,
    "summaryDetail" TEXT,
    "direction" "public"."TransactionDirection" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mf_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mf_transactions_transactionNo_key" ON "public"."mf_transactions"("transactionNo");

-- CreateIndex
CREATE INDEX "mf_transactions_date_idx" ON "public"."mf_transactions"("date");

-- CreateIndex
CREATE INDEX "mf_transactions_direction_idx" ON "public"."mf_transactions"("direction");
