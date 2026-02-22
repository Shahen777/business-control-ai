"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllProjects,
  getProjectsByType,
  getProjectsTotals,
} from "@/lib/mockContractors";
import {
  Project,
  ProjectType,
  projectTypeConfig,
  projectStatusConfig,
} from "@/types/contractors";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | ProjectType>('all');
  const [totals, setTotals] = useState<ReturnType<typeof getProjectsTotals> | null>(null);

  useEffect(() => {
    if (filter === 'all') {
      setProjects(getAllProjects());
    } else {
      setProjects(getProjectsByType(filter));
    }
    setTotals(getProjectsTotals());
  }, [filter]);

  const allProjects = getAllProjects();
  const constructionCount = allProjects.filter(p => p.type === 'construction').length;
  const servicesCount = allProjects.filter(p => p.type === 'equipment_services').length;

  const activeRisks = projects.reduce((acc, project) => {
    return acc + project.risks.filter(risk => !risk.resolvedAt && (risk.severity === 'high' || risk.severity === 'critical')).length;
  }, 0);

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-12">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">портфель / объекты</p>
        <PageHeader
          title="Проекты и площадки"
          subtitle="Премиальный контроль портфеля: доход, прибыль, риски и загрузка техники"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard/contractors">
                <Button variant="ghost">Назад к контрагентам</Button>
              </Link>
              <Button variant="primary">Новый проект</Button>
            </div>
          }
        />

      {totals && (
        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 p-5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,224,255,0.12),transparent_40%)]" aria-hidden />
            <div className="flex items-center justify-between text-xs uppercase text-zinc-500">
              <span>Портфель</span>
              <span className="rounded-full bg-zinc-800/80 px-2 py-1 text-[10px] tracking-wide text-zinc-300">Капитал</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-4xl font-semibold text-white">{totals.total}</p>
              <span className="text-sm text-zinc-400">объекта</span>
            </div>
            <p className="mt-1 text-sm text-emerald-300/90">{totals.active} активных • {(totals.totalReceivables / 1000000).toFixed(1)}M ₽ к получению</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(90,224,255,0.12),transparent_35%)]" aria-hidden />
            <div className="flex items-center justify-between text-xs uppercase text-zinc-500">
              <span>Доход</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] tracking-wide text-emerald-300">Кэш-ин</span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-emerald-300">+{(totals.totalIncome / 1000000).toFixed(1)}M ₽</p>
            <p className="text-sm text-zinc-400">Прогноз: {(totals.totalIncome / 1000000 + 2.5).toFixed(1)}M ₽</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,136,102,0.08),transparent_45%)]" aria-hidden />
            <div className="flex items-center justify-between text-xs uppercase text-zinc-500">
              <span>Прибыль</span>
              <span className="rounded-full bg-zinc-800/80 px-2 py-1 text-[10px] tracking-wide text-zinc-300">Маржа</span>
            </div>
            <p className={`mt-3 text-3xl font-semibold ${totals.totalProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {totals.totalProfit >= 0 ? '+' : ''}{(totals.totalProfit / 1000000).toFixed(1)}M ₽
            </p>
            <p className="text-sm text-zinc-400">Средняя маржа: {Math.max(12, Math.min(48, totals.totalProfit / totals.totalIncome * 100)).toFixed(1)}%</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-5 shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,225,120,0.12),transparent_40%)]" aria-hidden />
            <div className="flex items-center justify-between text-xs uppercase text-zinc-500">
              <span>Риски</span>
              <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] tracking-wide text-amber-300">Контроль</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-3xl font-semibold text-amber-200">{activeRisks}</p>
              <span className="text-sm text-zinc-400">критичных</span>
            </div>
            <p className="text-sm text-zinc-400">Всего рисков: {projects.reduce((acc, p) => acc + p.risks.length, 0)}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3 shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: `Все (${allProjects.length})` },
            { key: 'construction', label: `Стройки (${constructionCount})`, color: projectTypeConfig.construction.color },
            { key: 'equipment_services', label: `Услуги техники (${servicesCount})`, color: projectTypeConfig.equipment_services.color },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === tab.key ? 'bg-white/10 text-white shadow-[0_10px_30px_-18px_rgba(124,206,255,0.9)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              style={filter === tab.key ? { border: '1px solid rgba(124,206,255,0.4)', color: tab.color || undefined } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1">Баланс: {(((totals?.totalReceivables ?? 0) / 1000000)).toFixed(1)}M ₽</span>
          <span className="flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/80 px-3 py-1">В работе: {projects.length}</span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => {
          const typeConfig = projectTypeConfig[project.type];
          const statusConfig = projectStatusConfig[project.status];
          const unresolvedRisks = project.risks.filter(risk => !risk.resolvedAt);
          const riskBadge = unresolvedRisks.find(risk => risk.severity === 'critical') ? 'critical' : unresolvedRisks.find(risk => risk.severity === 'high') ? 'high' : unresolvedRisks.find(risk => risk.severity === 'medium') ? 'medium' : null;

          // Лёгкая оценка прогресса для всех типов проектов
          const progress = project.contractAmount && project.receivedAmount
            ? Math.min(100, Math.round((project.receivedAmount / project.contractAmount) * 100))
            : Math.min(98, Math.max(18, Math.round(project.profitMargin + 40)));

          return (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.8)] transition duration-300 hover:-tranzinc-y-1 hover:border-zinc-600/80 hover:shadow-[0_25px_90px_-55px_rgba(90,224,255,0.25)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,206,255,0.08),transparent_45%)] opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden />

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-xl" style={{ color: typeConfig.color }}>
                  {typeConfig.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: statusConfig.bgColor, color: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                    {riskBadge && (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${riskBadge === 'critical' ? 'bg-rose-500/15 text-rose-200' : riskBadge === 'high' ? 'bg-amber-500/15 text-amber-200' : 'bg-zinc-500/20 text-zinc-200'}`}>
                        Риск: {riskBadge === 'critical' ? 'критический' : riskBadge === 'high' ? 'высокий' : 'средний'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{typeConfig.label} • {project.contractorName}</p>
                  <p className="text-xs text-zinc-500">{project.address}</p>
                </div>
                <Link
                  href={`/dashboard/contractors/projects/${project.id}`}
                  className="rounded-full border border-zinc-800/80 bg-white/5 px-3 py-1 text-xs text-zinc-200 transition hover:border-zinc-600 hover:text-white"
                >
                  Открыть
                </Link>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-zinc-300">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-200">Старт: {new Date(project.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                  {project.plannedEndDate && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-200">Финиш: {new Date(project.plannedEndDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                  {project.equipment.length > 0 && <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-200">Техника: {project.equipment.length} ед.</span>}
                  {project.employees.length > 0 && <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-200">Люди: {project.employees.length} чел.</span>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Прогресс</span>
                    <span className="text-zinc-200">{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5dd8ff] via-[#7af5ff] to-[#79c2ff] transition-[width] duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border border-zinc-800/80 bg-white/3 px-3 py-3">
                    <p className="text-xs uppercase text-zinc-500">Доход</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">+{(project.totalIncome / 1000000).toFixed(2)}M ₽</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800/80 bg-white/3 px-3 py-3">
                    <p className="text-xs uppercase text-zinc-500">Прибыль</p>
                    <p className={`mt-1 text-lg font-semibold ${project.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {project.profit >= 0 ? '+' : ''}{(project.profit / 1000000).toFixed(2)}M ₽
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-800/80 bg-white/3 px-3 py-3">
                    <p className="text-xs uppercase text-zinc-500">Маржа</p>
                    <p className={`mt-1 text-lg font-semibold ${project.profitMargin > 20 ? 'text-emerald-300' : project.profitMargin > 0 ? 'text-amber-300' : 'text-rose-300'}`}>{project.profitMargin.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    {unresolvedRisks.slice(0, 2).map((risk) => (
                      <span key={risk.title} className="rounded-full bg-white/5 px-3 py-1">{risk.title}</span>
                    ))}
                    {unresolvedRisks.length === 0 && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">Риски закрыты</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-200">
                    <Link
                      href={`/dashboard/contractors/projects/${project.id}`}
                      className="rounded-lg border border-zinc-800/80 bg-white/5 px-3 py-1.5 transition hover:border-zinc-600 hover:text-white"
                    >
                      Детали
                    </Link>
                    <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-3 py-1.5 transition hover:border-zinc-600 hover:text-white">
                      Выставить счет
                    </button>
                    <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-3 py-1.5 transition hover:border-zinc-600 hover:text-white">
                      Добавить риск
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </PageLayout>
  );
}
