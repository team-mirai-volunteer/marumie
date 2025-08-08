import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SankeyNode = { id: string };
type SankeyLink = { source: string; target: string; value: number };

function addNode(nodes: Map<string, SankeyNode>, id: string) {
  if (!nodes.has(id)) nodes.set(id, { id });
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const politician = await prisma.politician.findUnique({ where: { slug } });
  if (!politician) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { politicianId: politician.id },
  });

  const nodes = new Map<string, SankeyNode>();
  const linksAccumulator = new Map<string, number>();

  const ACCOUNT = 'Account';
  addNode(nodes, ACCOUNT);

  function incLink(source: string, target: string, amount: number) {
    const key = `${source}__${target}`;
    linksAccumulator.set(key, (linksAccumulator.get(key) || 0) + amount);
  }

  for (const t of transactions) {
    if (t.direction === 'IN') {
      const sourceName = t.counterparty || t.source || t.inflowType || 'Income';
      addNode(nodes, sourceName);
      incLink(sourceName, ACCOUNT, t.value);
    } else {
      // OUT path: Account -> category -> category1 -> category2 (last present)
      const path = [ACCOUNT];
      const steps = [t.category, t.category1, t.category2].filter(Boolean) as string[];
      if (steps.length === 0) {
        steps.push('Expenses');
      }
      for (const step of steps) path.push(step);
      for (let i = 0; i < path.length - 1; i++) {
        addNode(nodes, path[i]);
        addNode(nodes, path[i + 1]);
        incLink(path[i], path[i + 1], t.value);
      }
    }
  }

  const nodesArr: SankeyNode[] = Array.from(nodes.values());
  const linksArr: SankeyLink[] = Array.from(linksAccumulator.entries()).map(([key, value]) => {
    const [source, target] = key.split('__');
    return { source, target, value };
  });

  return NextResponse.json({ nodes: nodesArr, links: linksArr });
}


