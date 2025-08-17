import prisma from '@poli-money-alpha/db';
import { PoliticalOrganization } from '@/shared/model/political-organization';

export class CreatePoliticalOrganizationUsecase {
  async execute(name: string, description?: string): Promise<PoliticalOrganization> {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error('Organization name is required');
      }

      const cleanName = name.trim();
      const cleanDescription = description?.trim() || undefined;

      const organization = await prisma.politicalOrganization.create({
        data: { name: cleanName, description: cleanDescription }
      });

      return {
        ...organization,
        id: organization.id.toString()
      };
    } catch (error) {
      throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
