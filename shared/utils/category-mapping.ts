export interface CategoryMapping {
  key: string;
  category: string;
  subcategory?: string;
  color: string;
  shortLabel: string;
  type: "income" | "expense";
}

/**
 * アカウント名から表示用カテゴリへのマッピング辞書
 */
export const ACCOUNT_CATEGORY_MAPPING: Record<string, CategoryMapping> = {
  // 収入項目
  "個人の負担する党費又は会費": {
    key: "membership-fees",
    category: "機関紙誌+その他事業収入",
    subcategory: "党費・会費",
    color: "#FED7AA",
    shortLabel: "党費・会費",
    type: "income"
  },
  "個人からの寄附": {
    key: "individual-donations",
    category: "寄附",
    subcategory: "個人からの寄附",
    color: "#BBF7D0",
    shortLabel: "個人寄附",
    type: "income"
  },
  "個人からの寄附（特定寄附）": {
    key: "specific-individual-donations",
    category: "寄附",
    subcategory: "個人からの寄附",
    color: "#BBF7D0",
    shortLabel: "個人寄附（特定）",
    type: "income"
  },
  "法人その他の団体からの寄附": {
    key: "corporate-donations",
    category: "寄附",
    subcategory: "法人その他の団体からの寄附",
    color: "#FECACA",
    shortLabel: "法人寄附",
    type: "income"
  },
  "政治団体からの寄附": {
    key: "political-donations",
    category: "寄附",
    subcategory: "政治団体からの寄附",
    color: "#A5F3FC",
    shortLabel: "政党寄附",
    type: "income"
  },
  "政党匿名寄附": {
    key: "anonymous-donations",
    category: "寄附",
    subcategory: "政党匿名寄附",
    color: "#E0F6C9",
    shortLabel: "政党匿名寄附",
    type: "income"
  },
  "機関紙誌の発行その他の事業による収入": {
    key: "publication-income",
    category: "機関紙誌+その他事業収入",
    color: "#FDE68A",
    shortLabel: "機関紙誌",
    type: "income"
  },
  "借入金": {
    key: "loans",
    category: "借入金",
    color: "#FECDD3",
    shortLabel: "借入金",
    type: "income"
  },
  "本部又は支部から供与された交付金に係る収入": {
    key: "grants",
    category: "交付金",
    color: "#99F6E4",
    shortLabel: "交付金",
    type: "income"
  },
  "その他の収入": {
    key: "other-income",
    category: "その他",
    color: "#E2E8F0",
    shortLabel: "その他",
    type: "income"
  },

  // 支出項目
  "人件費": {
    key: "personnel-costs",
    category: "経常経費",
    subcategory: "人件費",
    color: "#0369A1",
    shortLabel: "人件費",
    type: "expense"
  },
  "光熱水費": {
    key: "utilities",
    category: "経常経費",
    subcategory: "光熱水費",
    color: "#126C81",
    shortLabel: "光熱水費",
    type: "expense"
  },
  "備品・消耗品費": {
    key: "equipment-supplies",
    category: "経常経費",
    subcategory: "備品・消耗品費",
    color: "#4D7C0F",
    shortLabel: "備品消耗品費",
    type: "expense"
  },
  "事務所費": {
    key: "office-expenses",
    category: "経常経費",
    subcategory: "事務所費",
    color: "#047857",
    shortLabel: "事務所費",
    type: "expense"
  },
  "組織活動費": {
    key: "organizational-activities",
    category: "政治活動費",
    subcategory: "組織活動費",
    color: "#C2410C",
    shortLabel: "組織活動費",
    type: "expense"
  },
  "選挙関係費": {
    key: "election-expenses",
    category: "政治活動費",
    subcategory: "選挙関係費",
    color: "#DC2626",
    shortLabel: "選挙関係費",
    type: "expense"
  },
  "機関紙誌の発行事業費": {
    key: "publication-expenses",
    category: "政治活動費",
    subcategory: "機関紙誌の発行事業費",
    color: "#A16207",
    shortLabel: "機関紙誌費",
    type: "expense"
  },
  "宣伝事業費": {
    key: "advertising-expenses",
    category: "政治活動費",
    subcategory: "宣伝費",
    color: "#3856B1",
    shortLabel: "宣伝事業費",
    type: "expense"
  },
  "政治資金パーティー開催事業費": {
    key: "fundraising-party-expenses",
    category: "政治活動費",
    subcategory: "政治資金パーティー開催費",
    color: "#6D28D9",
    shortLabel: "政治資金パーティ費",
    type: "expense"
  },
  "その他の事業費": {
    key: "other-business-expenses",
    category: "政治活動費",
    subcategory: "その他の事業費",
    color: "#334155",
    shortLabel: "その他事業費",
    type: "expense"
  },
  "調査研究費": {
    key: "research-expenses",
    category: "政治活動費",
    subcategory: "調査研究費",
    color: "#047857",
    shortLabel: "調査研究費",
    type: "expense"
  },
  "寄附・交付金": {
    key: "donations-grants-expenses",
    category: "政治活動費",
    subcategory: "寄附・交付金",
    color: "#BE185D",
    shortLabel: "寄附・交付金",
    type: "expense"
  },
  "その他の経費": {
    key: "other-expenses",
    category: "政治活動費",
    subcategory: "その他の経費",
    color: "#334155",
    shortLabel: "その他経費",
    type: "expense"
  },
  "短期貸付金": {
    key: "short-term-loans",
    category: "貸付金",
    subcategory: "短期貸付金",
    color: "#7C2D12",
    shortLabel: "短期貸付金",
    type: "expense"
  }
};

/**
 * 未払費用（繰越し項目）のカテゴリマッピング辞書
 */
export const ACCRUED_EXPENSES_CATEGORIES: Record<string, CategoryMapping> = {
  "未払費用": {
    key: "accrued-expenses",
    category: "繰越し",
    subcategory: "未払費用",
    color: "#78716C",
    shortLabel: "未払費用",
    type: "expense"
  }
};

/**
 * 全てのカテゴリ（アカウント + 未払費用）
 */
export const ALL_CATEGORIES: Record<string, CategoryMapping> = {
  ...ACCOUNT_CATEGORY_MAPPING,
  ...ACCRUED_EXPENSES_CATEGORIES,
};
