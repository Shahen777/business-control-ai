"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAllProperties,
  getPropertyExpenses,
  getPropertyIncomes,
  getAssetsTotals,
} from "@/lib/mockAssets";
import {
  Property,
  propertyTypeConfig,
  expenseTypeConfig,
} from "@/types/assets";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

const currentMonth = "2025-01";

export default function PropertyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [totals, setTotals] = useState<ReturnType<typeof getAssetsTotals> | null>(null);
  const [filter, setFilter] = useState<'all' | 'own' | 'rent'>('all');

  useEffect(() => {
    const all = getAllProperties();
    if (filter === 'all') {
      setProperties(all);
    } else {
      setProperties(all.filter(p => p.ownership === filter));
    }
    setTotals(getAssetsTotals(currentMonth));
  }, [filter]);

  const allProperties = getAllProperties();
  const ownCount = allProperties.filter(p => p.ownership === 'own').length;
  const rentCount = allProperties.filter(p => p.ownership === 'rent').length;

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
          title="Недвижимость"
          subtitle="Офисы, склады и производственные базы"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить объект
            </Button>
          }
        />

      {/* KPI */}
      {totals && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Объектов</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{totals.property.total}</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общая площадь</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {allProperties.reduce((sum, p) => sum + p.area, 0).toLocaleString('ru-RU')} м²
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Доход/мес</p>
            <p className="text-2xl font-semibold text-[var(--accent-green)]">
              +{(totals.property.income / 1000).toFixed(0)}к ₽
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Расходы/мес</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              -{(totals.property.expenses / 1000).toFixed(0)}к ₽
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'all', label: `Все объекты (${allProperties.length})` },
          { key: 'own', label: `Собственность (${ownCount})` },
          { key: 'rent', label: `Аренда (${rentCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === tab.key ? 'var(--bg-tertiary)' : 'transparent',
              color: filter === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              border: filter === tab.key ? '1px solid var(--border-secondary)' : '1px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-2 gap-6">
        {properties.map((property) => {
          const expenses = getPropertyExpenses(property.id, currentMonth);
          const incomes = getPropertyIncomes(property.id, currentMonth);
          const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
          const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
          const config = propertyTypeConfig[property.type];

          return (
            <div 
              key={property.id}
              className="rounded-xl p-6 hover:scale-[1.01] transition-all cursor-pointer"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{property.name}</h3>
                      <span 
                        className="px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{ 
                          background: property.ownership === 'own' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: property.ownership === 'own' ? 'var(--accent-green)' : 'var(--accent-amber)'
                        }}
                      >
                        {property.ownership === 'own' ? 'Собственность' : 'Аренда'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{property.address}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Площадь</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{property.area} м²</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Тип</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{config.label}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Использование</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{property.purpose}</p>
                </div>
              </div>

              {/* Rent Info */}
              {property.ownership === 'rent' && property.rentContract && (
                <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">
                      Арендодатель: {property.rentContract.lessor}
                    </span>
                    <span className="font-medium text-[var(--accent-amber)]">
                      {(property.rentContract.monthlyRate / 1000).toFixed(0)}к ₽/мес
                    </span>
                  </div>
                  {property.rentContract.endDate && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      До {new Date(property.rentContract.endDate).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
              )}

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Доход</p>
                  <p className="text-sm font-semibold text-[var(--accent-green)]">
                    +{(totalIncome / 1000).toFixed(0)}к ₽
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Расходы</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    -{(totalExpenses / 1000).toFixed(0)}к ₽
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Баланс</p>
                  <p className={`text-sm font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                    {totalIncome - totalExpenses >= 0 ? '+' : ''}{((totalIncome - totalExpenses) / 1000).toFixed(0)}к ₽
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              {expenses.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2">Расходы по статьям:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(
                      expenses.reduce((acc, e) => {
                        acc[e.type] = (acc[e.type] || 0) + e.amount;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, amount]) => {
                      const config = expenseTypeConfig[type as keyof typeof expenseTypeConfig];
                      return (
                        <span 
                          key={type}
                          className="px-2 py-1 rounded-md text-xs"
                          style={{ background: 'var(--bg-tertiary)' }}
                        >
                          {config?.icon} {config?.label}: {(amount / 1000).toFixed(0)}к
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </PageLayout>
  );
}
