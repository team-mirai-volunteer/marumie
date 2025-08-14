import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Dummy login endpoint; always succeeds for now
  const _ = await request.json().catch(() => ({}))
  return NextResponse.json({ ok: true })
}


