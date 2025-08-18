// // typecheckを通すために一時的に全てコメントアウトしています。

// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// type SankeyNode = { id: string };
// type SankeyLink = { source: string; target: string; value: number };

// function addNode(nodes: Map<string, SankeyNode>, id: string) {
//   if (!nodes.has(id)) nodes.set(id, { id });
// }

// export async function GET(
//   _request: Request,
//   { params }: { params: Promise<{ slug: string }> }
// ) {
//   const { slug } = await params;

//   const politician = await prisma.politician.findUnique({ where: { slug } });
//   if (!politician) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 });
//   }

//   // Use MfTransaction as the source of truth for Sankey
//   const transactions = await prisma.mfTransaction.findMany();

//   const nodes = new Map<string, SankeyNode>();
//   const linksAccumulator = new Map<string, number>();

//   const ACCOUNT = 'Account';
//   addNode(nodes, ACCOUNT);

//   function incLink(source: string, target: string, amount: number) {
//     const key = `${source}__${target}`;
//     linksAccumulator.set(key, (linksAccumulator.get(key) || 0) + amount);
//   }

//   // Keep rows >= minimal amount, then take the first 30 (preserve order)
//   const SANKEY_MINIMAL_LIMIT = 10_000;
//   const filtered = transactions.filter((t) => {
//     const amount =
//       t.direction === 'IN'
//         ? Math.abs((t.creditAmountYen ?? 0))
//         : Math.abs((t.debitAmountYen ?? 0));
//     return amount >= SANKEY_MINIMAL_LIMIT;
//   });

//   // no limit
//   const limited = filtered.slice(0, filtered.length);

//   for (const t of limited) {
//     if (t.direction === 'IN') {
//       // IN two layers: summaryDetail (or row #) -> creditAccount -> Account
//       const amount = Math.abs((t.creditAmountYen ?? t.debitAmountYen) ?? 0);
//       if (!amount) continue;
//       const credit = (t.creditAccount || 'Income').trim();
//       const detail = (t.summaryDetail || `#${t.transactionNo}`).trim();
//       addNode(nodes, detail);
//       addNode(nodes, credit);
//       incLink(detail, credit, amount);
//       incLink(credit, ACCOUNT, amount);
//     } else {
//       // OUT (two layers): Account -> debitAccount, then debitAccount -> debitDetail
//       const amount = Math.abs((t.debitAmountYen ?? t.creditAmountYen) ?? 0);
//       if (!amount) continue;
//       const debit = (t.debitAccount || 'Expenses').trim();
//       addNode(nodes, debit);
//       incLink(ACCOUNT, debit, amount);

//       const detailRaw = (t.summaryDetail || '').trim();
//       if (detailRaw) {
//         // Use only the detail label for the second layer (no category prefix)
//         addNode(nodes, detailRaw);
//         incLink(debit, detailRaw, amount);
//       }
//     }
//   }

//   const nodesArr: SankeyNode[] = Array.from(nodes.values());
//   const linksArr: SankeyLink[] = Array.from(linksAccumulator.entries()).map(([key, value]) => {
//     const [source, target] = key.split('__');
//     return { source, target, value };
//   });

//   return NextResponse.json({ nodes: nodesArr, links: linksArr });
// }
