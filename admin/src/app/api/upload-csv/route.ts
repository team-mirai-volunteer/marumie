import { NextResponse } from 'next/server'
import { UploadMfCsvUsecase } from '@/server/usecases/upload-mf-csv-usecase'
import { PrismaTransactionRepository } from '@/server/repositories/prisma-transaction.repository'
import { EncodingConverter } from '@/server/lib/encoding-converter'
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
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }

    if (!politicalOrganizationId) {
      return NextResponse.json({ error: '政治団体IDが指定されていません' }, { status: 400 })
    }

    // Convert file to buffer and then to properly encoded string
    const csvBuffer = Buffer.from(await file.arrayBuffer())
    const csvContent = EncodingConverter.bufferToString(csvBuffer)
    
    const result = await uploadUsecase.execute({
      csvContent,
      politicalOrganizationId,
    })

    if (result.errors.length > 0) {
      return NextResponse.json({
        error: '処理中にエラーが発生しました',
        details: result.errors,
        processedCount: result.processedCount,
        savedCount: result.savedCount,
        skippedCount: result.skippedCount,
        message: `${result.processedCount}件を処理し、${result.savedCount}件を保存、${result.skippedCount}件をスキップしました`,
      }, { status: 400 })
    }

    const message = result.skippedCount > 0 
      ? `${result.processedCount}件を処理し、${result.savedCount}件を新規保存、${result.skippedCount}件を重複のためスキップしました`
      : `${result.processedCount}件を処理し、${result.savedCount}件を保存しました`;

    return NextResponse.json({
      ok: true,
      processedCount: result.processedCount,
      savedCount: result.savedCount,
      skippedCount: result.skippedCount,
      message,
    })

  } catch (error) {
    console.error('Upload CSV error:', error)
    return NextResponse.json({
      error: 'サーバー内部エラーが発生しました',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


