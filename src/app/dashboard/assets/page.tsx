"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllEquipment,
  getAssetsTotals,
  getTopProfitableEquipment,
  getTopUnprofitableEquipment,
  getEquipmentMonthlySummary,
} from "@/lib/mockAssets";
import {
  Equipment,
  equipmentOwnershipConfig,
  equipmentStatusConfig,
  equipmentCategoryConfig,
} from "@/types/assets";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

const currentMonth = "2025-01";

export default function AssetsPage() {
  const [totals, setTotals] = useState<ReturnType<typeof getAssetsTotals> | null>(null);
  const [topProfit, setTopProfit] = useState<ReturnType<typeof getTopProfitableEquipment>>([]);
  const [topLoss, setTopLoss] = useState<ReturnType<typeof getTopUnprofitableEquipment>>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    setTotals(getAssetsTotals(currentMonth));
    setTopProfit(getTopProfitableEquipment(currentMonth, 3));
    setTopLoss(getTopUnprofitableEquipment(currentMonth, 3));
    setEquipment(getAllEquipment());
  }, []);

  if (!totals) return null;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-10">
        <PageHeader
          title="Активы"
          subtitle="Техника и недвижимость — полная экономика каждого актива"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard/assets/analytics">
                <Button variant="secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Аналитика
                </Button>
              </Link>
              <Button variant="primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить актив
              </Button>
            </div>
          }
        />

      {/* Общие KPI */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общий доход</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">
            +{(totals.total.income / 1000).toFixed(0)}к ₽
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">за январь 2025</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общие расходы</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            -{(totals.total.expenses / 1000).toFixed(0)}к ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Чистая прибыль</p>
          <p className={`text-2xl font-semibold ${totals.total.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
            {totals.total.profit >= 0 ? '+' : ''}{(totals.total.profit / 1000).toFixed(0)}к ₽
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Единиц техники</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{totals.equipment.total}</p>
          <p className="text-xs text-[var(--accent-green)] mt-1">{totals.equipment.working} в работе</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Ср. загрузка</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{totals.equipment.avgUtilization}%</p>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${totals.equipment.avgUtilization}%`,
                background: totals.equipment.avgUtilization > 70 ? 'var(--accent-green)' : totals.equipment.avgUtilization > 40 ? 'var(--accent-amber)' : 'var(--accent-red)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Link 
          href="/dashboard/assets/equipment"
          className="p-6 rounded-xl hover:scale-[1.02] transition-transform group"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              🚜
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:tranzinc-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Техника</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">Собственная, лизинг, аренда</p>
          <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-green)]">{equipment.filter(e => e.ownership === 'own').length}</p>
              <p className="text-xs text-[var(--text-muted)]">Своя</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-blue)]">{equipment.filter(e => e.ownership === 'leasing').length}</p>
              <p className="text-xs text-[var(--text-muted)]">Лизинг</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-amber)]">{equipment.filter(e => e.ownership === 'rent').length}</p>
              <p className="text-xs text-[var(--text-muted)]">Аренда</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/dashboard/assets/property"
          className="p-6 rounded-xl hover:scale-[1.02] transition-transform group"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              🏢
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:tranzinc-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Недвижимость</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">Офисы, базы, склады</p>
          <div className="grid grid-cols-2 gap-2 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-green)]">{totals.property.own}</p>
              <p className="text-xs text-[var(--text-muted)]">Собственность</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--accent-amber)]">{totals.property.rent}</p>
              <p className="text-xs text-[var(--text-muted)]">Аренда</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/dashboard/assets/analytics"
          className="p-6 rounded-xl hover:scale-[1.02] transition-transform group"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              📊
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:tranzinc-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Аналитика</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">ROI, сравнение, рекомендации ИИ</p>
          <div className="pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)]">
              <span className="text-[var(--accent-blue)]">3 рекомендации</span> от ИИ
            </p>
          </div>
        </Link>
      </div>

      {/* Топ прибыльных и убыточных */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Топ прибыльных */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <span className="text-[var(--accent-green)]">📈</span>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Топ по прибыли</h3>
          </div>
          <div className="space-y-3">
            {topProfit.map((eq, idx) => {
              const status = equipmentStatusConfig[eq.status];
              const ownership = equipmentOwnershipConfig[eq.ownership];
              return (
                <Link
                  key={eq.id}
                  href={`/dashboard/assets/equipment/${eq.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:scale-[1.01] transition-all"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
                    style={{ background: idx === 0 ? 'rgba(255, 215, 0, 0.2)' : 'var(--bg-secondary)', color: idx === 0 ? '#FFD700' : 'var(--text-muted)' }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{eq.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span style={{ color: ownership.color }}>{ownership.label}</span>
                      <span className="text-[var(--text-muted)]">•</span>
                      <span style={{ color: status.color }}>{status.label}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--accent-green)]">
                      +{(eq.summary.profit / 1000).toFixed(0)}к ₽
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{eq.summary.utilization}% загр.</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Убыточные / низкая загрузка */}
        <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <span className="text-[var(--accent-red)]">📉</span>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">Требуют внимания</h3>
          </div>
          <div className="space-y-3">
            {topLoss.filter(eq => eq.summary.profit < 0).map((eq) => {
              return (
                <Link
                  key={eq.id}
                  href={`/dashboard/assets/equipment/${eq.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:scale-[1.01] transition-all"
                  style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    ⚠️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{eq.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {eq.status === 'repair' ? 'В ремонте — нет дохода' : 
                       eq.status === 'idle' ? 'Простаивает — нет загрузки' :
                       'Расходы превышают доход'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--accent-red)]">
                      {(eq.summary.profit / 1000).toFixed(0)}к ₽
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{eq.summary.utilization}% загр.</p>
                  </div>
                </Link>
              );
            })}
            {topLoss.filter(eq => eq.summary.profit < 0).length === 0 && (
              <div className="text-center py-6 text-[var(--text-muted)]">
                <span className="text-2xl">✨</span>
                <p className="mt-2 text-sm">Все активы прибыльны!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Быстрый обзор техники */}
      <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[var(--text-primary)]">Вся техника</h3>
          <Link href="/dashboard/assets/equipment" className="text-sm text-[var(--accent-blue)] hover:underline">
            Подробнее →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {equipment.slice(0, 6).map((eq) => {
            const summary = getEquipmentMonthlySummary(eq.id, currentMonth);
            const status = equipmentStatusConfig[eq.status];
            const ownership = equipmentOwnershipConfig[eq.ownership];
            const category = equipmentCategoryConfig[eq.category];
            
            return (
              <Link
                key={eq.id}
                href={`/dashboard/assets/equipment/${eq.id}`}
                className="p-4 rounded-xl hover:scale-[1.02] transition-all"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{category.icon}</div>
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ background: status.bgColor, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
                <h4 className="font-medium text-[var(--text-primary)] mb-1 truncate">{eq.name}</h4>
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  <span style={{ color: ownership.color }}>{ownership.label}</span>
                  {eq.currentProjectName && ` • ${eq.currentProjectName}`}
                </p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Прибыль</p>
                    <p className={`text-sm font-semibold ${summary.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {summary.profit >= 0 ? '+' : ''}{(summary.profit / 1000).toFixed(0)}к ₽
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">Загрузка</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{summary.utilization}%</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
