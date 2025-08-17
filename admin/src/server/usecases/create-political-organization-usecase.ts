import prisma from '@poli-money-alpha/db';
import { PoliticalOrganizationRepository } from '../repositories/political-organization-repository';
import {
  PoliticalOrganization,
  CreatePoliticalOrganizationRequest
} from '@/shared/model/political-organization';

/**
 * Create Political Organization Usecase
 *
 * This usecase provides the business logic for creating political organizations.
 * It encapsulates validation and coordinates with the repository layer.
 */
export class CreatePoliticalOrganizationUsecase {
  private repository: PoliticalOrganizationRepository;

  constructor() {
    this.repository = new PoliticalOrganizationRepository(prisma);
  }

  /**
   * Execute the creation of a new political organization
   */
  async execute(data: CreatePoliticalOrganizationRequest): Promise<PoliticalOrganization> {
    try {
      // Validate required fields
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Organization name is required');
      }

      // Trim whitespace
      const cleanData = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined
      };

      return await this.repository.create(cleanData);
    } catch (error) {
      throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance for convenience
export const createPoliticalOrganizationUsecase = new CreatePoliticalOrganizationUsecase();
