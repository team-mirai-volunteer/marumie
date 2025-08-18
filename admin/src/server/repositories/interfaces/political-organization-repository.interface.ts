import { PoliticalOrganization } from "@/shared/model/political-organization";

export interface IPoliticalOrganizationRepository {
  create(name: string, description?: string): Promise<PoliticalOrganization>;
}
