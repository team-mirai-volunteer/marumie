export interface PoliticalOrganization {
  id: string; // PostgreSQL BigInt converted to string for JSON serialization
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface PoliticalOrganizationWithTransactionCount extends PoliticalOrganization {
  transactionCount: number;
}
