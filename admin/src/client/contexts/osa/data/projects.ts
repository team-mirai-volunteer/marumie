// OSA Agent Project Data - Central data store for all 5 projects
// This file serves as the single source of truth for the OSA Agent Dashboard

export type TaskStatus = "not_started" | "in_progress" | "done" | "blocked";
export type ProjectPhase = "planning" | "active" | "scaling";
export type PDCACycle = "plan" | "do" | "check" | "act";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  owner: "hiroshi" | "agent" | "both";
  estimatedHours: number;
  deadline?: string;
  dependencies?: string[];
  investmentJPY?: number;
  category: "research" | "development" | "operation" | "marketing" | "education";
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  tasks: Task[];
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  nameJP: string;
  osaUnit: string;
  icon: string;
  color: string;
  phase: ProjectPhase;
  description: string;
  vision: string;
  milestones: Milestone[];
  pdcaLog: PDCAEntry[];
  investmentTotal: number;
  monthlyRevenue: number;
  kpis: KPI[];
}

export interface PDCAEntry {
  timestamp: string;
  cycle: PDCACycle;
  content: string;
  actionItems: string[];
}

export interface KPI {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export const projects: Project[] = [
  {
    id: "ebay",
    name: "eBay Dropshipping",
    nameJP: "eBay無在庫販売",
    osaUnit: "OSA-Trades",
    icon: "🛒",
    color: "#D4A574",
    phase: "active",
    description:
      "eBayでの無在庫販売によるキャッシュフロー構築。リサーチ→出品→顧客対応→発送までの一連フロー。",
    vision: "OSA全事業の資金的な循環の起点。月商100万円→年商2000万円へ。",
    investmentTotal: 50000,
    monthlyRevenue: 0,
    kpis: [
      { name: "出品数", current: 0, target: 100, unit: "件" },
      { name: "月間売上", current: 0, target: 500000, unit: "円" },
      { name: "利益率", current: 0, target: 25, unit: "%" },
      { name: "顧客満足度", current: 0, target: 4.8, unit: "★" },
    ],
    milestones: [
      {
        id: "ebay-m1",
        title: "Phase 0: 基盤構築（Week 1-2）",
        targetDate: "2026-03-21",
        completed: false,
        tasks: [
          {
            id: "e1",
            title: "eBayセラーアカウント設定最適化",
            description: "ストアプラン選定、ペイメント設定、返品ポリシー設定",
            status: "not_started",
            owner: "both",
            estimatedHours: 3,
            category: "operation",
          },
          {
            id: "e2",
            title: "利益率の高いニッチカテゴリのリサーチ",
            description: "Terapeak、日本製品の海外需要分析、競合セラー分析",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "e3",
            title: "仕入先リスト作成（国内EC比較）",
            description: "Amazon JP、楽天、Yahoo、メルカリの価格比較DB構築",
            status: "not_started",
            owner: "agent",
            estimatedHours: 6,
            category: "research",
          },
          {
            id: "e4",
            title: "出品テンプレート作成",
            description: "英語商品説明テンプレート、写真加工ワークフロー",
            status: "not_started",
            owner: "agent",
            estimatedHours: 4,
            category: "development",
          },
          {
            id: "e5",
            title: "EMS/国際発送フロー整備",
            description: "日本郵便API連携、送り状テンプレート、集荷依頼自動化",
            status: "not_started",
            owner: "both",
            estimatedHours: 5,
            category: "operation",
          },
        ],
      },
      {
        id: "ebay-m2",
        title: "Phase 1: 初期出品30品（Week 3-4）",
        targetDate: "2026-04-04",
        completed: false,
        tasks: [
          {
            id: "e6",
            title: "初回30品のリサーチ＆出品",
            description: "選定→写真→説明文→価格設定→出品",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "operation",
          },
          {
            id: "e7",
            title: "価格自動調整ツール検討",
            description: "リプライサーツール比較（eBay Repricer等）",
            status: "not_started",
            owner: "agent",
            estimatedHours: 3,
            category: "research",
          },
          {
            id: "e8",
            title: "顧客対応テンプレート作成",
            description: "英語FAQ、返品対応、追跡番号通知テンプレート",
            status: "not_started",
            owner: "agent",
            estimatedHours: 4,
            category: "development",
          },
        ],
      },
      {
        id: "ebay-m3",
        title: "Phase 2: 100品＆自動化（Month 2-3）",
        targetDate: "2026-05-31",
        completed: false,
        tasks: [
          {
            id: "e9",
            title: "100品目標出品",
            description: "週20品ペースで拡大",
            status: "not_started",
            owner: "both",
            estimatedHours: 40,
            category: "operation",
          },
          {
            id: "e10",
            title: "eBay API連携ツール開発",
            description: "在庫管理・出品自動化・価格監視",
            status: "not_started",
            owner: "agent",
            estimatedHours: 20,
            category: "development",
            investmentJPY: 0,
          },
          {
            id: "e11",
            title: "売上分析ダッシュボード構築",
            description: "カテゴリ別利益率、回転率分析",
            status: "not_started",
            owner: "agent",
            estimatedHours: 10,
            category: "development",
          },
        ],
      },
    ],
    pdcaLog: [
      {
        timestamp: "2026-03-07T09:00:00",
        cycle: "plan",
        content: "OSAエージェント基盤構築開始。eBay事業の全体設計とタスク分解完了。",
        actionItems: ["ニッチカテゴリリサーチ開始", "セラーアカウント最適化"],
      },
    ],
  },
  {
    id: "investment",
    name: "Investment Agent",
    nameJP: "投資エージェント",
    osaUnit: "OSA-Trades / OSA-Lab",
    icon: "📈",
    color: "#7B9E6B",
    phase: "planning",
    description:
      "シクリカルバリュー投資のファンダメンタルズ分析＋テクニカル分析の自動化エージェント。",
    vision:
      "たーちゃんのシクリカルバリュー投資×tori tradesのテクニカル分析をエージェント化し、Webull/TradingViewと連携。",
    investmentTotal: 30000,
    monthlyRevenue: 0,
    kpis: [
      { name: "分析銘柄数", current: 0, target: 50, unit: "銘柄" },
      { name: "バックテスト勝率", current: 0, target: 65, unit: "%" },
      { name: "シグナル精度", current: 0, target: 70, unit: "%" },
      { name: "API連携数", current: 0, target: 3, unit: "件" },
    ],
    milestones: [
      {
        id: "inv-m1",
        title: "Phase 0: リサーチ＆手法整理（Week 1-3）",
        targetDate: "2026-03-28",
        completed: false,
        tasks: [
          {
            id: "i1",
            title: "たーちゃん投資手法の体系化",
            description:
              "シクリカルバリュー投資の判断基準を構造化。有価証券報告書の見るべきポイント整理。",
            status: "not_started",
            owner: "agent",
            estimatedHours: 10,
            category: "research",
          },
          {
            id: "i2",
            title: "tori trades手法の体系化",
            description: "テクニカル分析の指標、エントリー/イグジットルール整理",
            status: "not_started",
            owner: "agent",
            estimatedHours: 10,
            category: "research",
          },
          {
            id: "i3",
            title: "有価証券報告書EDINET API調査",
            description: "EDINET APIでの自動取得フロー構築可能性調査",
            status: "not_started",
            owner: "agent",
            estimatedHours: 5,
            category: "research",
          },
          {
            id: "i4",
            title: "路線価・地価データソース調査",
            description: "国土交通省API、路線価DB等のデータ取得方法調査",
            status: "not_started",
            owner: "agent",
            estimatedHours: 4,
            category: "research",
          },
          {
            id: "i5",
            title: "Webull API / TradingView API調査",
            description: "API仕様、制限、認証方式、法的要件の確認",
            status: "not_started",
            owner: "agent",
            estimatedHours: 6,
            category: "research",
          },
        ],
      },
      {
        id: "inv-m2",
        title: "Phase 1: ファンダメンタルズ分析エージェント（Month 2）",
        targetDate: "2026-04-30",
        completed: false,
        tasks: [
          {
            id: "i6",
            title: "EDINET自動取得＆解析ツール",
            description: "有価証券報告書の自動DL→テキスト解析→重要指標抽出",
            status: "not_started",
            owner: "agent",
            estimatedHours: 20,
            category: "development",
          },
          {
            id: "i7",
            title: "簿価vs時価乖離分析ツール",
            description: "保有不動産の簿価と路線価の比較分析自動化",
            status: "not_started",
            owner: "agent",
            estimatedHours: 15,
            category: "development",
          },
          {
            id: "i8",
            title: "シクリカル判定スコアリング",
            description: "景気循環セクターの分類とバリュエーション自動評価",
            status: "not_started",
            owner: "agent",
            estimatedHours: 12,
            category: "development",
          },
        ],
      },
      {
        id: "inv-m3",
        title: "Phase 2: テクニカル分析＆取引（Month 3-4）",
        targetDate: "2026-06-30",
        completed: false,
        tasks: [
          {
            id: "i9",
            title: "テクニカル分析エージェント開発",
            description: "tori trades手法のアルゴリズム実装、バックテスト",
            status: "not_started",
            owner: "agent",
            estimatedHours: 25,
            category: "development",
          },
          {
            id: "i10",
            title: "TradingView連携",
            description: "Pine Script / Webhook連携でシグナル通知",
            status: "not_started",
            owner: "agent",
            estimatedHours: 15,
            category: "development",
          },
          {
            id: "i11",
            title: "Webull API取引実装",
            description: "※法的確認後。ペーパートレード→実取引段階的移行",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "development",
            investmentJPY: 0,
          },
        ],
      },
    ],
    pdcaLog: [
      {
        timestamp: "2026-03-07T09:00:00",
        cycle: "plan",
        content: "投資エージェントの全体設計完了。法的要件の確認が最優先。",
        actionItems: ["投資手法の構造化", "API調査開始"],
      },
    ],
  },
  {
    id: "bim",
    name: "Voice BIM Workflow",
    nameJP: "音声入力BIM設計",
    osaUnit: "OSA-Architects",
    icon: "🏛️",
    color: "#8B7355",
    phase: "planning",
    description: "音声入力によるBIM設計ワークフロー。Revit、Dynamo、Grasshopperを統合。",
    vision:
      "音声でBIMモデルを操作し、古民家3DスキャンからBIMモデル生成→古材マーケットプレイスまで一気通貫。",
    investmentTotal: 100000,
    monthlyRevenue: 0,
    kpis: [
      { name: "対応コマンド数", current: 0, target: 50, unit: "個" },
      { name: "音声認識精度", current: 0, target: 95, unit: "%" },
      { name: "ワークフロー数", current: 0, target: 10, unit: "本" },
      { name: "BIMモデル生成数", current: 0, target: 5, unit: "件" },
    ],
    milestones: [
      {
        id: "bim-m1",
        title: "Phase 0: 技術調査＆プロトタイプ（Month 1）",
        targetDate: "2026-04-07",
        completed: false,
        tasks: [
          {
            id: "b1",
            title: "音声認識API比較調査",
            description: "Whisper API、Google Speech-to-Text、Azure Speech比較",
            status: "not_started",
            owner: "agent",
            estimatedHours: 6,
            category: "research",
          },
          {
            id: "b2",
            title: "Revit API / Dynamo調査",
            description: "Revit APIのPython連携、Dynamoノード操作の自動化可能性",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "b3",
            title: "Grasshopper API連携調査",
            description: "Rhino.Compute、Hops、GH Playerの可能性調査",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "b4",
            title: "コマンド体系設計",
            description: "建築設計における音声コマンドの構造設計（壁作成、窓配置等）",
            status: "not_started",
            owner: "both",
            estimatedHours: 10,
            category: "development",
          },
        ],
      },
      {
        id: "bim-m2",
        title: "Phase 1: MVP（Month 2-3）",
        targetDate: "2026-05-31",
        completed: false,
        tasks: [
          {
            id: "b5",
            title: "音声→テキスト→BIMコマンド変換パイプライン",
            description: "Whisper + LLM + Revit/GH API連携のMVP",
            status: "not_started",
            owner: "agent",
            estimatedHours: 30,
            category: "development",
            investmentJPY: 10000,
          },
          {
            id: "b6",
            title: "Dynamoスクリプトライブラリ構築",
            description: "基本的な建築要素の生成・編集スクリプト群",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "development",
          },
          {
            id: "b7",
            title: "Grasshopperパラメトリック設計連携",
            description: "音声パラメータ入力→GHモデル生成",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "development",
          },
        ],
      },
    ],
    pdcaLog: [
      {
        timestamp: "2026-03-07T09:00:00",
        cycle: "plan",
        content:
          "BIMワークフローの技術スタック選定フェーズ。宮野さんの既存ツール環境の確認が必要。",
        actionItems: ["音声認識API調査", "Revit/GH API調査"],
      },
    ],
  },
  {
    id: "robotics",
    name: "Robot Arm Operations",
    nameJP: "ロボットアーム操作",
    osaUnit: "OSA-Lab",
    icon: "🤖",
    color: "#6B8E9E",
    phase: "planning",
    description: "ロボットアームによる物理世界の自動化。ホットケーキ屋、eBay梱包ライン等。",
    vision: "デジタルファブリケーションと物理世界の接続。教育コンテンツとしても展開。",
    investmentTotal: 300000,
    monthlyRevenue: 0,
    kpis: [
      { name: "自動化タスク数", current: 0, target: 5, unit: "種類" },
      { name: "ロボット稼働時間", current: 0, target: 100, unit: "時間/月" },
      { name: "梱包処理数", current: 0, target: 50, unit: "件/日" },
      { name: "教育コンテンツ", current: 0, target: 10, unit: "本" },
    ],
    milestones: [
      {
        id: "rob-m1",
        title: "Phase 0: 機材選定＆基礎学習（Month 1-2）",
        targetDate: "2026-04-30",
        completed: false,
        tasks: [
          {
            id: "r1",
            title: "ロボットアーム比較調査",
            description: "uArm, Dobot, xArm, UR等の比較。精度、可搬重量、価格、SDK",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
            investmentJPY: 0,
          },
          {
            id: "r2",
            title: "ROS2環境構築調査",
            description: "ROS2 Humble/Iron、MoveIt2、Gazeboシミュレーション",
            status: "not_started",
            owner: "agent",
            estimatedHours: 10,
            category: "research",
          },
          {
            id: "r3",
            title: "コンピュータビジョン基盤調査",
            description: "OpenCV、YOLO、深度カメラ（RealSense）連携",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "r4",
            title: "ロボットアーム購入＆セットアップ",
            description: "選定したロボットアームの購入と初期セットアップ",
            status: "not_started",
            owner: "hiroshi",
            estimatedHours: 10,
            category: "operation",
            investmentJPY: 150000,
          },
        ],
      },
      {
        id: "rob-m2",
        title: "Phase 1: ピック＆プレース基本動作（Month 3-4）",
        targetDate: "2026-06-30",
        completed: false,
        tasks: [
          {
            id: "r5",
            title: "基本動作プログラミング",
            description: "ピック＆プレース、パレタイジングの基本動作",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "development",
          },
          {
            id: "r6",
            title: "eBay梱包自動化プロトタイプ",
            description: "箱詰め→緩衝材→封函の一連動作",
            status: "not_started",
            owner: "both",
            estimatedHours: 30,
            category: "development",
          },
          {
            id: "r7",
            title: "ホットケーキ焼き実験",
            description: "生地注入→フリップ→盛り付けの自動化実験",
            status: "not_started",
            owner: "hiroshi",
            estimatedHours: 20,
            category: "development",
          },
        ],
      },
    ],
    pdcaLog: [
      {
        timestamp: "2026-03-07T09:00:00",
        cycle: "plan",
        content: "ロボティクスプロジェクト計画策定。機材選定が最初の判断ポイント。",
        actionItems: ["ロボットアーム比較調査開始", "ROS2学習リソース整理"],
      },
    ],
  },
  {
    id: "academy",
    name: "AI Learning Academy",
    nameJP: "古民家AI学習塾",
    osaUnit: "ASO-Academy",
    icon: "🎓",
    color: "#9E6B8B",
    phase: "planning",
    description: "古民家でAIエージェントとロボティクスを子供たちに教える学習塾。",
    vision: "子供たちがAIやロボットを身近に感じ、自らを未来に投企する力を育む場。",
    investmentTotal: 500000,
    monthlyRevenue: 0,
    kpis: [
      { name: "生徒数", current: 0, target: 20, unit: "人" },
      { name: "カリキュラム数", current: 0, target: 8, unit: "科目" },
      { name: "スタッフ数", current: 0, target: 3, unit: "人" },
      { name: "月間授業回数", current: 0, target: 12, unit: "回" },
    ],
    milestones: [
      {
        id: "aca-m1",
        title: "Phase 0: 企画＆場所探し（Month 1-3）",
        targetDate: "2026-05-31",
        completed: false,
        tasks: [
          {
            id: "a1",
            title: "古民家物件リサーチ",
            description: "広島県内の空き家バンク、古民家賃貸物件調査",
            status: "not_started",
            owner: "both",
            estimatedHours: 10,
            category: "research",
          },
          {
            id: "a2",
            title: "学習塾の開業要件調査",
            description: "許認可、消防法、建築基準法、保険等の法的要件",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "a3",
            title: "カリキュラム骨格設計",
            description: "AI/ロボット/プログラミング/建築のカリキュラム設計",
            status: "not_started",
            owner: "both",
            estimatedHours: 15,
            category: "development",
          },
          {
            id: "a4",
            title: "補助金・助成金調査",
            description: "教育系、地域創生系、空き家活用系の補助金リサーチ",
            status: "not_started",
            owner: "agent",
            estimatedHours: 8,
            category: "research",
          },
          {
            id: "a5",
            title: "事業計画書作成",
            description: "収支計画、マーケティング計画、人材計画",
            status: "not_started",
            owner: "agent",
            estimatedHours: 12,
            category: "development",
          },
        ],
      },
      {
        id: "aca-m2",
        title: "Phase 1: プレオープン（Month 4-6）",
        targetDate: "2026-08-31",
        completed: false,
        tasks: [
          {
            id: "a6",
            title: "古民家契約＆改修",
            description: "物件契約、最低限の改修（電気、ネット、安全対策）",
            status: "not_started",
            owner: "hiroshi",
            estimatedHours: 40,
            category: "operation",
            investmentJPY: 200000,
          },
          {
            id: "a7",
            title: "スタッフ採用",
            description: "学生アルバイト、シングルマザー等の採用活動",
            status: "not_started",
            owner: "hiroshi",
            estimatedHours: 15,
            category: "operation",
          },
          {
            id: "a8",
            title: "教材・機材準備",
            description: "PC、ロボットキット、教材制作",
            status: "not_started",
            owner: "both",
            estimatedHours: 20,
            category: "development",
            investmentJPY: 150000,
          },
          {
            id: "a9",
            title: "体験会開催（無料）",
            description: "地域の子供向け無料体験会を2-3回開催",
            status: "not_started",
            owner: "hiroshi",
            estimatedHours: 15,
            category: "marketing",
          },
        ],
      },
    ],
    pdcaLog: [
      {
        timestamp: "2026-03-07T09:00:00",
        cycle: "plan",
        content: "学習塾構想の計画策定。古民家物件と法的要件の調査から開始。",
        actionItems: ["開業要件調査", "補助金リサーチ", "カリキュラム設計開始"],
      },
    ],
  },
];

// Summary calculations
export function getProjectSummary(project: Project) {
  const allTasks = project.milestones.flatMap((m) => m.tasks);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress").length;
  const totalHours = allTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completedHours = allTasks
    .filter((t) => t.status === "done")
    .reduce((sum, t) => sum + t.estimatedHours, 0);
  const agentTasks = allTasks.filter((t) => t.owner === "agent" || t.owner === "both").length;
  const hiroshiTasks = allTasks.filter((t) => t.owner === "hiroshi" || t.owner === "both").length;

  return {
    totalTasks,
    doneTasks,
    inProgressTasks,
    progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    totalHours,
    completedHours,
    agentTasks,
    hiroshiTasks,
  };
}

export function getAllProjectsSummary() {
  const totalInvestment = projects.reduce((sum, p) => sum + p.investmentTotal, 0);
  const totalRevenue = projects.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const allTasks = projects.flatMap((p) => p.milestones.flatMap((m) => m.tasks));
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.status === "done").length;

  return {
    totalProjects: projects.length,
    totalInvestment,
    totalRevenue,
    totalTasks,
    doneTasks,
    overallProgress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
  };
}
