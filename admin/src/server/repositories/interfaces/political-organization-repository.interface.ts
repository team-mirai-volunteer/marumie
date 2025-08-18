import type { PoliticalOrganization } from "@/shared/model/political-organization";

export interface IPoliticalOrganizationRepository {
  create(
    name: string,
    slug: string,
    description?: string,
  ): Promise<PoliticalOrganization>;
}
