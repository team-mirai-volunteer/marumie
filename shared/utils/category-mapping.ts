export interface CategoryMapping {
  category: string;
  subcategory?: string;
  color?: string;
}

/**
 * アカウント名から表示用カテゴリへのマッピング辞書
 */
export const ACCOUNT_CATEGORY_MAPPING: Record<string, CategoryMapping> = {
  // 収入項目
  "個人の負担する党費又は会費": {
    category: "機関紙誌+その他事業収入",
    subcategory: "党費・会費",
    color: "#FED7AA"
  },
  "個人からの寄附": {
    category: "寄付",
    subcategory: "個人からの寄付",
    color: "#BBF7D0"
  },
  "個人からの寄附（特定寄付）": {
    category: "寄付",
    subcategory: "個人からの寄付",
    color: "#BBF7D0"
  },
  "法人その他の団体からの寄附": {
    category: "寄付",
    subcategory: "法人その他の団体からの寄附",
    color: "#FECACA"
  },
  "政治団体からの寄附": {
    category: "寄付",
    subcategory: "政治団体からの寄附",
    color: "#A5F3FC"
  },
  "政党匿名寄付": {
    category: "寄付",
    subcategory: "政党匿名寄付",
    color: "#E0F6C9"
  },
  "機関紙誌の発行その他の事業による収入": {
    category: "機関紙誌+その他事業収入",
    color: "#FDE68A"
  },
  "借入金": {
    category: "借入金",
    color: "#FECDD3"
  },
  "本部又は支部から供与された交付金に係る収入": {
    category: "交付金",
    color: "#99F6E4"
  },
  "その他の収入": {
    category: "その他",
    color: "#E2E8F0"
  },

  // 支出項目
  "人件費": {
    category: "経常経費",
    subcategory: "人件費",
    color: "#0369A1"
  },
  "光熱水費": {
    category: "経常経費",
    subcategory: "光熱水費",
    color: "#126C81"
  },
  "備品・消耗品費": {
    category: "経常経費",
    subcategory: "備品・消耗品費",
    color: "#4D7C0F"
  },
  "事務所費": {
    category: "経常経費",
    subcategory: "事務所費",
    color: "#047857"
  },
  "組織活動費": {
    category: "政治活動費",
    subcategory: "組織活動費",
    color: "#C2410C"
  },
  "選挙関係費": {
    category: "政治活動費",
    subcategory: "選挙関係費",
    color: "#DC2626"
  },
  "機関紙誌の発行事業費": {
    category: "政治活動費",
    subcategory: "機関紙誌の発行事業費",
    color: "#A16207"
  },
  "宣伝事業費": {
    category: "政治活動費",
    subcategory: "宣伝費",
    color: "#3856B1"
  },
  "政治資金パーティー開催事業費": {
    category: "政治活動費",
    subcategory: "政治資金パーティー開催費",
    color: "#6D28D9"
  },
  "その他の事業費": {
    category: "政治活動費",
    subcategory: "その他の事業費",
    color: "#334155"
  },
  "調査研究費": {
    category: "政治活動費",
    subcategory: "調査研究費",
    color: "#047857"
  },
  "寄附・交付金": {
    category: "政治活動費",
    subcategory: "寄附・交付金",
    color: "#BE185D"
  },
  "その他の経費": {
    category: "政治活動費",
    subcategory: "その他の経費",
    color: "#334155"
  }
};

