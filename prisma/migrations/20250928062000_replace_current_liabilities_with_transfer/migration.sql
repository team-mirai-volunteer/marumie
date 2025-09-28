-- Create new enum with transfer
CREATE TYPE "TransactionType_new" AS ENUM ('income', 'expense', 'transfer', 'offset_income', 'offset_expense');

-- Update the table to use the new enum, converting current_liabilities to transfer
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" TYPE "TransactionType_new"
USING (
  CASE
    WHEN "transaction_type"::text = 'current_liabilities' THEN 'transfer'::text::"TransactionType_new"
    ELSE "transaction_type"::text::"TransactionType_new"
  END
);

-- Drop the old enum and rename the new one
DROP TYPE "TransactionType";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";