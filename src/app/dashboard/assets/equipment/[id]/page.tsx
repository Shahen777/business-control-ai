"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  getEquipmentById,
  getEquipmentExpenses,
  getEquipmentIncomes,
  getEquipmentMonthlySummary,
} from "@/lib/mockAssets";
import {
  Equipment,
  EquipmentExpense,
  EquipmentIncome,
  equipmentOwnershipConfig,
  equipmentStatusConfig,
  equipmentCategoryConfig,
  expenseTypeConfig,
} from "@/types/assets";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const currentMonth = "2025-01";

// Группировка расходов по типу
function groupExpensesByType(expenses: EquipmentExpense[]) {
  const grouped: Record<string, number> = {};
  expenses.forEach(exp => {
    grouped[exp.type] = (grouped[exp.type] || 0) + exp.amount;
  });
  return grouped;
}

export default function EquipmentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [expenses, setExpenses] = useState<EquipmentExpense[]>([]);
  const [incomes, setIncomes] = useState<EquipmentIncome[]>([]);
  const [summary, setSummary] = useState<ReturnType<typeof getEquipmentMonthlySummary> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'income' | 'leasing'>('overview');

  useEffect(() => {
    const eq = getEquipmentById(id);
    if (eq) {
      setEquipment(eq);
      setExpenses(getEquipmentExpenses(id, currentMonth));
      setIncomes(getEquipmentIncomes(id, currentMonth));
      setSummary(getEquipmentMonthlySummary(id, currentMonth));
    }
  }, [id]);

  if (!equipment) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--text-muted)]">Техника не найдена</p>
        </div>
      </PageLayout>
    );
  }

  const status = equipmentStatusConfig[equipment.status];
  const ownership = equipmentOwnershipConfig[equipment.ownership];
  const category = equipmentCategoryConfig[equipment.category];
  const groupedExpenses = groupExpensesByType(expenses);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <Link href="/dashboard/assets/equipment" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку техники
        </Link>

        <PageHeader
          title={equipment.name}
          subtitle={`${equipment.brand} ${equipment.model} ${equipment.year ? `• ${equipment.year} г.` : ""}`.trim()}
          actions={
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
                style={{ background: status.bgColor, color: status.color }}
              >
                {status.label}
              </span>
              <span
                className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
                style={{ background: ownership.bgColor, color: ownership.color }}
              >
                {ownership.label}
              </span>
            </div>
          }
        />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            {category.icon}
          </div>
          <div>
            <p className="text-[var(--text-muted)]">
              {equipment.brand} {equipment.model} {equipment.year && `• ${equipment.year} г.`}
              {equipment.plateNumber && ` • ${equipment.plateNumber}`}
              {equipment.serialNumber && ` • S/N: ${equipment.serialNumber}`}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Приобретено: {new Date(equipment.purchaseDate || equipment.createdAt).toLocaleDateString('ru-RU')}
              {equipment.purchasePrice && ` • ${equipment.purchasePrice.toLocaleString('ru-RU')} ₽`}
            </p>
          </div>
        </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Редактировать
            </Button>
            <Button variant="secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить расход
            </Button>
          </div>
        </div>

      {/* Quick Stats */}
      {summary && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Доход</p>
            <p className="text-2xl font-semibold text-[var(--accent-green)]">
              +{(summary.totalIncome / 1000).toFixed(0)}к ₽
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{summary.workingHours} часов</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Расходы</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              -{(summary.totalExpenses / 1000).toFixed(0)}к ₽
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{expenses.length} операций</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Прибыль</p>
            <p className={`text-2xl font-semibold ${summary.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
              {summary.profit >= 0 ? '+' : ''}{(summary.profit / 1000).toFixed(0)}к ₽
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">за январь 2025</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Загрузка</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{summary.utilization}%</p>
            <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: 'var(--bg-tertiary)' }}>
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${summary.utilization}%`,
                  background: summary.utilization > 70 ? 'var(--accent-green)' : summary.utilization > 40 ? 'var(--accent-amber)' : 'var(--accent-red)'
                }}
              />
            </div>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Ставка</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {equipment.hourlyRate?.toLocaleString('ru-RU') || '—'} ₽
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">за час работы</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'overview', label: 'Обзор' },
          { key: 'expenses', label: `Расходы (${expenses.length})` },
          { key: 'income', label: `Доходы (${incomes.length})` },
          ...(equipment.ownership === 'leasing' ? [{ key: 'leasing', label: 'График лизинга' }] : []),
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
              {/* Expense Breakdown */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Структура расходов</h3>
                <div className="space-y-3">
                  {Object.entries(groupedExpenses)
                    .sort(([,a], [,b]) => b - a)
                    .map(([type, amount]) => {
                      const config = expenseTypeConfig[type as keyof typeof expenseTypeConfig];
                      const percent = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{config?.icon || '📦'}</span>
                              <span className="text-sm font-medium text-[var(--text-primary)]">{config?.label || type}</span>
                            </div>
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {(amount / 1000).toFixed(0)}к ₽ ({percent}%)
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

              {/* Recent Transactions */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Последние операции</h3>
                <div className="space-y-3">
                  {[...expenses, ...incomes]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((item) => {
                      const isExpense = 'type' in item && expenses.includes(item as EquipmentExpense);
                      return (
                        <div key={item.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {isExpense 
                                ? expenseTypeConfig[(item as EquipmentExpense).type]?.label || (item as EquipmentExpense).type
                                : (item as EquipmentIncome).projectName || 'Доход'
                              }
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {new Date(item.date).toLocaleDateString('ru-RU')} • {item.description}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${isExpense ? 'text-[var(--text-primary)]' : 'text-[var(--accent-green)]'}`}>
                            {isExpense ? '-' : '+'}{(item.amount / 1000).toFixed(0)}к ₽
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'expenses' && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Все расходы</h3>
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const config = expenseTypeConfig[expense.type];
                  return (
                    <div key={expense.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config?.icon || '📦'}</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{config?.label || expense.type}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {new Date(expense.date).toLocaleDateString('ru-RU')} • {expense.description}
                          </p>
                          {expense.vendor && (
                            <p className="text-xs text-[var(--text-muted)]">Поставщик: {expense.vendor}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        -{expense.amount.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Все доходы</h3>
              <div className="space-y-3">
                {incomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{income.projectName || 'Доход'}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(income.date).toLocaleDateString('ru-RU')} • {income.description}
                        </p>
                        {income.hours && (
                          <p className="text-xs text-[var(--text-muted)]">
                            {income.hours} часов × {(income.amount / income.hours).toLocaleString('ru-RU')} ₽/час
                          </p>
                        )}
                        {income.projectName && (
                          <p className="text-xs text-[var(--accent-blue)]">📍 {income.projectName}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[var(--accent-green)]">
                      +{income.amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leasing' && equipment.leasingContract && (
            <div className="space-y-6">
              {/* Leasing Summary */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Договор лизинга</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Лизинговая компания</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{equipment.leasingContract.leasingCompany}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Номер договора</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{equipment.leasingContract.contractNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Период</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {new Date(equipment.leasingContract.startDate).toLocaleDateString('ru-RU')} — {new Date(equipment.leasingContract.endDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Платеж в месяц</p>
                    <p className="text-sm font-medium text-[var(--accent-blue)]">
                      {equipment.leasingContract.monthlyPayment.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Общая сумма</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {equipment.leasingContract.totalAmount.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Выкупная стоимость</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {equipment.leasingContract.buyoutAmount?.toLocaleString('ru-RU') || '—'} ₽
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">График платежей</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-green)' }}></div>
                      <span className="text-[var(--text-muted)]">Оплачено</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-amber)' }}></div>
                      <span className="text-[var(--text-muted)]">К оплате</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-red)' }}></div>
                      <span className="text-[var(--text-muted)]">Просрочено</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                {(() => {
                  const paid = equipment.leasingContract!.payments?.filter(p => p.status === 'paid').length || 0;
                  const total = equipment.leasingContract!.payments?.length || 0;
                  const paidAmount = equipment.leasingContract!.payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
                  return (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-muted)]">Прогресс выплат</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{paid} из {total} платежей</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${total > 0 ? (paid / total) * 100 : 0}%`,
                            background: 'var(--accent-green)'
                          }}
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-2">
                        Выплачено {paidAmount.toLocaleString('ru-RU')} ₽ из {equipment.leasingContract!.totalAmount.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  );
                })()}

                {/* Payments Table */}
                <div className="space-y-2">
                                  {equipment.leasingContract.payments?.map((payment, idx) => (
                    <div 
                      key={payment.month + idx} 
                      className="flex items-center justify-between py-3 px-4 rounded-lg"
                      style={{ 
                        background: payment.status === 'paid' ? 'rgba(34, 197, 94, 0.05)' : payment.status === 'overdue' ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-tertiary)'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[var(--text-muted)] w-8">#{idx + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {new Date(payment.month + '-01').toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                          </p>
                          {payment.paidAt && (
                            <p className="text-xs text-[var(--text-muted)]">
                              Оплачен {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {payment.amount.toLocaleString('ru-RU')} ₽
                        </span>
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ 
                            background: payment.status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : payment.status === 'overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: payment.status === 'paid' ? 'var(--accent-green)' : payment.status === 'overdue' ? 'var(--accent-red)' : 'var(--accent-amber)'
                          }}
                        >
                          {payment.status === 'paid' ? 'Оплачен' : payment.status === 'overdue' ? 'Просрочен' : 'К оплате'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Project */}
          {equipment.currentProjectName && (
            <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Текущий объект</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                  📍
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{equipment.currentProjectName}</p>
                  <p className="text-xs text-[var(--accent-blue)]">На объекте</p>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Employees */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Закрепленные сотрудники</h4>
            {equipment.assignedEmployees.length > 0 ? (
              <div className="space-y-3">
                {equipment.assignedEmployees.map((emp) => (
                  <div key={emp.employeeId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                        {emp.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{emp.employeeName}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {emp.role === 'operator' ? 'Оператор' : emp.role === 'driver' ? 'Водитель' : 'Механик'}
                        </p>
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

          {/* Equipment Details */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Характеристики</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Категория</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{category.label}</span>
              </div>
              {equipment.engineHours && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Моточасы</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{equipment.engineHours.toLocaleString('ru-RU')} ч</span>
                </div>
              )}
              {equipment.mileage && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Пробег</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{equipment.mileage.toLocaleString('ru-RU')} км</span>
                </div>
              )}
              {equipment.fuelType && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Топливо</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{equipment.fuelType}</span>
                </div>
              )}
              {equipment.fuelConsumption && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Расход</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{equipment.fuelConsumption} л/час</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Maintenance */}
          {equipment.nextMaintenanceDate && (
            <div className="rounded-xl p-5" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 className="text-sm font-medium text-[var(--accent-amber)] mb-2">⚠️ Плановое ТО</h4>
              <p className="text-sm text-[var(--text-primary)]">
                {new Date(equipment.nextMaintenanceDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Через {Math.ceil((new Date(equipment.nextMaintenanceDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дней
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
