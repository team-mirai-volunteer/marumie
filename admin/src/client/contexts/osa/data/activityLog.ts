// OSA Agent Activity Log - 完了タスクの履歴蓄積
// ダッシュボードのゲージや進捗バーにホバー/クリックで表示

export type ActivityCategory =
  | "ebay"
  | "investment"
  | "bim"
  | "robotics"
  | "academy"
  | "asset"
  | "system";
export type ActivityImpact = "high" | "medium" | "low";

export interface ActivityEntry {
  id: string;
  date: string; // ISO timestamp
  category: ActivityCategory;
  title: string; // 短い要約（ホバーで表示）
  detail: string; // 詳細説明（クリックで表示）
  outcome: string; // 成果・結果
  metrics?: string[]; // 定量的成果
  impact: ActivityImpact;
  relatedTaskIds?: string[];
  tags: string[];
}

export const activityLog: ActivityEntry[] = [
  // === 2026-03-07 ===
  {
    id: "act-001",
    date: "2026-03-07T09:00:00",
    category: "system",
    title: "OSA Agentダッシュボード構築",
    detail:
      "OSAの5プロジェクト全体を統合管理するReactダッシュボードを構築。プロジェクト別進捗、KPI、PDCA管理、タイムライン可視化を実装。",
    outcome: "BI基盤が稼働開始。全プロジェクトの進捗を一元的に確認可能に。",
    metrics: ["5プロジェクト統合", "KPIレーダーチャート", "自動PDCAログ"],
    impact: "high",
    tags: ["ダッシュボード", "React", "可視化"],
  },
  {
    id: "act-002",
    date: "2026-03-07T10:00:00",
    category: "asset",
    title: "資産管理パネル実装（複利計算シート統合）",
    detail:
      "複利計算シート.xlsxの3シート（資産入力・資産状況・資産推移）をダッシュボードに統合。自己資本比率コントロール、投資可能額算定、複利プロジェクション、資産クラス構成、リバランス目標を実装。",
    outcome: "自己資本比率93.9%を確認。80%維持条件で約259万円の追加投資余力を算定。",
    metrics: ["純資産: ¥13,951,756", "自己資本比率: 93.9%", "投資可能額: ¥2,589,535"],
    impact: "high",
    relatedTaskIds: [],
    tags: ["資産管理", "自己資本比率", "複利計算"],
  },
  {
    id: "act-003",
    date: "2026-03-07T11:00:00",
    category: "ebay",
    title: "eBay期限超過注文の対応完了",
    detail:
      "8日間未処理だった注文（NEEDY STREAMER OVERLOAD Tシャツ $148.73）を発見。無在庫出品の在庫切れのため、購入者（Alden Cantu）に誠実なメッセージを送信し、全額返金・キャンセル処理を実行。",
    outcome:
      "キャンセル完了。手数料$22.99の損失で済み、アカウント保全を優先した正しい判断。中古品を新品として送るリスクを回避。",
    metrics: ["返金額: $139.00", "手数料損失: $22.99", "アカウントDefect回避"],
    impact: "high",
    relatedTaskIds: ["e1"],
    tags: ["eBay", "顧客対応", "キャンセル", "リスク回避"],
  },
  {
    id: "act-004",
    date: "2026-03-07T12:00:00",
    category: "ebay",
    title: "出品中全5商品の在庫棚卸し完了",
    detail:
      "出品中5商品（Nijisanji缶バッジ、ねんどろいどアーニャ、Van Cleef空箱、ポケモン一番くじ×2）の実在庫とeBay出品数を照合。ニャオハぬいぐるみの出品数不一致（2→1）を修正。",
    outcome: "在庫数の不一致を1件発見・修正。同じトラブルの再発を防止。",
    metrics: ["確認商品: 5件", "不一致修正: 1件", "未出品在庫: 2件発見"],
    impact: "medium",
    relatedTaskIds: ["e1"],
    tags: ["eBay", "在庫管理", "棚卸し"],
  },
  {
    id: "act-005",
    date: "2026-03-07T12:30:00",
    category: "ebay",
    title: "eBayアクションプラン15ステップ策定",
    detail:
      "eBayセラーアカウント設定最適化タスクを15の具体的ステップに細分化。Phase 0-A（アカウント基盤）、Phase 0-B（ストア設計）、Phase 0-C（出品準備・SEO）の3フェーズに構造化。各ステップの担当（宮野/Agent）と所要時間を明確化。",
    outcome: "エージェント作業7時間、宮野さん作業1時間15分の具体的なアクションプランが完成。",
    metrics: ["15ステップ策定", "宮野作業: 1h15m", "Agent作業: 7h"],
    impact: "medium",
    relatedTaskIds: ["e1", "e2", "e3", "e4", "e5"],
    tags: ["eBay", "アクションプラン", "タスク設計"],
  },
  {
    id: "act-006",
    date: "2026-03-07T14:00:00",
    category: "system",
    title: "LINE通知システム構築・稼働開始",
    detail:
      "LINE Messaging APIを活用した通知システムをSupabase Edge Functionとして構築・デプロイ。5つの通知カテゴリ（📦注文/🔄PDCA/⚠️アラート/✅タスク/🤖一般）に対応。APIキー認証付き。ローカル実行用シェルスクリプトも配備。",
    outcome:
      "テスト送信成功。eBay注文通知やPDCAレビュー結果をLINEにプッシュ通知可能に。今回のような注文見逃しを防止する基盤が完成。",
    metrics: ["Edge Function稼働", "5カテゴリ通知", "テスト送信成功"],
    impact: "high",
    relatedTaskIds: [],
    tags: ["LINE", "通知", "Supabase", "インフラ"],
  },
];

// ===== Helper Functions =====

/** 日付別にグループ化 */
export function getActivitiesByDate(): Record<string, ActivityEntry[]> {
  const grouped: Record<string, ActivityEntry[]> = {};
  for (const entry of activityLog) {
    const dateKey = entry.date.split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  }
  return grouped;
}

/** カテゴリ別にグループ化 */
export function getActivitiesByCategory(): Record<ActivityCategory, ActivityEntry[]> {
  const grouped = {} as Record<ActivityCategory, ActivityEntry[]>;
  for (const entry of activityLog) {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push(entry);
  }
  return grouped;
}

/** 直近N件取得 */
export function getRecentActivities(n: number): ActivityEntry[] {
  return [...activityLog]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
}

/** カテゴリ別の完了数 */
export function getActivityStats() {
  const stats = {
    total: activityLog.length,
    highImpact: activityLog.filter((a) => a.impact === "high").length,
    mediumImpact: activityLog.filter((a) => a.impact === "medium").length,
    lowImpact: activityLog.filter((a) => a.impact === "low").length,
    byCategory: {} as Record<string, number>,
    todayCount: 0,
  };
  const today = new Date().toISOString().split("T")[0];
  for (const entry of activityLog) {
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
    if (entry.date.startsWith(today)) stats.todayCount++;
  }
  return stats;
}

export const categoryInfo: Record<
  ActivityCategory,
  { label: string; icon: string; color: string }
> = {
  ebay: { label: "eBay", icon: "🛒", color: "#D4A574" },
  investment: { label: "投資", icon: "📈", color: "#7B9E6B" },
  bim: { label: "BIM", icon: "🏛️", color: "#8B7355" },
  robotics: { label: "ロボ", icon: "🤖", color: "#6B8E9E" },
  academy: { label: "学習塾", icon: "🎓", color: "#9E6B8B" },
  asset: { label: "資産", icon: "💰", color: "#D4A500" },
  system: { label: "システム", icon: "⚙️", color: "#64748b" },
};
