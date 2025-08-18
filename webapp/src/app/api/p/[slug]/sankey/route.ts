import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SankeyNode = { id: string };
type SankeyLink = { source: string; target: string; value: number };

function addNode(nodes: Map<string, SankeyNode>, id: string) {
  if (!nodes.has(id)) nodes.set(id, { id });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const politicalOrganization = await prisma.politicalOrganization.findFirst({
    where: { name: slug },
  });
  if (!politicalOrganization) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Use Transaction as the source of truth for Sankey
  const transactions = await prisma.transaction.findMany({
    where: { politicalOrganizationId: politicalOrganization.id },
  });

  console.log(
    `Found ${transactions.length} transactions for organization ${politicalOrganization.name}`,
  );

  // If no transactions, return empty data
  if (transactions.length === 0) {
    return NextResponse.json({
      nodes: [],
      links: [],
    });
  }

  const nodes = new Map<string, SankeyNode>();
  const linksAccumulator = new Map<string, number>();

  const ACCOUNT = "Account";
  addNode(nodes, ACCOUNT);

  function incLink(source: string, target: string, amount: number) {
    const key = `${source}__${target}`;
    linksAccumulator.set(key, (linksAccumulator.get(key) || 0) + amount);
  }

  // Keep rows >= minimal amount, then take the first 30 (preserve order)
  const SANKEY_MINIMAL_LIMIT = 10_000;
  const filtered = transactions.filter((t) => {
    const amount =
      t.transactionType === "income"
        ? Number(t.creditAmount)
        : Number(t.debitAmount);
    return amount >= SANKEY_MINIMAL_LIMIT;
  });

  // no limit
  const limited = filtered.slice(0, filtered.length);

  for (const t of limited) {
    if (t.transactionType === "income") {
      // IN: source -> Account
      const amount = Number(t.creditAmount);
      if (!amount) continue;
      const source = (t.description || t.creditAccount || "Income").trim();
      addNode(nodes, source);
      incLink(source, ACCOUNT, amount);
    } else if (t.transactionType === "expense") {
      // OUT: Account -> target
      const amount = Number(t.debitAmount);
      if (!amount) continue;
      const target = (t.description || t.debitAccount || "Expenses").trim();
      addNode(nodes, target);
      incLink(ACCOUNT, target, amount);
    }
  }

  const nodesArr: SankeyNode[] = Array.from(nodes.values());
  const linksArr: SankeyLink[] = Array.from(linksAccumulator.entries())
    .map(([key, value]) => {
      const [source, target] = key.split("__");
      return { source, target, value };
    })
    .filter((link) => {
      // Prevent circular links (source === target)
      if (link.source === link.target) return false;
      // Ensure unique directional links
      return link.value > 0;
    });

  // Debug logging
  console.log("Nodes:", nodesArr);
  console.log("Links:", linksArr);

  // Check for potential circular references
  const linkCheck = new Set<string>();
  const validLinks = linksArr.filter((link) => {
    const forward = `${link.source}->${link.target}`;
    const backward = `${link.target}->${link.source}`;

    if (linkCheck.has(backward)) {
      console.log(
        "Potential circular link detected:",
        forward,
        "conflicts with",
        backward,
      );
      return false;
    }
    linkCheck.add(forward);
    return true;
  });

  return NextResponse.json({ nodes: nodesArr, links: validLinks });
}
