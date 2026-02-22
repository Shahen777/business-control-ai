"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllTasks, getTaskStats, isDueToday, isOverdue, changeTaskStatus } from "@/lib/mockTasks";
import { Task } from "@/types/tasks";

/* ────────────────────────────────────────────────────────────
   CEO Панель — Второй мозг бизнеса
   ──────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTasks(getAllTasks());
    setLoaded(true);
  }, []);

  const stats = getTaskStats();
  const urgent = tasks.filter((t) => isOverdue(t) || isDueToday(t)).slice(0, 4);

  const done = (id: string) => {
    changeTaskStatus(id, "done");
    setTasks(getAllTasks());
  };

  /* ── Метрики ── */
  const metrics = [
    { label: "Баланс", value: "2.45 млн ₽", change: +12.5, color: "text-emerald-400" },
    { label: "Прибыль", value: "+430 тыс ₽", change: +8.3, color: "text-emerald-400" },
    { label: "Проекты", value: "8 активных", change: +2, color: "text-indigo-400" },
    { label: "Дебиторка", value: "890 тыс ₽", change: -5.2, color: "text-amber-400" },
  ];

  /* ── Проблемы ── */
  const problems = [
    { id: "1", title: "Кассовый разрыв", desc: "Через 12 дней не хватит средств для зарплат", sev: "critical" as const, action: "Ускорить платёж", href: "/dashboard/finance" },
    { id: "2", title: "Техника простаивает", desc: "Экскаватор CAT 320 — 5 дней без работы", sev: "high" as const, action: "Перебросить", href: "/dashboard/operations/equipment" },
    { id: "3", title: "Просрочка договора", desc: "Штраф 1% в день, сумма 150 тыс ₽", sev: "medium" as const, action: "Связаться", href: "/dashboard/legal/contracts" },
  ];

  /* ── Проекты ── */
  const projects = [
    { id: "1", name: "ЖК Солнечный", pct: 75, budget: 4.5, spent: 3.2, deadline: "15 фев", stage: "Отделка" },
    { id: "2", name: "Склад Логистик", pct: 45, budget: 2.8, spent: 1.9, deadline: "28 фев", stage: "Монтаж" },
    { id: "3", name: "Офис Технопарк", pct: 90, budget: 1.5, spent: 1.35, deadline: "5 фев", stage: "Сдача" },
  ];

  /* ── Рекомендации AI ── */
  const recs = [
    { icon: "💰", title: "Взыскать дебиторку", desc: "450 000 ₽ просрочено на 12 дней" },
    { icon: "🚜", title: "Перебросить технику", desc: "CAT 320 простаивает, потери 85 тыс ₽" },
    { icon: "📈", title: "Снизить расходы", desc: "ГСМ перерасход на 18% — проверить нормы" },
  ];

  const sevStyle = {
    critical: { border: "border-l-red-500", badge: "bg-red-500/15 text-red-400", label: "Критично" },
    high: { border: "border-l-orange-500", badge: "bg-orange-500/15 text-orange-400", label: "Важно" },
    medium: { border: "border-l-amber-500", badge: "bg-amber-500/15 text-amber-400", label: "Средне" },
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Обзор</h1>
        <p className="text-sm text-zinc-500">Ключевые показатели бизнеса</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl bg-zinc-900/60 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">{m.label}</p>
            <p className="text-2xl font-bold text-white mb-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>
              {m.value}
            </p>
            <span className={`text-xs font-semibold ${m.color}`}>
              {m.change > 0 ? "▲" : "▼"} {Math.abs(m.change)}%
            </span>
          </div>
        ))}
      </div>

      {/* 3 колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Проблемы */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">⚠</span> Требует внимания
          </h2>
          <div className="space-y-3">
            {problems.map((p) => {
              const s = sevStyle[p.sev];
              return (
                <div key={p.id} className={`rounded-xl p-4 bg-zinc-900/50 border border-white/[0.06] border-l-[3px] ${s.border} hover:border-white/[0.1] transition-all`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{p.desc}</p>
                  <Link
                    href={p.href}
                    className="inline-block px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-medium hover:bg-indigo-500/25 transition-colors border border-indigo-500/20"
                  >
                    {p.action}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Задачи */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Мои задачи
          </h2>

          {!loaded ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-zinc-800/40 animate-pulse" />
              ))}
            </div>
          ) : urgent.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-500">Все задачи выполнены</p>
            </div>
          ) : (
            <div className="space-y-2">
              {urgent.map((t) => {
                const over = isOverdue(t);
                return (
                  <div key={t.id} className="group rounded-xl p-3.5 bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        onClick={() => done(t.id)}
                        className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 cursor-pointer accent-indigo-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1 leading-snug">{t.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${over ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {over ? "Просрочено" : "Сегодня"}
                          </span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-500">{t.assigneeName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Прогресс */}
              <div className="mt-3 p-3 rounded-lg bg-zinc-900/30 border border-white/[0.04]">
                <div className="flex justify-between mb-2 text-xs">
                  <span className="text-zinc-500">Выполнено</span>
                  <span className="text-white font-semibold">{stats.done}/{stats.total}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.done / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Проекты */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏗</span> Проекты
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl p-4 bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">{p.name}</h3>
                    <p className="text-xs text-zinc-500">До {p.deadline}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.stage === "Сдача" ? "bg-emerald-500/15 text-emerald-400" :
                    p.stage === "Монтаж" ? "bg-blue-500/15 text-blue-400" :
                    "bg-purple-500/15 text-purple-400"
                  }`}>
                    {p.stage}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span className="text-zinc-500">Прогресс</span>
                    <span className="text-white font-semibold">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        p.pct >= 70 ? "bg-emerald-500" : p.pct >= 40 ? "bg-indigo-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Бюджет</span>
                  <span className="text-zinc-300">{p.spent} / {p.budget} млн ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Рекомендации */}
      <div className="rounded-xl p-6 bg-gradient-to-br from-indigo-500/10 via-zinc-900/50 to-zinc-900/50 border border-indigo-500/10">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <span>🤖</span> Рекомендации AI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recs.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.1] transition-all">
              <div className="text-2xl mb-2.5">{r.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{r.title}</h3>
              <p className="text-xs text-zinc-400 mb-3">{r.desc}</p>
              <button className="px-3 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-medium hover:bg-indigo-500/25 border border-indigo-500/20 transition-colors">
                Действие
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

