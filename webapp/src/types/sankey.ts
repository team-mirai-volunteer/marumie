export interface SankeyNode {
  id: string;
  label?: string;
  nodeType?: "income" | "income-sub" | "total" | "expense" | "expense-sub";
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
