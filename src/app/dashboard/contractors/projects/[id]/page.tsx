"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  getProjectById,
  getProjectExpenses,
  getProjectIncomes,
  getProjectMonthlySummary,
} from "@/lib/mockContractors";
import {
  Project,
  ProjectExpense,
  ProjectIncome,
  projectTypeConfig,
  projectStatusConfig,
  projectExpenseCategoryConfig,
  projectRiskTypeConfig,
  projectDocumentTypeConfig,
} from "@/types/contractors";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

const currentMonth = "2025-01";

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);
  const [incomes, setIncomes] = useState<ProjectIncome[]>([]);
  const [summary, setSummary] = useState<ReturnType<typeof getProjectMonthlySummary> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'equipment' | 'documents'>('overview');

  useEffect(() => {
    const proj = getProjectById(id);
    if (proj) {
      setProject(proj);
      setExpenses(getProjectExpenses(id, currentMonth));
      setIncomes(getProjectIncomes(id, currentMonth));
      setSummary(getProjectMonthlySummary(id, currentMonth));
    }
  }, [id]);

  if (!project) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--text-muted)]">Объект не найден</p>
        </div>
      </PageLayout>
    );
  }

  const typeConfig = projectTypeConfig[project.type];
  const statusConfig = projectStatusConfig[project.status];
  const activeRisks = project.risks.filter(r => !r.resolvedAt);

  return (
    <div className="animate-fadeIn">
      {/* Back Link */}
      <Link href="/dashboard/contractors/projects" className="inline-flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к объектам
      return (
        <PageLayout>
          <div className="animate-fadeIn space-y-8">
            {/* Back Link */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-5">
          <div 
            className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
            style={{ background: `${typeConfig.color}15`, border: `1px solid ${typeConfig.color}30` }}
          >

            <PageHeader
              title={project.name}
              subtitle="Карточка проекта и ключевые метрики"
              actions={
                <span
                  className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
                  style={{ background: statusConfig.bgColor, color: statusConfig.color }}
                >
                  {statusConfig.label}
                </span>
              }
            />
                  ⚠️ {activeRisks.length} риск{activeRisks.length > 1 ? 'а' : ''}
                </span>
              )}
            </div>
            <p className="text-[var(--text-muted)]">{typeConfig.label}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">📍 {project.address}</p>
            <Link 
              href={`/dashboard/contractors/list/${project.contractorId}`}
              className="text-sm text-[var(--accent-blue)] hover:underline mt-1 inline-block"
            >
              👤 {project.contractorName}
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Редактировать
          </button>
          <button className="btn btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить расход
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {project.type === 'construction' && project.contractAmount && (
          <>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Контракт</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {(project.contractAmount / 1000000).toFixed(1)}M ₽
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Получено</p>
              <p className="text-2xl font-semibold text-[var(--accent-green)]">
                {((project.receivedAmount || 0) / 1000000).toFixed(1)}M ₽
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Осталось</p>
              <p className="text-2xl font-semibold text-[var(--accent-blue)]">
                {((project.remainingAmount || 0) / 1000000).toFixed(1)}M ₽
              </p>
            </div>
          </>
        )}
        {project.type === 'equipment_services' && (
          <>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Доход</p>
              <p className="text-2xl font-semibold text-[var(--accent-green)]">
                +{(project.totalIncome / 1000000).toFixed(2)}M ₽
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Часов</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {project.equipment.reduce((sum, e) => sum + e.hoursWorked, 0)}
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Ср. ставка</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">
                {project.equipment.length > 0 ? Math.round(project.equipment.reduce((sum, e) => sum + e.hourlyRate, 0) / project.equipment.length).toLocaleString('ru-RU') : 0} ₽/ч
              </p>
            </div>
          </>
        )}
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Расходы</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            -{(project.totalExpenses / 1000000).toFixed(2)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Прибыль</p>
          <p className={`text-2xl font-semibold ${project.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
            {project.profit >= 0 ? '+' : ''}{(project.profit / 1000000).toFixed(2)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Маржа</p>
          <p className={`text-2xl font-semibold ${project.profitMargin > 20 ? 'text-[var(--accent-green)]' : project.profitMargin > 0 ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-red)]'}`}>
            {project.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'overview', label: 'Обзор' },
          { key: 'finance', label: 'Финансы' },
          { key: 'equipment', label: `Техника (${project.equipment.length})` },
          { key: 'documents', label: `Документы (${project.documents.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              border: activeTab === tab.key ? '1px solid var(--border-secondary)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Contract Progress */}
              {project.type === 'construction' && project.contractAmount && (
                <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Прогресс по контракту</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--text-muted)]">
                        Получено {((project.receivedAmount || 0) / project.contractAmount * 100).toFixed(0)}%
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {((project.receivedAmount || 0) / 1000000).toFixed(2)}M из {(project.contractAmount / 1000000).toFixed(2)}M ₽
                      </span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(project.receivedAmount || 0) / project.contractAmount * 100}%`,
                          background: 'var(--accent-green)'
                        }}
                      />
                    </div>
                  </div>
                  {project.estimatedExpenses && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Зарплата (план)</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{(project.estimatedExpenses.salary / 1000000).toFixed(1)}M ₽</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Техника (план)</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{(project.estimatedExpenses.equipment / 1000000).toFixed(1)}M ₽</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Материалы (план)</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{(project.estimatedExpenses.materials / 1000000).toFixed(1)}M ₽</p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Прочее (план)</p>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{(project.estimatedExpenses.other / 1000000).toFixed(1)}M ₽</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Expense Breakdown */}
              {summary && (
                <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Структура расходов (январь 2025)</h3>
                  <div className="space-y-3">
                    {Object.entries(summary.expenses)
                      .filter(([key, value]) => key !== 'total' && value > 0)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .map(([category, amount]) => {
                        const config = projectExpenseCategoryConfig[category as keyof typeof projectExpenseCategoryConfig];
                        const percent = summary.expenses.total > 0 ? Math.round((amount as number) / summary.expenses.total * 100) : 0;
                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{config?.icon || '📦'}</span>
                                <span className="text-sm font-medium text-[var(--text-primary)]">{config?.label || category}</span>
                              </div>
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                {((amount as number) / 1000).toFixed(0)}к ₽ ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${percent}%`,
                                  background: config?.color || 'var(--accent-blue)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Risks */}
              {activeRisks.length > 0 && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">⚠️</span>
                    <h3 className="text-lg font-semibold text-[var(--accent-red)]">Активные риски</h3>
                  </div>
                  <div className="space-y-3">
                    {activeRisks.map((risk) => {
                      const riskConfig = projectRiskTypeConfig[risk.type];
                      return (
                        <div 
                          key={risk.id} 
                          className="p-4 rounded-lg"
                          style={{ 
                            background: risk.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            border: `1px solid ${risk.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{riskConfig?.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">{riskConfig?.label}</p>
                                <p className="text-sm text-[var(--text-muted)]">{risk.description}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              risk.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                              risk.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                              'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {risk.severity === 'critical' ? 'Критический' : risk.severity === 'high' ? 'Высокий' : 'Средний'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'finance' && (
            <>
              {/* Incomes */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Доходы</h3>
                <div className="space-y-3">
                  {incomes.length > 0 ? incomes.map((income) => (
                    <div key={income.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{income.description}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(income.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[var(--accent-green)]">
                        +{(income.amount / 1000).toFixed(0)}к ₽
                      </span>
                    </div>
                  )) : (
                    <p className="text-sm text-[var(--text-muted)]">Нет доходов за этот период</p>
                  )}
                </div>
              </div>

              {/* Expenses */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Расходы</h3>
                <div className="space-y-3">
                  {expenses.length > 0 ? expenses.map((expense) => {
                    const config = projectExpenseCategoryConfig[expense.category];
                    return (
                      <div key={expense.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{config?.icon || '📦'}</span>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{expense.description}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {new Date(expense.date).toLocaleDateString('ru-RU')} • {config?.label}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          -{(expense.amount / 1000).toFixed(0)}к ₽
                        </span>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-[var(--text-muted)]">Нет расходов за этот период</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'equipment' && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Техника на объекте</h3>
              {project.equipment.length > 0 ? (
                <div className="space-y-4">
                  {project.equipment.map((eq) => (
                    <Link
                      key={eq.equipmentId}
                      href={`/dashboard/assets/equipment/${eq.equipmentId}`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
                      style={{ border: '1px solid var(--border-secondary)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'var(--bg-tertiary)' }}>
                          🚜
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{eq.equipmentName}</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            С {new Date(eq.assignedDate).toLocaleDateString('ru-RU')}
                            {eq.unassignedDate && ` по ${new Date(eq.unassignedDate).toLocaleDateString('ru-RU')}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[var(--accent-green)]">+{(eq.income / 1000).toFixed(0)}к ₽</p>
                        <p className="text-sm text-[var(--text-muted)]">{eq.hoursWorked} ч × {eq.hourlyRate.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">Нет закреплённой техники</p>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Документы</h3>
                <button className="btn btn-secondary text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Загрузить
                </button>
              </div>
              {project.documents.length > 0 ? (
                <div className="space-y-3">
                  {project.documents.map((doc) => {
                    const docConfig = projectDocumentTypeConfig[doc.type];
                    return (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer"
                        style={{ border: '1px solid var(--border-secondary)' }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{docConfig?.icon || '📄'}</span>
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{doc.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {docConfig?.label} • {new Date(doc.date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {doc.amount && (
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {(doc.amount / 1000000).toFixed(2)}M ₽
                            </span>
                          )}
                          {doc.status && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.status === 'paid' ? 'bg-green-500/10 text-green-500' :
                              doc.status === 'signed' ? 'bg-blue-500/10 text-blue-500' :
                              doc.status === 'overdue' ? 'bg-red-500/10 text-red-500' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>
                              {doc.status === 'paid' ? 'Оплачен' : doc.status === 'signed' ? 'Подписан' : doc.status === 'overdue' ? 'Просрочен' : 'Черновик'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">Нет документов</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Информация</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Дата начала</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {new Date(project.startDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {project.plannedEndDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">План окончания</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {new Date(project.plannedEndDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              {project.actualEndDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Факт окончания</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {new Date(project.actualEndDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Employees */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Сотрудники ({project.employees.length})</h4>
            {project.employees.length > 0 ? (
              <div className="space-y-3">
                {project.employees.map((emp) => (
                  <div key={emp.employeeId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                        {emp.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{emp.employeeName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{emp.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">Не назначены</p>
            )}
            <button className="w-full mt-4 py-2 text-sm text-[var(--accent-blue)] hover:underline">
              + Назначить сотрудника
            </button>
          </div>

          {/* Contractor */}
          <Link 
            href={`/dashboard/contractors/list/${project.contractorId}`}
            className="block rounded-xl p-5 hover:bg-[var(--bg-tertiary)] transition-all"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
          >
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Контрагент</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                👤
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{project.contractorName}</p>
                <p className="text-xs text-[var(--accent-blue)]">Перейти к карточке →</p>
              </div>
            </div>
          </Link>

          {/* Description */}
          {project.description && (
            <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Описание</h4>
              <p className="text-sm text-[var(--text-primary)]">{project.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
