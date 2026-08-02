import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { loadTransactionsByNos } from "@/server/contexts/data-import/presentation/loaders/load-transactions-by-nos";
import { requireAuthResponse } from "@/server/contexts/auth/presentation/loaders/require-auth-response";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAuthResponse();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const nos = searchParams.get("nos");

  if (!orgId || !nos) {
    return NextResponse.json(
      { success: false, error: "orgId and nos are required" },
      { status: 400 },
    );
  }

  const transactionNos = nos
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  if (transactionNos.length === 0) {
    return NextResponse.json(
      { success: false, error: "At least one transaction number is required" },
      { status: 400 },
    );
  }

  const result = await loadTransactionsByNos(orgId, transactionNos);
  return NextResponse.json(result);
}
