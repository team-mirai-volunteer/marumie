"use client";

import { useState } from "react";
import {
  projects,
  getProjectSummary,
  getAllProjectsSummary,
} from "@/client/contexts/osa/data/projects";
import type { Project, Task, TaskStatus } from "@/client/contexts/osa/data/projects";
import {
  assets,
  allocations,
  monthlyHistory,
  getAssetSummary,
  getAssetsByCategory,
} from "@/client/contexts/osa/data/assets";
import {
  activityLog,
  getActivitiesByDate,
  getRecentActivities,
  getActivityStats,
  categoryInfo,
} from "@/client/contexts/osa/data/activityLog";
import type { ActivityEntry, ActivityCategory } from "@/client/contexts/osa/data/activityLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/components/ui/tabs";
import { Badge } from "@/client/components/ui/badge";
import { Progress } from "@/client/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

const statusColors: Record<TaskStatus, string> = {
  not_started: "#94a3b8",
  in_progress: "#f59e0b",
  done: "#22c55e",
  blocked: "#ef4444",
};

const statusLabels: Record<TaskStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  done: "完了",
  blocked: "ブロック",
};

function OverviewPanel() {
  const summary = getAllProjectsSummary();
  const recentActs = getRecentActivities(6);
  const actStats = getActivityStats();
  const projectData = projects.map((p) => {
    const s = getProjectSummary(p);
    return {
      name: p.icon + " " + p.nameJP.slice(0, 6),
      progress: s.progress,
      tasks: s.totalTasks,
      done: s.doneTasks,
      color: p.color,
    };
  });

  const investmentData = projects.map((p) => ({
    name: p.icon,
    value: p.investmentTotal,
    color: p.color,
  }));

  const ownerData = [
    {
      name: "🤖 Agent",
      value: projects
        .flatMap((p) => p.milestones.flatMap((m) => m.tasks))
        .filter((t) => t.owner === "agent").length,
    },
    {
      name: "👤 宮野",
      value: projects
        .flatMap((p) => p.milestones.flatMap((m) => m.tasks))
        .filter((t) => t.owner === "hiroshi").length,
    },
    {
      name: "🤝 協働",
      value: projects
        .flatMap((p) => p.milestones.flatMap((m) => m.tasks))
        .filter((t) => t.owner === "both").length,
    },
  ];

  const timelineData = [
    { month: "3月", ebay: 30, investment: 20, bim: 15, robotics: 10, academy: 10 },
    { month: "4月", ebay: 60, investment: 40, bim: 30, robotics: 20, academy: 20 },
    { month: "5月", ebay: 80, investment: 55, bim: 45, robotics: 35, academy: 30 },
    { month: "6月", ebay: 90, investment: 70, bim: 60, robotics: 50, academy: 40 },
    { month: "7月", ebay: 95, investment: 80, bim: 70, robotics: 60, academy: 55 },
    { month: "8月", ebay: 100, investment: 90, bim: 80, robotics: 70, academy: 70 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 relative group" style={{ borderLeftColor: "#D4A574" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500 mb-1">プロジェクト数</p>
            <p className="text-2xl font-bold text-slate-800">{summary.totalProjects}</p>
          </CardContent>
          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px]">
            5事業を並行推進中
            {Object.entries(actStats.byCategory)
              .slice(0, 3)
              .map(([k, v]) => (
                <div key={k} className="mt-1">
                  {categoryInfo[k as ActivityCategory]?.icon}{" "}
                  {categoryInfo[k as ActivityCategory]?.label}: {v}件完了
                </div>
              ))}
          </div>
        </Card>
        <Card className="border-l-4 relative group" style={{ borderLeftColor: "#7B9E6B" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500 mb-1">総タスク</p>
            <p className="text-2xl font-bold text-slate-800">
              {summary.doneTasks}/{summary.totalTasks}
            </p>
          </CardContent>
          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px]">
            本日 {actStats.todayCount}件完了
            {recentActs.slice(0, 3).map((a) => (
              <div key={a.id} className="mt-1 truncate">
                {categoryInfo[a.category]?.icon} {a.title}
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-l-4 relative group" style={{ borderLeftColor: "#8B7355" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500 mb-1">想定投資額</p>
            <p className="text-2xl font-bold text-slate-800">
              ¥{(summary.totalInvestment / 10000).toFixed(1)}万
            </p>
          </CardContent>
          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px]">
            {recentActs
              .filter((a) => a.category === "asset")
              .slice(0, 2)
              .map((a) => (
                <div key={a.id} className="mt-1 truncate">
                  💰 {a.title}
                </div>
              ))}
            <div className="mt-1">
              5プロジェクト合計 ¥{(summary.totalInvestment / 10000).toFixed(1)}万
            </div>
          </div>
        </Card>
        <Card className="border-l-4 relative group" style={{ borderLeftColor: "#6B8E9E" }}>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500 mb-1">全体進捗</p>
            <p className="text-2xl font-bold text-slate-800">{summary.overallProgress}%</p>
          </CardContent>
          <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px]">
            高インパクト: {actStats.highImpact}件
            {recentActs
              .filter((a) => a.impact === "high")
              .slice(0, 3)
              .map((a) => (
                <div key={a.id} className="mt-1 truncate">
                  🔥 {a.title}
                </div>
              ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">プロジェクト別進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number) => `${val}%`} />
                <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                  {projectData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">タスク担当分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ownerData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#6B8E9E" />
                  <Cell fill="#D4A574" />
                  <Cell fill="#8B7355" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            目標進捗タイムライン（%）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="ebay" stroke="#D4A574" name="eBay" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="investment"
                stroke="#7B9E6B"
                name="投資"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="bim" stroke="#8B7355" name="BIM" strokeWidth={2} />
              <Line
                type="monotone"
                dataKey="robotics"
                stroke="#6B8E9E"
                name="ロボ"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="academy"
                stroke="#9E6B8B"
                name="学習塾"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">投資額内訳</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 16 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `¥${v / 10000}万`} />
              <Tooltip formatter={(val: number) => `¥${val.toLocaleString()}`} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {investmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50 transition-colors">
      <div
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: statusColors[task.status] }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
        <p className="text-xs text-slate-400 truncate">{task.description}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {task.owner === "agent" ? "🤖" : task.owner === "hiroshi" ? "👤" : "🤝"}
        </Badge>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {task.estimatedHours}h
        </Badge>
        <Badge
          className="text-[10px] px-1.5 py-0"
          style={{
            backgroundColor: statusColors[task.status] + "22",
            color: statusColors[task.status],
            border: `1px solid ${statusColors[task.status]}44`,
          }}
        >
          {statusLabels[task.status]}
        </Badge>
      </div>
    </div>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const summary = getProjectSummary(project);

  const kpiRadarData = project.kpis.map((k) => ({
    subject: k.name,
    current: k.target > 0 ? (k.current / k.target) * 100 : 0,
    target: 100,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{project.icon}</div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-800">{project.nameJP}</h2>
          <p className="text-xs text-slate-500">{project.osaUnit}</p>
          <p className="text-sm text-slate-600 mt-1">{project.description}</p>
        </div>
        <Badge variant="outline" className="text-xs capitalize">
          {project.phase}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-xl font-bold text-slate-800">{summary.progress}%</p>
          <p className="text-[10px] text-slate-500">進捗率</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-xl font-bold text-slate-800">
            {summary.doneTasks}/{summary.totalTasks}
          </p>
          <p className="text-[10px] text-slate-500">タスク完了</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-xl font-bold text-slate-800">{summary.totalHours}h</p>
          <p className="text-[10px] text-slate-500">総工数</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-xl font-bold text-slate-800">
            ¥{(project.investmentTotal / 10000).toFixed(1)}万
          </p>
          <p className="text-[10px] text-slate-500">投資額</p>
        </div>
      </div>

      <Progress value={summary.progress} className="h-2" />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">KPI達成状況</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={kpiRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name="現在"
                  dataKey="current"
                  stroke={project.color}
                  fill={project.color}
                  fillOpacity={0.3}
                />
                <Radar
                  name="目標"
                  dataKey="target"
                  stroke="#94a3b8"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {project.kpis.map((k) => (
                <div key={k.name} className="text-[10px] text-slate-500">
                  {k.name}: <span className="font-medium text-slate-700">{k.current}</span>/
                  {k.target}
                  {k.unit}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">PDCAログ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {project.pdcaLog.map((entry, i) => (
                <div
                  key={i}
                  className="border-l-2 pl-3 py-1"
                  style={{ borderColor: project.color }}
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 uppercase font-mono"
                    >
                      {entry.cycle}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleString("ja-JP")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{entry.content}</p>
                  {entry.actionItems.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {entry.actionItems.map((a, j) => (
                        <li key={j} className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {project.milestones.map((m) => (
          <Card key={m.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-700">{m.title}</CardTitle>
                <span className="text-[10px] text-slate-400">期限: {m.targetDate}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-slate-100">
                {m.tasks.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PDCAPanel() {
  const now = new Date().toLocaleString("ja-JP");
  const allLogs = projects
    .flatMap((p) =>
      p.pdcaLog.map((l) => ({ ...l, project: p.nameJP, icon: p.icon, color: p.color })),
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const nextActions = projects.flatMap((p) => {
    const nextTasks = p.milestones
      .flatMap((m) => m.tasks)
      .filter((t) => t.status === "not_started" && (t.owner === "agent" || t.owner === "both"))
      .slice(0, 2);
    return nextTasks.map((t) => ({ ...t, project: p.nameJP, icon: p.icon, color: p.color }));
  });

  return (
    <div className="space-y-5">
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔄</span>
            <h3 className="font-bold text-slate-800">PDCAレビュー</h3>
            <Badge variant="outline" className="text-[10px] ml-auto">
              {now}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            2時間ごとの定期レビュー。各プロジェクトの進捗を確認し、次のアクションを決定します。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            🤖 エージェント次アクション（優先順）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nextActions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-slate-50">
                <span className="font-mono text-xs text-slate-400 w-5">{i + 1}.</span>
                <span>{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{a.title}</p>
                  <p className="text-[10px] text-slate-400">
                    {a.project} · {a.estimatedHours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">📋 全ログ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allLogs.map((l, i) => (
              <div key={i} className="border-l-2 pl-3 py-1" style={{ borderColor: l.color }}>
                <div className="flex items-center gap-2">
                  <span>{l.icon}</span>
                  <span className="text-xs font-medium text-slate-700">{l.project}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase font-mono">
                    {l.cycle}
                  </Badge>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {new Date(l.timestamp).toLocaleString("ja-JP")}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{l.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AssetPanel() {
  const summary = getAssetSummary();
  const categories = getAssetsByCategory();

  const pieData = Object.values(categories)
    .filter((c) => c.total > 0)
    .map((c) => ({ name: c.label, value: c.total, color: c.color }));

  const allocationData = allocations.map((a) => ({
    name: a.label,
    current: a.currentPct,
    target: a.targetPct,
  }));

  const historyData = monthlyHistory.map((m) => ({
    date: m.date,
    actual: Math.round(m.actual / 10000),
    proj15: Math.round(m.proj15 / 10000),
    proj10: Math.round(m.proj10 / 10000),
    proj5: Math.round(m.proj5 / 10000),
  }));

  const equityColor =
    summary.equityRatioPct >= 80 ? "#22c55e" : summary.equityRatioPct >= 60 ? "#f59e0b" : "#ef4444";

  // OSA project investment calculation
  const osaProjects = [
    { name: "eBay無在庫", needed: 50000, priority: 1, monthly: 5000 },
    { name: "投資エージェント", needed: 30000, priority: 2, monthly: 2000 },
    { name: "音声BIM", needed: 100000, priority: 3, monthly: 5000 },
    { name: "ロボットアーム", needed: 300000, priority: 4, monthly: 3000 },
    { name: "AI学習塾", needed: 500000, priority: 5, monthly: 50000 },
  ];
  const totalOsaNeeded = osaProjects.reduce((s, p) => s + p.needed, 0);

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-slate-700">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">総資産（純額）</p>
            <p className="text-lg font-bold text-slate-800">
              ¥{(summary.netAssets / 10000).toFixed(1)}万
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: equityColor }}>
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">自己資本比率</p>
            <p className="text-lg font-bold" style={{ color: equityColor }}>
              {summary.equityRatioPct.toFixed(1)}%
            </p>
            <p className="text-[9px] text-slate-400">目標: 80%以上</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">負債総額</p>
            <p className="text-lg font-bold text-amber-600">
              ¥{(summary.debts / 10000).toFixed(1)}万
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">追加投資可能額</p>
            <p className="text-lg font-bold text-blue-600">
              ¥{(summary.investmentCapacity / 10000).toFixed(1)}万
            </p>
            <p className="text-[9px] text-slate-400">80%維持ライン</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">年間複利利回り</p>
            <p className="text-lg font-bold text-green-600">{summary.annualRate.toFixed(1)}%</p>
            <p className="text-[9px] text-slate-400">18ヶ月実績</p>
          </CardContent>
        </Card>
      </div>

      {/* Equity Ratio Gauge */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-medium text-slate-600">
            自己資本比率コントロール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${Math.min(summary.equityRatioPct, 100)}%`,
                backgroundColor: equityColor,
              }}
            />
            <div className="absolute inset-y-0 left-[80%] w-px bg-red-400 z-10" />
            <span className="absolute left-[80%] -top-4 text-[9px] text-red-500 -translate-x-1/2">
              80%目標
            </span>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-500">
            <span>0%</span>
            <span>現在: {summary.equityRatioPct.toFixed(1)}%</span>
            <span>100%</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded">
              <p className="text-[10px] text-slate-500">グロス資産</p>
              <p className="text-sm font-bold text-slate-700">
                ¥{(summary.grossAssets / 10000).toFixed(1)}万
              </p>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <p className="text-[10px] text-slate-500">負債</p>
              <p className="text-sm font-bold text-red-600">
                ¥{(summary.debts / 10000).toFixed(1)}万
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <p className="text-[10px] text-slate-500">純資産</p>
              <p className="text-sm font-bold text-blue-700">
                ¥{(summary.netAssets / 10000).toFixed(1)}万
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Asset Allocation Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">資産クラス構成</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Current vs Target Allocation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">現在 vs 目標配分</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={allocationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 35]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="current" name="現在" fill="#6B8E9E" barSize={8} />
                <Bar dataKey="target" name="目標" fill="#D4A574" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Asset History Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            資産推移（万円）vs 複利プロジェクション
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}万`} />
              <Tooltip formatter={(v: number) => `${v}万円`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="proj15"
                name="15%複利"
                stroke="#94a3b8"
                fill="#94a3b822"
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="proj10"
                name="10%複利"
                stroke="#cbd5e1"
                fill="#cbd5e122"
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="実績"
                stroke="#D4A574"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* OSA Investment Allocation */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            OSAプロジェクト投資計画（自己資本比率80%維持）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 p-3 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">追加投資可能額（80%維持）</span>
              <span className="text-lg font-bold text-blue-700">
                ¥{(summary.investmentCapacity / 10000).toFixed(1)}万
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600">OSA全プロジェクト必要額</span>
              <span className="text-sm font-semibold text-slate-700">
                ¥{(totalOsaNeeded / 10000).toFixed(1)}万
              </span>
            </div>
            <Progress
              value={Math.min(100, (summary.investmentCapacity / totalOsaNeeded) * 100)}
              className="h-2 mt-2"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {summary.investmentCapacity >= totalOsaNeeded
                ? "✅ 全プロジェクトに投資可能（80%自己資本比率維持）"
                : `⚠️ 全額投資すると自己資本比率が${((summary.netAssets / (summary.grossAssets + totalOsaNeeded)) * 100).toFixed(1)}%に低下`}
            </p>
          </div>
          <div className="space-y-2">
            {osaProjects.map((p, i) => {
              const pctOfCapacity = (p.needed / summary.investmentCapacity) * 100;
              const affordable = summary.investmentCapacity >= p.needed;
              return (
                <div key={i} className="flex items-center gap-3 p-2 bg-white rounded">
                  <span className="font-mono text-[10px] text-blue-400 w-4">{p.priority}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">{p.name}</span>
                      <span className="text-xs text-slate-600">
                        ¥{(p.needed / 10000).toFixed(1)}万
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[9px] text-slate-400">
                        月間: ¥{(p.monthly / 10000).toFixed(1)}万
                      </span>
                      <Badge
                        variant={affordable ? "outline" : "secondary"}
                        className="text-[9px] px-1 py-0"
                      >
                        {affordable ? "✅ 投資可能" : "⚠️ 段階投資"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 bg-amber-50 rounded text-[10px] text-amber-800">
            <strong>推奨戦略:</strong>{" "}
            Phase1でeBay(¥5万)+投資Agent(¥3万)=¥8万を先行投資。収益化後にBIM・ロボティクスへ段階展開。
            学習塾(¥50万)は補助金活用を前提とし、自己資金投入は最小限に。
          </div>
        </CardContent>
      </Card>

      {/* Asset Detail Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">保有資産明細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-1.5 px-2 text-slate-500 font-medium">カテゴリ</th>
                  <th className="text-left py-1.5 px-2 text-slate-500 font-medium">銘柄</th>
                  <th className="text-right py-1.5 px-2 text-slate-500 font-medium">評価額</th>
                  <th className="text-right py-1.5 px-2 text-slate-500 font-medium">前月比</th>
                  <th className="text-right py-1.5 px-2 text-slate-500 font-medium">構成比</th>
                </tr>
              </thead>
              <tbody>
                {assets
                  .filter((a) => a.value !== 0)
                  .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                  .map((a) => (
                    <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-1 px-2 text-slate-400">{a.category}</td>
                      <td className="py-1 px-2 font-medium text-slate-700">{a.name}</td>
                      <td
                        className={`py-1 px-2 text-right ${a.value < 0 ? "text-red-500" : "text-slate-700"}`}
                      >
                        ¥{a.value.toLocaleString()}
                      </td>
                      <td
                        className={`py-1 px-2 text-right ${a.prevMonthDiff > 0 ? "text-green-600" : a.prevMonthDiff < 0 ? "text-red-500" : "text-slate-400"}`}
                      >
                        {a.prevMonthDiff > 0 ? "+" : ""}
                        {a.prevMonthDiff !== 0 ? a.prevMonthDiff.toLocaleString() : "-"}
                      </td>
                      <td className="py-1 px-2 text-right text-slate-500">
                        {((a.value / 13951756) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityLogPanel() {
  const [selectedEntry, setSelectedEntry] = useState<ActivityEntry | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);
  const stats = getActivityStats();
  const byDate = getActivitiesByDate();
  const dates = Object.keys(byDate).sort().reverse();

  const impactColors = { high: "#22c55e", medium: "#f59e0b", low: "#94a3b8" };
  const impactLabels = { high: "🔥 高", medium: "⚡ 中", low: "○ 低" };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-slate-700">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">累計タスク完了</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">本日完了</p>
            <p className="text-2xl font-bold text-green-600">{stats.todayCount}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">高インパクト</p>
            <p className="text-2xl font-bold text-amber-600">{stats.highImpact}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-3 pb-2">
            <p className="text-[10px] text-slate-500">カテゴリ数</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(stats.byCategory).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown - Hoverable */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            カテゴリ別達成数（ホバーで詳細）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const count = stats.byCategory[key] || 0;
              if (count === 0) return null;
              const entries = activityLog.filter((a) => a.category === key);
              return (
                <div
                  key={key}
                  className="relative group p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                  style={{ borderColor: info.color + "44", backgroundColor: info.color + "08" }}
                  onClick={() => setSelectedEntry(entries[0] || null)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-xs font-medium text-slate-700">{info.label}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: info.color }}>
                    {count}
                  </p>
                  <p className="text-[9px] text-slate-400">完了タスク</p>
                  {/* Hover Tooltip */}
                  <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-xs">
                    <p className="font-bold mb-1">
                      {info.icon} {info.label} — 達成内容
                    </p>
                    {entries.map((e) => (
                      <div key={e.id} className="flex items-start gap-1.5 mt-1.5">
                        <span style={{ color: impactColors[e.impact] }}>●</span>
                        <span>{e.title}</span>
                      </div>
                    ))}
                    <p className="mt-2 text-slate-400 text-[9px]">クリックで詳細を表示</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {dates.map((date) => (
        <Card key={date}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              📅{" "}
              {new Date(date + "T00:00:00").toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {byDate[date].length}件
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {byDate[date].map((entry) => {
                const info = categoryInfo[entry.category];
                const isHovered = hoveredEntry === entry.id;
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <div key={entry.id}>
                    <div
                      className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                      style={{
                        borderColor: isSelected
                          ? info.color
                          : isHovered
                            ? info.color + "88"
                            : "#e2e8f0",
                        backgroundColor: isSelected
                          ? info.color + "0a"
                          : isHovered
                            ? info.color + "05"
                            : "white",
                        boxShadow: isSelected ? `0 0 0 1px ${info.color}44` : "none",
                      }}
                      onMouseEnter={() => setHoveredEntry(entry.id)}
                      onMouseLeave={() => setHoveredEntry(null)}
                      onClick={() => setSelectedEntry(isSelected ? null : entry)}
                    >
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 w-10">
                        <span className="text-lg">{info.icon}</span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {entry.date.split("T")[1]?.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-slate-800">{entry.title}</p>
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: impactColors[entry.impact] + "22",
                              color: impactColors[entry.impact],
                            }}
                          >
                            {impactLabels[entry.impact]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{entry.outcome}</p>
                        {/* Hover: show metrics */}
                        {isHovered && entry.metrics && !isSelected && (
                          <div className="flex flex-wrap gap-1 mt-1.5 animate-in fade-in duration-200">
                            {entry.metrics.map((m, i) => (
                              <span
                                key={i}
                                className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-slate-400">{isSelected ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {/* Expanded Detail */}
                    {isSelected && (
                      <div className="mt-1 ml-13 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                        <div>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            詳細
                          </p>
                          <p className="text-xs text-slate-700 leading-relaxed">{entry.detail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                            成果
                          </p>
                          <p className="text-xs text-slate-700">{entry.outcome}</p>
                        </div>
                        {entry.metrics && entry.metrics.length > 0 && (
                          <div>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                              定量指標
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {entry.metrics.map((m, i) => (
                                <div
                                  key={i}
                                  className="px-2 py-1 bg-white rounded border text-xs font-medium text-slate-700"
                                >
                                  📊 {m}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((t, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-full"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OsaDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
          OSA
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">OSA Agent Dashboard</h1>
          <p className="text-xs text-slate-400">Office for Symbiotic Architecture</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 bg-white flex-wrap">
          <TabsTrigger value="overview" className="text-xs">
            📊 概要
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-xs">
            💰 資産管理
          </TabsTrigger>
          {projects.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="text-xs">
              {p.icon} {p.nameJP.slice(0, 5)}
            </TabsTrigger>
          ))}
          <TabsTrigger value="pdca" className="text-xs">
            🔄 PDCA
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">
            📋 活動ログ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewPanel />
        </TabsContent>
        <TabsContent value="assets">
          <AssetPanel />
        </TabsContent>
        {projects.map((p) => (
          <TabsContent key={p.id} value={p.id}>
            <ProjectPanel project={p} />
          </TabsContent>
        ))}
        <TabsContent value="pdca">
          <PDCAPanel />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityLogPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
