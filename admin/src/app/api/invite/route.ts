import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Admin-only: invite a user by email and assign role metadata
export async function POST(request: Request) {
  const { email, role } = await request.json().catch(() => ({}));
  if (!email || !role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const currentRole = (user.app_metadata?.role || user.user_metadata?.role) as string | undefined;
  if (currentRole !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use Supabase admin API via service key to invite user
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json({ error: "Missing server env" }, { status: 500 });
  }

  const resp = await fetch(`${url}/auth/v1/invite`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, data: { role } }),
  });

  if (!resp.ok) {
    const j = await resp.json().catch(() => ({}));
    return NextResponse.json({ error: j.error_description || j.message || "Invite failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}


