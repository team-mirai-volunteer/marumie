import type { PoliticalOrganization } from "@/shared/model/political-organization";
import type { IPoliticalOrganizationRepository } from "../repositories/interfaces/political-organization-repository.interface";

export class CreatePoliticalOrganizationUsecase {
  constructor(private repository: IPoliticalOrganizationRepository) {}

  async execute(
    name: string,
    description?: string,
  ): Promise<PoliticalOrganization> {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Organization name is required");
      }

      return await this.repository.create(name, description);
    } catch (error) {
      throw new Error(
        `Failed to create organization: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
