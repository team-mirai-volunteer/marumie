-- Create new enum with non_cash_journal and without transfer
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense', 'non_cash_journal', 'offset_income', 'offset_expense');

-- Update the table to use the new enum, converting transfer to non_cash_journal
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" TYPE "TransactionType_new"
USING (
  CASE
    WHEN "transaction_type"::text = 'transfer' THEN 'non_cash_journal'::text::"TransactionType_new"
    ELSE "transaction_type"::text::"TransactionType_new"
  END
);

-- Drop the old enum and rename the new one
DROP TYPE "TransactionType";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";