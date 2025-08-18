export interface PoliticalOrganization {
  id: string; // PostgreSQL BigInt converted to string for JSON serialization
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
