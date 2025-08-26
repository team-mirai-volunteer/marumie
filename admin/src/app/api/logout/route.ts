import { createClient } from "@/server/supabase/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
