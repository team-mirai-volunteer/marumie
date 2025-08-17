import { NextResponse } from 'next/server'
import { UploadMfCsvUsecase } from '@/server/usecases/upload-mf-csv-usecase'
import { PrismaTransactionRepository } from '@/server/repositories/prisma-transaction.repository'
import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'

const prisma = new PrismaClient()
const transactionRepository = new PrismaTransactionRepository(prisma)
const uploadUsecase = new UploadMfCsvUsecase(transactionRepository)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const politicalOrganizationId = formData.get('politicalOrganizationId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    if (!politicalOrganizationId) {
      return NextResponse.json({ error: 'Missing political organization ID' }, { status: 400 })
    }

    const csvBuffer = Buffer.from(await file.arrayBuffer())
    
    const result = await uploadUsecase.execute({
      csvContent: csvBuffer,
      politicalOrganizationId,
    })

    if (result.errors.length > 0) {
      return NextResponse.json({
        error: 'Processing errors occurred',
        details: result.errors,
        processedCount: result.processedCount,
        savedCount: result.savedCount,
      }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      processedCount: result.processedCount,
      savedCount: result.savedCount,
      message: `Successfully processed ${result.processedCount} records and saved ${result.savedCount} transactions`,
    })

  } catch (error) {
    console.error('Upload CSV error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


