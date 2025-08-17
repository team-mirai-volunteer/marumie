import prisma from '@poli-money-alpha/db';
import {
  PoliticalOrganization
} from '@/shared/model/political-organization';

/**
 * Create Political Organization Usecase
 *
 * This usecase provides the business logic for creating political organizations.
 * It encapsulates validation and uses Prisma directly.
 */
export class CreatePoliticalOrganizationUsecase {
  /**
   * Execute the creation of a new political organization
   */
  async execute(name: string, description?: string): Promise<PoliticalOrganization> {
    try {
      // Validate required fields
      if (!name || name.trim().length === 0) {
        throw new Error('Organization name is required');
      }

      // Trim whitespace
      const cleanName = name.trim();
      const cleanDescription = description?.trim() || undefined;

      // Create organization using Prisma directly
      const organization = await prisma.politicalOrganization.create({
        data: {
          name: cleanName,
          description: cleanDescription
        }
      });

      // Convert BigInt to string for JSON serialization
      return {
        ...organization,
        id: organization.id.toString()
      };
    } catch (error) {
      throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance for convenience
export const createPoliticalOrganizationUsecase = new CreatePoliticalOrganizationUsecase();
