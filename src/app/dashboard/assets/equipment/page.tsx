"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllEquipment,
  getEquipmentByOwnership,
  getEquipmentMonthlySummary,
  getAssetsTotals,
} from "@/lib/mockAssets";
import {
  Equipment,
  EquipmentOwnership,
  equipmentOwnershipConfig,
  equipmentStatusConfig,
  equipmentCategoryConfig,
} from "@/types/assets";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

const currentMonth = "2025-01";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filter, setFilter] = useState<'all' | EquipmentOwnership>('all');
  const [totals, setTotals] = useState<ReturnType<typeof getAssetsTotals> | null>(null);

  useEffect(() => {
    if (filter === 'all') {
      setEquipment(getAllEquipment());
    } else {
      setEquipment(getEquipmentByOwnership(filter));
    }
    setTotals(getAssetsTotals(currentMonth));
  }, [filter]);

  const allEquipment = getAllEquipment();
  const ownCount = allEquipment.filter(e => e.ownership === 'own').length;
  const leasingCount = allEquipment.filter(e => e.ownership === 'leasing').length;
  const rentCount = allEquipment.filter(e => e.ownership === 'rent').length;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Техника"
          subtitle="Собственная, лизинг и арендованная техника"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить технику
            </Button>
          }
        />

      {/* KPI */}
      {totals && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего единиц</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{totals.equipment.total}</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">В работе</p>
            <p className="text-2xl font-semibold text-[var(--accent-green)]">{totals.equipment.working}</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Простой / ТО</p>
            <p className="text-2xl font-semibold text-[var(--accent-amber)]">
              {totals.equipment.idle + totals.equipment.maintenance + totals.equipment.repair}
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Доход/мес</p>
            <p className="text-2xl font-semibold text-[var(--accent-green)]">
              +{(totals.equipment.income / 1000).toFixed(0)}к ₽
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Прибыль/мес</p>
            <p className={`text-2xl font-semibold ${totals.equipment.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
              {totals.equipment.profit >= 0 ? '+' : ''}{(totals.equipment.profit / 1000).toFixed(0)}к ₽
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'all', label: `Вся техника (${allEquipment.length})` },
          { key: 'own', label: `Собственная (${ownCount})`, color: equipmentOwnershipConfig.own.color },
          { key: 'leasing', label: `Лизинг (${leasingCount})`, color: equipmentOwnershipConfig.leasing.color },
          { key: 'rent', label: `Аренда (${rentCount})`, color: equipmentOwnershipConfig.rent.color },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === tab.key ? 'var(--bg-tertiary)' : 'transparent',
              color: filter === tab.key ? (tab.color || 'var(--text-primary)') : 'var(--text-muted)',
              border: filter === tab.key ? '1px solid var(--border-secondary)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Equipment List */}
      <div className="space-y-4">
        {equipment.map((eq) => {
          const summary = getEquipmentMonthlySummary(eq.id, currentMonth);
          const status = equipmentStatusConfig[eq.status];
          const ownership = equipmentOwnershipConfig[eq.ownership];
          const category = equipmentCategoryConfig[eq.category];
          
          return (
            <Link
              key={eq.id}
              href={`/dashboard/assets/equipment/${eq.id}`}
              className="block rounded-xl p-5 hover:scale-[1.005] transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
            >
              <div className="flex items-start gap-5">
                {/* Icon & Status */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {category.icon}
                  </div>
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{eq.name}</h3>
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ background: status.bgColor, color: status.color }}
                        >
                          {status.label}
                        </span>
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ background: ownership.bgColor, color: ownership.color }}
                        >
                          {ownership.label}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)]">
                        {eq.brand} {eq.model} {eq.year && `• ${eq.year} г.`}
                        {eq.plateNumber && ` • ${eq.plateNumber}`}
                      </p>
                    </div>
                  </div>

                  {/* Project & Employees */}
                  <div className="flex items-center gap-4 text-sm mb-3">
                    {eq.currentProjectName && (
                      <span className="text-[var(--text-muted)]">
                        📍 {eq.currentProjectName}
                      </span>
                    )}
                    {eq.assignedEmployees.length > 0 && (
                      <span className="text-[var(--text-muted)]">
                        👤 {eq.assignedEmployees.find(e => e.role === 'operator' || e.role === 'driver')?.employeeName || eq.assignedEmployees[0].employeeName}
                      </span>
                    )}
                    {eq.hourlyRate && (
                      <span className="text-[var(--text-muted)]">
                        💰 {eq.hourlyRate.toLocaleString('ru-RU')} ₽/час
                      </span>
                    )}
                  </div>

                  {/* Leasing Info */}
                  {eq.ownership === 'leasing' && eq.leasingContract && (
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">
                          Лизинг: {eq.leasingContract.leasingCompany} • до {new Date(eq.leasingContract.endDate).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="font-medium text-[var(--accent-blue)]">
                          {(eq.leasingContract.monthlyPayment / 1000).toFixed(0)}к ₽/мес
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rent Info */}
                  {eq.ownership === 'rent' && eq.rentContract && (
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">
                          Аренда: {eq.rentContract.lessor}
                          {eq.rentContract.endDate && ` • до ${new Date(eq.rentContract.endDate).toLocaleDateString('ru-RU')}`}
                        </span>
                        <span className="font-medium text-[var(--accent-amber)]">
                          {eq.rentContract.monthlyRate && `${(eq.rentContract.monthlyRate / 1000).toFixed(0)}к ₽/мес`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="flex-shrink-0 w-48">
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Доход</span>
                        <span className="text-sm font-medium text-[var(--accent-green)]">
                          +{(summary.totalIncome / 1000).toFixed(0)}к ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Расходы</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          -{(summary.totalExpenses / 1000).toFixed(0)}к ₽
                        </span>
                      </div>
                      <div className="pt-2" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[var(--text-primary)]">Прибыль</span>
                          <span className={`text-sm font-bold ${summary.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                            {summary.profit >= 0 ? '+' : ''}{(summary.profit / 1000).toFixed(0)}к ₽
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[var(--text-muted)]">Загрузка</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{summary.utilization}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${summary.utilization}%`,
                            background: summary.utilization > 70 ? 'var(--accent-green)' : summary.utilization > 40 ? 'var(--accent-amber)' : 'var(--accent-red)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 self-center">
                  <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </PageLayout>
  );
}
