export interface PoliticalOrganization {
  id: string; // PostgreSQL BigInt converted to string for JSON serialization
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePoliticalOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdatePoliticalOrganizationRequest {
  name?: string;
  description?: string;
}

export interface PoliticalOrganizationWithTransactionCount extends PoliticalOrganization {
  transactionCount: number;
}
