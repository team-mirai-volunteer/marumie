export interface CategoryMapping {
  category: string;
  subcategory?: string;
}

/**
 * アカウント名から表示用カテゴリへのマッピング辞書
 */
export const ACCOUNT_CATEGORY_MAPPING: Record<string, CategoryMapping> = {
  // 収入項目
  "個人の負担する党費又は会費": {
    category: "機関紙誌+その他事業収入",
    subcategory: "党費・会費"
  },
  "個人からの寄附": {
    category: "寄付",
    subcategory: "個人からの寄付"
  },
  "個人からの寄附（特定寄付）": {
    category: "寄付",
    subcategory: "個人からの寄付"
  },
  "法人その他の団体からの寄附": {
    category: "寄付",
    subcategory: "法人その他の団体からの寄附"
  },
  "政治団体からの寄附": {
    category: "寄付",
    subcategory: "政治団体からの寄附"
  },
  "政党匿名寄付": {
    category: "寄付",
    subcategory: "政党匿名寄付"
  },
  "機関紙誌の発行その他の事業による収入": {
    category: "機関紙誌+その他事業収入"
  },
  "借入金": {
    category: "借入金"
  },
  "本部又は支部から供与された交付金に係る収入": {
    category: "交付金"
  },
  "その他の収入": {
    category: "その他"
  },

  // 支出項目
  "人件費": {
    category: "経常経費",
    subcategory: "人件費"
  },
  "光熱水費": {
    category: "経常経費",
    subcategory: "光熱水費"
  },
  "備品・消耗品費": {
    category: "経常経費",
    subcategory: "備品・消耗品費"
  },
  "事務所費": {
    category: "経常経費",
    subcategory: "事務所費"
  },
  "組織活動費": {
    category: "政治活動費",
    subcategory: "組織活動費"
  },
  "選挙関係費": {
    category: "政治活動費",
    subcategory: "選挙関係費"
  },
  "機関紙誌の発行事業費": {
    category: "政治活動費",
    subcategory: "機関紙誌の発行事業費"
  },
  "宣伝事業費": {
    category: "政治活動費",
    subcategory: "宣伝費"
  },
  "政治資金パーティー開催事業費": {
    category: "政治活動費",
    subcategory: "政治資金パーティー開催費"
  },
  "その他の事業費": {
    category: "政治活動費",
    subcategory: "その他の事業費"
  },
  "調査研究費": {
    category: "政治活動費",
    subcategory: "調査研究費"
  },
  "寄附・交付金": {
    category: "政治活動費",
    subcategory: "寄附・交付金"
  },
  "その他の経費": {
    category: "政治活動費",
    subcategory: "その他の経費"
  }
};

