import { NextResponse } from 'next/server';
import { CreatePoliticalOrganizationUsecase } from '@/server/usecases/create-political-organization-usecase';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const organizations = await prisma.politicalOrganization.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert BigInt to string for JSON serialization
    const serializedOrganizations = organizations.map(org => ({
      ...org,
      id: org.id.toString()
    }));

    return NextResponse.json(serializedOrganizations);
  } catch (error) {
    console.error('Error fetching political organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, description } = body as { name: string; description?: string };

    // Basic validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      );
    }

    const usecase = new CreatePoliticalOrganizationUsecase(prisma);
    const organization = await usecase.execute(name, description);

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating political organization:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('required') || errorMessage.includes('cannot be empty')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
