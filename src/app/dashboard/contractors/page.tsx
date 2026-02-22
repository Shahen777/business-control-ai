"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProjectsTotals,
  getContractorsTotals,
  getActiveProjects,
  getProfitableProjects,
  getProjectsWithRisks,
  getOverdueContractors,
} from "@/lib/mockContractors";
import {
  projectTypeConfig,
  projectStatusConfig,
  contractorReputationConfig,
} from "@/types/contractors";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function ContractorsPage() {
  const [projectsTotals, setProjectsTotals] = useState<ReturnType<typeof getProjectsTotals> | null>(null);
  const [contractorsTotals, setContractorsTotals] = useState<ReturnType<typeof getContractorsTotals> | null>(null);
  const [activeProjects, setActiveProjects] = useState<ReturnType<typeof getActiveProjects>>([]);
  const [profitableProjects, setProfitableProjects] = useState<ReturnType<typeof getProfitableProjects>>([]);
  const [riskyProjects, setRiskyProjects] = useState<ReturnType<typeof getProjectsWithRisks>>([]);
  const [overdueContractors, setOverdueContractors] = useState<ReturnType<typeof getOverdueContractors>>([]);

  useEffect(() => {
    setProjectsTotals(getProjectsTotals());
    setContractorsTotals(getContractorsTotals());
    setActiveProjects(getActiveProjects());
    setProfitableProjects(getProfitableProjects(3));
    setRiskyProjects(getProjectsWithRisks());
    setOverdueContractors(getOverdueContractors());
  }, []);

  if (!projectsTotals || !contractorsTotals) return null;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-10">
        <PageHeader
          title="Контрагенты и объекты"
          subtitle="Центр управления проектами, заказчиками и подрядчиками"
          actions={
            <div className="flex gap-2">
              <Button variant="secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Новый контрагент
              </Button>
              <Button variant="primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Новый объект
              </Button>
            </div>
          }
        />

      {/* Main KPI */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Объектов</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{projectsTotals.total}</p>
          <p className="text-xs text-[var(--accent-green)] mt-1">{projectsTotals.active} активных</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Контрагентов</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{contractorsTotals.total}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{contractorsTotals.customers} заказчиков</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общий доход</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">
            +{(projectsTotals.totalIncome / 1000000).toFixed(1)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Прибыль</p>
          <p className={`text-2xl font-semibold ${projectsTotals.totalProfit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
            {projectsTotals.totalProfit >= 0 ? '+' : ''}{(projectsTotals.totalProfit / 1000000).toFixed(1)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Дебиторка</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {(contractorsTotals.totalReceivables / 1000000).toFixed(1)}M ₽
          </p>
          {contractorsTotals.overdueReceivables > 0 && (
            <p className="text-xs text-[var(--accent-red)] mt-1">
              {(contractorsTotals.overdueReceivables / 1000).toFixed(0)}к просрочено
            </p>
          )}
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Ср. маржа</p>
          <p className={`text-2xl font-semibold ${projectsTotals.avgProfitMargin > 20 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}`}>
            {projectsTotals.avgProfitMargin.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/contractors/projects"
          className="p-6 rounded-xl hover:scale-[1.02] transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))', border: '1px solid rgba(59, 130, 246, 0.3)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
              🏗️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Объекты</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {projectsTotals.construction} строек • {projectsTotals.services} услуг техники
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[var(--accent-blue)]">{projectsTotals.active}</p>
              <p className="text-xs text-[var(--text-muted)]">активных</p>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/dashboard/contractors/list"
          className="p-6 rounded-xl hover:scale-[1.02] transition-all"
          style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              👥
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Контрагенты</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {contractorsTotals.customers} заказчиков • {contractorsTotals.suppliers} поставщиков • {contractorsTotals.subcontractors} подрядчиков
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[var(--accent-green)]">{contractorsTotals.total}</p>
              <p className="text-xs text-[var(--text-muted)]">всего</p>
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Active Projects */}
        <div className="col-span-2 rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Активные объекты</h3>
            <Link href="/dashboard/contractors/projects" className="text-sm text-[var(--accent-blue)] hover:underline">
              Все объекты →
            </Link>
          </div>
          <div className="space-y-3">
            {activeProjects.slice(0, 4).map((project) => {
              const typeConfig = projectTypeConfig[project.type];
              const statusConfig = projectStatusConfig[project.status];
              return (
                <Link
                  key={project.id}
                  href={`/dashboard/contractors/projects/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
                  style={{ border: '1px solid var(--border-secondary)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'var(--bg-tertiary)' }}>
                      {typeConfig.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-[var(--text-primary)]">{project.name}</p>
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ background: statusConfig.bgColor, color: statusConfig.color }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)]">{project.contractorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${project.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {project.profit >= 0 ? '+' : ''}{(project.profit / 1000).toFixed(0)}к ₽
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">маржа {project.profitMargin.toFixed(0)}%</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Risks & Alerts */}
        <div className="space-y-6">
          {/* Risks */}
          {riskyProjects.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚠️</span>
                <h4 className="font-semibold text-[var(--accent-red)]">Риски ({riskyProjects.length})</h4>
              </div>
              <div className="space-y-2">
                {riskyProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/contractors/projects/${project.id}`}
                    className="block p-3 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-all"
                  >
                    <p className="text-sm font-medium text-[var(--text-primary)]">{project.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {project.risks.filter(r => !r.resolvedAt)[0]?.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Overdue */}
          {overdueContractors.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💳</span>
                <h4 className="font-semibold text-[var(--accent-amber)]">Просрочка оплаты</h4>
              </div>
              <div className="space-y-2">
                {overdueContractors.map((contractor) => (
                  <Link
                    key={contractor.id}
                    href={`/dashboard/contractors/list/${contractor.id}`}
                    className="block p-3 rounded-lg hover:bg-[rgba(245,158,11,0.1)] transition-all"
                  >
                    <p className="text-sm font-medium text-[var(--text-primary)]">{contractor.name}</p>
                    <p className="text-xs text-[var(--accent-red)]">
                      {(contractor.overdueReceivables / 1000).toFixed(0)}к ₽ • {contractor.averagePaymentDelay} дней
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Top Profitable */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📈</span>
              <h4 className="font-semibold text-[var(--text-primary)]">Топ прибыльных</h4>
            </div>
            <div className="space-y-2">
              {profitableProjects.map((project, idx) => (
                <Link
                  key={project.id}
                  href={`/dashboard/contractors/projects/${project.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-muted)]">#{idx + 1}</span>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{project.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent-green)]">
                    +{(project.profit / 1000).toFixed(0)}к
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
            🤖
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">ИИ-аналитика</h3>
            <p className="text-sm text-[var(--text-muted)]">Рекомендации на основе данных объектов и контрагентов</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">💡</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Возможность</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Объект «Склад Логистик» показывает высокую маржу 31%. Рекомендуется предложить расширение услуг заказчику.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400">⚠️</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Внимание</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              ООО «ГлавСтрой» задерживает оплату 25 дней. Рекомендуется связаться для урегулирования или приостановить работы.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">📊</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Прогноз</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              При текущей динамике ЖК «Солнечный» завершится с прибылью ~2.8M ₽ при сохранении темпов работ.
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
