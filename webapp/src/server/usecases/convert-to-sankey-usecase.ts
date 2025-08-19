import type { DisplayTransaction } from "@/types/display-transaction";
import type { SankeyData } from "@/types/sankey";
import { convertToSankeyData } from "../utils/sankey-converter";

export interface ConvertToSankeyParams {
  transactions: DisplayTransaction[];
}

export interface ConvertToSankeyResult {
  sankeyData: SankeyData;
}

export class ConvertToSankeyUsecase {
  async execute(params: ConvertToSankeyParams): Promise<ConvertToSankeyResult> {
    const sankeyData = convertToSankeyData(params.transactions);
    
    return {
      sankeyData,
    };
  }
}