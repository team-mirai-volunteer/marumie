import 'server-only';
import { NextResponse } from "next/server";
import { getCurrentUserRole } from "@/lib/auth/roles";

export async function GET() {
  try {
    const role = await getCurrentUserRole();
    
    if (!role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}