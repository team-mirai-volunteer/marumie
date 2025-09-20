export interface PoliticalOrganization {
  id: string; // PostgreSQL BigInt converted to string for JSON serialization
  displayName: string;
  orgName: string | null;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
