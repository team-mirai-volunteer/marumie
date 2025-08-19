import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
