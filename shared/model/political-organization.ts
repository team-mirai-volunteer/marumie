export interface PoliticalOrganization {
  id: bigint;
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
