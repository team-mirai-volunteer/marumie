-- Political Organizations Table
CREATE TABLE political_organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    political_organization_id BIGINT NOT NULL REFERENCES political_organizations(id),
    transaction_no VARCHAR(255) UNIQUE,
    transaction_date DATE NOT NULL,
    financial_year INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'other')),
    debit_account VARCHAR(255) NOT NULL,
    debit_sub_account VARCHAR(255),
    debit_department VARCHAR(255),
    debit_partner VARCHAR(255),
    debit_tax_category VARCHAR(255),
    debit_amount DECIMAL(15,2) NOT NULL,
    credit_account VARCHAR(255) NOT NULL,
    credit_sub_account VARCHAR(255),
    credit_department VARCHAR(255),
    credit_partner VARCHAR(255),
    credit_tax_category VARCHAR(255),
    credit_amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    description_1 TEXT,
    description_2 TEXT,
    description_3 TEXT,
    description_detail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_political_organization_id ON transactions(political_organization_id);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_financial_year ON transactions(financial_year);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);