import type { PoliticalOrganization } from "@/shared/models/political-organization";

export interface IPoliticalOrganizationRepository {
  create(
    name: string,
    slug: string,
    description?: string,
  ): Promise<PoliticalOrganization>;
}
