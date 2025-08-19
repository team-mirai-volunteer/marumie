import 'server-only';

import { PrismaClient } from "@prisma/client";
import { PrismaPoliticalOrganizationRepository } from "@/server/repositories/prisma-political-organization.repository";
import { PrismaTransactionRepository } from "@/server/repositories/prisma-transaction.repository";
import {
  type GetTransactionsBySlugParams,
  GetTransactionsBySlugUsecase,
} from "@/server/usecases/get-transactions-by-slug-usecase";
import { 
  ConvertToSankeyUsecase,
  type ConvertToSankeyParams
} from "@/server/usecases/convert-to-sankey-usecase";
import type { SankeyData } from "@/types/sankey";

const prisma = new PrismaClient();

interface GetSankeyDataParams {
  slug: string;
  transactionType?: "income" | "expense" | "other";
  dateFrom?: Date;
  dateTo?: Date;
  financialYear?: number;
}

export async function getSankeyData(params: GetSankeyDataParams): Promise<SankeyData | null> {
  try {
    // 依存関係の初期化
    const transactionRepository = new PrismaTransactionRepository(prisma);
    const politicalOrganizationRepository =
      new PrismaPoliticalOrganizationRepository(prisma);
    
    // Usecase 1: トランザクション取得
    const getTransactionsUsecase = new GetTransactionsBySlugUsecase(
      transactionRepository,
      politicalOrganizationRepository,
    );

    // Usecase 2: サンキーデータ変換
    const convertToSankeyUsecase = new ConvertToSankeyUsecase();

    const transactionParams: GetTransactionsBySlugParams = {
      slug: params.slug,
      perPage: 10000, // 大きな値を設定してすべてのトランザクションを取得
    };

    if (params.transactionType) {
      transactionParams.transactionType = params.transactionType;
    }
    if (params.dateFrom) {
      transactionParams.dateFrom = params.dateFrom;
    }
    if (params.dateTo) {
      transactionParams.dateTo = params.dateTo;
    }
    if (params.financialYear) {
      transactionParams.financialYear = params.financialYear;
    }

    // Usecase 1実行: トランザクションを取得
    const transactionResult = await getTransactionsUsecase.execute(transactionParams);
    
    // Usecase 2実行: サンキー図用データに変換
    const sankeyParams: ConvertToSankeyParams = {
      transactions: transactionResult.transactions,
    };
    const sankeyResult = await convertToSankeyUsecase.execute(sankeyParams);

    return sankeyResult.sankeyData;
  } catch (error) {
    console.error("Error fetching sankey data:", error);
    return null;
  }
}