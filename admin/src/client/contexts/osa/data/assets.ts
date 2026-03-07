// OSA Asset Management Data — extracted from 複利計算シート.xlsx
// Last updated: 2026-02-28 (Row 20 of 資産推移)

export interface Asset {
  id: string;
  category: string;
  symbol: string;
  name: string;
  value: number;
  prevMonthDiff: number;
  prevMonthPct: number;
  assetClass:
    | "us_stock"
    | "jp_stock"
    | "cash_jpy"
    | "cash_usd"
    | "bond"
    | "au"
    | "pt"
    | "pd"
    | "ag"
    | "cu"
    | "metal_alloy";
}

export interface AssetAllocation {
  assetType: string;
  label: string;
  currentPct: number;
  currentValue: number;
  targetPct: number;
  targetValue: number;
  rebalanceNeeded: number;
  targetReturn: number;
}

export interface MonthlySnapshot {
  date: string;
  year: number;
  actual: number;
  diff: number;
  diffPct: number;
  note?: string;
  proj20: number;
  proj15: number;
  proj10: number;
  proj5: number;
}

// ===== 資産入力 =====
export const assets: Asset[] = [
  {
    id: "a1",
    category: "株式_米国",
    symbol: "B",
    name: "バリック・マイニング",
    value: 772489,
    prevMonthDiff: 45721,
    prevMonthPct: 6.29,
    assetClass: "us_stock",
  },
  {
    id: "a2",
    category: "株式_米国",
    symbol: "FCX",
    name: "フリーポート・マクモラン",
    value: 0,
    prevMonthDiff: -977367,
    prevMonthPct: -100,
    assetClass: "us_stock",
  },
  {
    id: "a3",
    category: "株式_日本",
    symbol: "5332",
    name: "TOTO",
    value: 608500,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a4",
    category: "株式_日本",
    symbol: "5955",
    name: "ワイズHD(信用)",
    value: 300300,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a5",
    category: "株式_日本",
    symbol: "5707",
    name: "東邦亜鉛",
    value: 1028400,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a6",
    category: "株式_日本",
    symbol: "7527",
    name: "システムソフト",
    value: 1292100,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a7",
    category: "株式_日本",
    symbol: "5955",
    name: "ワイズHD(現物)",
    value: 294000,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a8",
    category: "株式_日本",
    symbol: "7776",
    name: "セルシード",
    value: 105300,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a9",
    category: "株式_日本",
    symbol: "7794",
    name: "イーディーピー",
    value: 444000,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "jp_stock",
  },
  {
    id: "a10",
    category: "現金_JPY",
    symbol: "JPY",
    name: "円（PAYPAY銀行）",
    value: 97452,
    prevMonthDiff: 85721,
    prevMonthPct: 7.31,
    assetClass: "cash_jpy",
  },
  {
    id: "a11",
    category: "現金_JPY",
    symbol: "JPY",
    name: "円（PayPayカード）",
    value: -79950,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "cash_jpy",
  },
  {
    id: "a12",
    category: "現金_JPY",
    symbol: "JPY",
    name: "円（楽天銀行）",
    value: 1103083,
    prevMonthDiff: 675168,
    prevMonthPct: 157.78,
    assetClass: "cash_jpy",
  },
  {
    id: "a13",
    category: "現金_JPY",
    symbol: "JPY",
    name: "円（楽天証券）",
    value: 742833,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "cash_jpy",
  },
  {
    id: "a14",
    category: "現金_USD",
    symbol: "USD",
    name: "ドル（楽天証券）",
    value: 39289,
    prevMonthDiff: -1157,
    prevMonthPct: -2.86,
    assetClass: "cash_usd",
  },
  {
    id: "a15",
    category: "現金_JPY",
    symbol: "JPY",
    name: "円（楽天カード）",
    value: -818454,
    prevMonthDiff: 0,
    prevMonthPct: 0,
    assetClass: "cash_jpy",
  },
  {
    id: "a16",
    category: "貴金属_金",
    symbol: "GLD",
    name: "ゴールド_楽天",
    value: 28310,
    prevMonthDiff: -2047748,
    prevMonthPct: -98.64,
    assetClass: "au",
  },
  {
    id: "a17",
    category: "貴金属_金",
    symbol: "GLD",
    name: "ゴールド_現物_天皇記念",
    value: 567520,
    prevMonthDiff: -27680,
    prevMonthPct: -4.65,
    assetClass: "au",
  },
  {
    id: "a18",
    category: "貴金属_金",
    symbol: "GLD",
    name: "ゴールド_現物_コイン",
    value: 706072,
    prevMonthDiff: 29112,
    prevMonthPct: 4.3,
    assetClass: "au",
  },
  {
    id: "a19",
    category: "貴金属_金",
    symbol: "GLD",
    name: "ゴールド_現物_ピン",
    value: 265032,
    prevMonthDiff: 237032,
    prevMonthPct: 846.54,
    assetClass: "au",
  },
  {
    id: "a20",
    category: "貴金属_銀",
    symbol: "SLV",
    name: "シルバー_楽天",
    value: 59361,
    prevMonthDiff: -227880,
    prevMonthPct: -79.33,
    assetClass: "ag",
  },
  {
    id: "a21",
    category: "貴金属_銀",
    symbol: "SLV",
    name: "銀_現物",
    value: 4614855,
    prevMonthDiff: -68670,
    prevMonthPct: -1.47,
    assetClass: "ag",
  },
  {
    id: "a22",
    category: "貴金属_銅",
    symbol: "COP",
    name: "銅_現物（各種合計）",
    value: 287949,
    prevMonthDiff: 44481,
    prevMonthPct: 18.29,
    assetClass: "cu",
  },
  {
    id: "a23",
    category: "貴金属_合金",
    symbol: "MET",
    name: "12%金パラ（3種合計）",
    value: 1493315,
    prevMonthDiff: 52022,
    prevMonthPct: 3.61,
    assetClass: "metal_alloy",
  },
];

// ===== 資産状況 =====
export const allocations: AssetAllocation[] = [
  {
    assetType: "us_stock",
    label: "米国株",
    currentPct: 5.54,
    currentValue: 772489,
    targetPct: 15,
    targetValue: 2092763,
    rebalanceNeeded: 1320274,
    targetReturn: 20,
  },
  {
    assetType: "jp_stock",
    label: "日本株",
    currentPct: 29.19,
    currentValue: 4072600,
    targetPct: 15,
    targetValue: 2092763,
    rebalanceNeeded: -1979837,
    targetReturn: 15,
  },
  {
    assetType: "cash_jpy",
    label: "現金JPY",
    currentPct: 7.49,
    currentValue: 1044964,
    targetPct: 10,
    targetValue: 1395176,
    rebalanceNeeded: 350212,
    targetReturn: 10,
  },
  {
    assetType: "cash_usd",
    label: "現金USD",
    currentPct: 0.28,
    currentValue: 39289,
    targetPct: 10,
    targetValue: 1395176,
    rebalanceNeeded: 1355887,
    targetReturn: 8,
  },
  {
    assetType: "au",
    label: "金(Au)",
    currentPct: 11.23,
    currentValue: 1566934,
    targetPct: 15,
    targetValue: 2092763,
    rebalanceNeeded: 525829,
    targetReturn: 5,
  },
  {
    assetType: "pt",
    label: "プラチナ(Pt)",
    currentPct: 0,
    currentValue: 0,
    targetPct: 15,
    targetValue: 2092763,
    rebalanceNeeded: 2092763,
    targetReturn: 3,
  },
  {
    assetType: "ag",
    label: "銀(Ag)",
    currentPct: 33.5,
    currentValue: 4674216,
    targetPct: 15,
    targetValue: 2092763,
    rebalanceNeeded: -2581453,
    targetReturn: -5,
  },
  {
    assetType: "cu",
    label: "銅(Cu)",
    currentPct: 2.06,
    currentValue: 287949,
    targetPct: 2.5,
    targetValue: 348794,
    rebalanceNeeded: 60844,
    targetReturn: -10,
  },
  {
    assetType: "metal_alloy",
    label: "金属合金(Mt)",
    currentPct: 10.7,
    currentValue: 1493315,
    targetPct: 2.5,
    targetValue: 348794,
    rebalanceNeeded: -1144521,
    targetReturn: -15,
  },
];

// ===== 資産推移 =====
export const monthlyHistory: MonthlySnapshot[] = [
  {
    date: "2024-08",
    year: 2024,
    actual: 3769039,
    diff: 0,
    diffPct: 0,
    proj20: 3769039,
    proj15: 3769039,
    proj10: 3769039,
    proj5: 3769039,
  },
  {
    date: "2024-09",
    year: 2024,
    actual: 4545375,
    diff: 776336,
    diffPct: 20.6,
    proj20: 5164115,
    proj15: 5088775,
    proj10: 4537828,
    proj5: 4212879,
  },
  {
    date: "2024-10",
    year: 2024,
    actual: 6001959,
    diff: 1456584,
    diffPct: 32.05,
    proj20: 7162856,
    proj15: 6719493,
    proj10: 5007463,
    proj5: 4484748,
  },
  {
    date: "2024-11",
    year: 2024,
    actual: 6856024,
    diff: 854065,
    diffPct: 14.23,
    proj20: 7536714,
    proj15: 7675662,
    proj10: 5514528,
    proj5: 4767450,
  },
  {
    date: "2024-12",
    year: 2024,
    actual: 11486012,
    diff: 4629988,
    diffPct: 67.53,
    note: "有紀33歳",
    proj20: 15176112,
    proj15: 12859165,
    proj10: 6062005,
    proj5: 5061418,
  },
  {
    date: "2025-01",
    year: 2025,
    actual: 9587994,
    diff: -1898018,
    diffPct: -16.52,
    proj20: 8075274,
    proj15: 10734239,
    proj10: 6653117,
    proj5: 5367100,
  },
  {
    date: "2025-02",
    year: 2025,
    actual: 8241122,
    diff: -1346872,
    diffPct: -14.05,
    proj20: 7167665,
    proj15: 9226348,
    proj10: 7291341,
    proj5: 5684964,
  },
  {
    date: "2025-03",
    year: 2025,
    actual: 7705919,
    diff: -535203,
    diffPct: -6.49,
    proj20: 7279362,
    proj15: 8627162,
    proj10: 7980431,
    proj5: 6015495,
  },
  {
    date: "2025-04",
    year: 2025,
    actual: 7853292,
    diff: 147373,
    diffPct: 1.91,
    proj20: 7970748,
    proj15: 8792153,
    proj10: 8724441,
    proj5: 6359198,
  },
  {
    date: "2025-05",
    year: 2025,
    actual: 9778982,
    diff: 1925690,
    diffPct: 24.52,
    note: "弘詩36歳",
    proj20: 11313757,
    proj15: 10948059,
    proj10: 9527749,
    proj5: 6716597,
  },
  {
    date: "2025-06",
    year: 2025,
    actual: 12049748,
    diff: 2270766,
    diffPct: 23.22,
    proj20: 13859549,
    proj15: 13490295,
    proj10: 10395080,
    proj5: 7088238,
  },
  {
    date: "2025-07",
    year: 2025,
    actual: 12250000,
    diff: 200252,
    diffPct: 1.66,
    proj20: 12409601,
    proj15: 13714488,
    proj10: 11331538,
    proj5: 7474689,
  },
  {
    date: "2025-08",
    year: 2025,
    actual: 11615000,
    diff: -635000,
    diffPct: -5.18,
    note: "覚醒",
    proj20: 11108905,
    proj15: 13003573,
    proj10: 12342632,
    proj5: 7876541,
  },
  {
    date: "2025-09",
    year: 2025,
    actual: 13003700,
    diff: 1388700,
    diffPct: 10.68,
    note: "交際",
    proj20: 14110494,
    proj15: 14558292,
    proj10: 13434310,
    proj5: 8294406,
  },
  {
    date: "2025-10",
    year: 2025,
    actual: 13700000,
    diff: 696300,
    diffPct: 5.08,
    proj20: 14254951,
    proj15: 16410691,
    proj10: 14612994,
    proj5: 8728923,
  },
  {
    date: "2025-11",
    year: 2025,
    actual: 14000000,
    diff: 300000,
    diffPct: 2.14,
    note: "挨拶",
    proj20: 14239100,
    proj15: 18484544,
    proj10: 15885620,
    proj5: 9180755,
  },
  {
    date: "2025-12",
    year: 2025,
    actual: 14500000,
    diff: 500000,
    diffPct: 3.45,
    note: "有紀34歳",
    proj20: 14898500,
    proj15: 20806327,
    proj10: 17259674,
    proj5: 9650593,
  },
  {
    date: "2026-01",
    year: 2026,
    actual: 12516348,
    diff: -1983652,
    diffPct: -15.85,
    note: "引越し",
    proj20: 10935377,
    proj15: 23405678,
    proj10: 18743240,
    proj5: 10139155,
  },
  {
    date: "2026-02",
    year: 2026,
    actual: 13951756,
    diff: 1435408,
    diffPct: 10.29,
    note: "勉強",
    proj20: 15095776,
    proj15: 26315782,
    proj10: 20345046,
    proj5: 10647185,
  },
];

// ===== 計算関数 =====
export function getAssetSummary() {
  const totalValue = 13951756.09; // from Excel Row 39 col 8
  const positiveAssets = assets.filter((a) => a.value > 0).reduce((s, a) => s + a.value, 0);
  const debts = assets.filter((a) => a.value < 0).reduce((s, a) => s + Math.abs(a.value), 0);
  const grossAssets = positiveAssets;
  const netAssets = totalValue;
  const equityRatio = netAssets / grossAssets;

  // Investment capacity at 80% equity ratio
  // netAssets / (grossAssets + X) >= 0.80
  // netAssets >= 0.80 * (grossAssets + X)
  // X <= (netAssets / 0.80) - grossAssets
  const maxAdditionalDebt = netAssets / 0.8 - grossAssets;
  const investmentCapacity = Math.max(0, maxAdditionalDebt);

  // Liquid assets (cash + tradeable)
  const liquidCash = assets
    .filter((a) => a.assetClass === "cash_jpy" && a.value > 0)
    .reduce((s, a) => s + a.value, 0);
  const liquidStocks = assets
    .filter((a) => ["us_stock", "jp_stock"].includes(a.assetClass))
    .reduce((s, a) => s + a.value, 0);

  // Monthly compound rate (from 2024-08 to 2026-02 = 18 months)
  const months = 18;
  const startValue = 3769039;
  const endValue = 13951756;
  const monthlyRate = Math.pow(endValue / startValue, 1 / months) - 1;
  const annualRate = Math.pow(1 + monthlyRate, 12) - 1;

  return {
    totalValue,
    grossAssets,
    debts,
    netAssets,
    equityRatio,
    equityRatioPct: equityRatio * 100,
    investmentCapacity,
    liquidCash,
    liquidStocks,
    monthlyRate: monthlyRate * 100,
    annualRate: annualRate * 100,
  };
}

// Category grouping
export function getAssetsByCategory() {
  const groups: Record<string, { label: string; total: number; color: string; items: Asset[] }> = {
    us_stock: { label: "米国株", total: 0, color: "#4A90D9", items: [] },
    jp_stock: { label: "日本株", total: 0, color: "#E74C3C", items: [] },
    cash_jpy: { label: "現金JPY", total: 0, color: "#2ECC71", items: [] },
    cash_usd: { label: "現金USD", total: 0, color: "#27AE60", items: [] },
    au: { label: "金(Au)", total: 0, color: "#F1C40F", items: [] },
    ag: { label: "銀(Ag)", total: 0, color: "#BDC3C7", items: [] },
    cu: { label: "銅(Cu)", total: 0, color: "#E67E22", items: [] },
    metal_alloy: { label: "金属合金", total: 0, color: "#8E44AD", items: [] },
  };
  for (const a of assets) {
    if (groups[a.assetClass]) {
      groups[a.assetClass].items.push(a);
      groups[a.assetClass].total += a.value;
    }
  }
  return groups;
}
