import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

  // For now, just count lines to prove we can receive files.
  const text = await file.text()
  const rows = text.split(/\r?\n/).filter((l) => l.trim() !== '').length
  return NextResponse.json({ ok: true, rows })
}


