import { NextResponse } from 'next/server';
import { createPoliticalOrganizationUsecase } from '../../../server/usecases/create-political-organization-usecase';
import { CreatePoliticalOrganizationRequest } from '@/shared/model/political-organization';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, description } = body as CreatePoliticalOrganizationRequest;

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

    // Execute the usecase
    const organization = await createPoliticalOrganizationUsecase.execute({
      name,
      description
    });

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error('Error creating political organization:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle validation errors
    if (errorMessage.includes('required') || errorMessage.includes('cannot be empty')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
