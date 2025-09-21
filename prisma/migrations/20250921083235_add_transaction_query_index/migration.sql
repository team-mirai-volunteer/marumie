-- CreateIndex
CREATE INDEX "transactions_political_organization_id_financial_year_trans_idx" ON "public"."transactions"("political_organization_id", "financial_year", "transaction_type", "transaction_date" DESC);
