"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAssetsTotals,
  getTopProfitableEquipment,
  getTopUnprofitableEquipment,
  getAllEquipment,
  getAllProperties,
  getEquipmentMonthlySummary,
} from "@/lib/mockAssets";
import {
  equipmentCategoryConfig,
  equipmentStatusConfig,
} from "@/types/assets";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

const currentMonth = "2025-01";

export default function AnalyticsPage() {
  const [totals, setTotals] = useState<ReturnType<typeof getAssetsTotals> | null>(null);
  const [topProfitable, setTopProfitable] = useState<ReturnType<typeof getTopProfitableEquipment>>([]);
  const [topUnprofitable, setTopUnprofitable] = useState<ReturnType<typeof getTopUnprofitableEquipment>>([]);
  const [equipment, setEquipment] = useState<ReturnType<typeof getAllEquipment>>([]);

  useEffect(() => {
    setTotals(getAssetsTotals(currentMonth));
    setTopProfitable(getTopProfitableEquipment(currentMonth, 5));
    setTopUnprofitable(getTopUnprofitableEquipment(currentMonth, 5));
    setEquipment(getAllEquipment());
  }, []);

  if (!totals) return null;

  const totalProfit = totals.equipment.profit + totals.property.profit;
  const totalIncome = totals.equipment.income + totals.property.income;
  const totalExpenses = totals.equipment.expenses + totals.property.expenses;

  // Расчет средней загрузки
  const avgUtilization = equipment.length > 0
    ? Math.round(equipment.reduce((sum, eq) => sum + getEquipmentMonthlySummary(eq.id, currentMonth).utilization, 0) / equipment.length)
    : 0;

  // Группировка по статусу
  const statusGroups = equipment.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Группировка по владению
  const ownershipGroups = equipment.reduce((acc, eq) => {
    acc[eq.ownership] = (acc[eq.ownership] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <Link href="/dashboard/assets" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к активам
        </Link>

        <PageHeader
          title="Аналитика активов"
          subtitle="Сводные показатели по технике и недвижимости"
        />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Аналитика активов</h1>
          <p className="text-[var(--text-muted)]">Полная картина эффективности ваших активов</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--text-muted)]">Период:</span>
          <span className="px-3 py-1.5 rounded-lg font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            Январь 2025
          </span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего активов</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {totals.equipment.total + totals.property.total}
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общий доход</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">
            +{(totalIncome / 1000000).toFixed(1)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общие расходы</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            -{(totalExpenses / 1000000).toFixed(1)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Чистая прибыль</p>
          <p className={`text-2xl font-semibold ${totalProfit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
            {totalProfit >= 0 ? '+' : ''}{(totalProfit / 1000000).toFixed(2)}M ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Рентабельность</p>
          <p className={`text-2xl font-semibold ${totalIncome > 0 && (totalProfit / totalIncome) * 100 > 20 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}`}>
            {totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(0) : 0}%
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Ср. загрузка</p>
          <p className={`text-2xl font-semibold ${avgUtilization > 70 ? 'text-[var(--accent-green)]' : avgUtilization > 40 ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-red)]'}`}>
            {avgUtilization}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Top Profitable */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📈</span>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Топ-5 прибыльных</h3>
          </div>
          <div className="space-y-3">
            {topProfitable.map((eq, idx) => {
              const summary = getEquipmentMonthlySummary(eq.id, currentMonth);
              const category = equipmentCategoryConfig[eq.category];
              return (
                <Link
                  key={eq.id}
                  href={`/dashboard/assets/equipment/${eq.id}`}
                  className="flex items-center justify-between py-2 hover:opacity-80"
                  style={{ borderBottom: idx < topProfitable.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--text-muted)] w-6">#{idx + 1}</span>
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{eq.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{summary.utilization}% загрузка</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent-green)]">
                    +{(summary.profit / 1000).toFixed(0)}к ₽
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Unprofitable */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📉</span>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Топ-5 убыточных</h3>
          </div>
          <div className="space-y-3">
            {topUnprofitable.map((eq, idx) => {
              const summary = getEquipmentMonthlySummary(eq.id, currentMonth);
              const category = equipmentCategoryConfig[eq.category];
              return (
                <Link
                  key={eq.id}
                  href={`/dashboard/assets/equipment/${eq.id}`}
                  className="flex items-center justify-between py-2 hover:opacity-80"
                  style={{ borderBottom: idx < topUnprofitable.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[var(--text-muted)] w-6">#{idx + 1}</span>
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{eq.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{summary.utilization}% загрузка</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent-red)]">
                    {(summary.profit / 1000).toFixed(0)}к ₽
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Статус техники</h3>
          <div className="space-y-3">
            {Object.entries(statusGroups).map(([status, count]) => {
              const config = equipmentStatusConfig[status as keyof typeof equipmentStatusConfig];
              const percent = Math.round((count / equipment.length) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">{config?.label || status}</span>
                    <span className="text-sm font-medium text-[var(--text-muted)]">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div 
                      className="h-full rounded-full"
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

        {/* Ownership Distribution */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Форма владения</h3>
          <div className="flex items-center justify-center gap-4 py-6">
            {Object.entries(ownershipGroups).map(([ownership, count]) => {
              const colors: Record<string, string> = {
                own: 'var(--accent-green)',
                leasing: 'var(--accent-blue)',
                rent: 'var(--accent-amber)'
              };
              const labels: Record<string, string> = {
                own: 'Собственность',
                leasing: 'Лизинг',
                rent: 'Аренда'
              };
              return (
                <div key={ownership} className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-2 mx-auto"
                    style={{ background: `${colors[ownership]}20`, border: `3px solid ${colors[ownership]}` }}
                  >
                    <span className="text-2xl font-bold" style={{ color: colors[ownership] }}>{count}</span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{labels[ownership]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipment vs Property */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Доход по типу</h3>
          <div className="space-y-4 py-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>🚜</span>
                  <span className="text-sm text-[var(--text-primary)]">Техника</span>
                </div>
                <span className="text-sm font-medium text-[var(--accent-green)]">
                  +{(totals.equipment.income / 1000).toFixed(0)}к ₽
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${totalIncome > 0 ? (totals.equipment.income / totalIncome) * 100 : 0}%`,
                    background: 'var(--accent-green)'
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>🏢</span>
                  <span className="text-sm text-[var(--text-primary)]">Недвижимость</span>
                </div>
                <span className="text-sm font-medium text-[var(--accent-blue)]">
                  +{(totals.property.income / 1000).toFixed(0)}к ₽
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${totalIncome > 0 ? (totals.property.income / totalIncome) * 100 : 0}%`,
                    background: 'var(--accent-blue)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
            🤖
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Рекомендации ИИ</h3>
            <p className="text-sm text-[var(--text-muted)]">На основе анализа ваших активов</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400">⚠️</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Внимание</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Бульдозер Komatsu D65 простаивает и генерирует убытки. Рекомендуется найти объект или сдать в аренду.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">💡</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Оптимизация</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Экскаватор CAT 320 можно перевести на объект "Логистический центр" для увеличения загрузки на 20%.
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">📊</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">Прогноз</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              При текущей загрузке общая прибыль за квартал составит ~{((totalProfit * 3) / 1000000).toFixed(1)}M ₽.
            </p>
          </div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
