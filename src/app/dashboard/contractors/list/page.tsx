"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getAllContractors,
  getContractorsTotals,
} from "@/lib/mockContractors";
import {
  Contractor,
  ContractorType,
  contractorTypeConfig,
  contractorReputationConfig,
} from "@/types/contractors";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

type TabType = 'all' | ContractorType;

export default function ContractorsListPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [totals, setTotals] = useState<ReturnType<typeof getContractorsTotals> | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<'name' | 'income' | 'receivables' | 'reputation'>('income');

  useEffect(() => {
    setContractors(getAllContractors());
    setTotals(getContractorsTotals());
  }, []);

  // Фильтрация по типу
  const filteredContractors = useMemo(() => {
    let result = contractors;
    if (activeTab !== 'all') {
      result = result.filter(c => c.type === activeTab);
    }

    // Сортировка
    switch (sortBy) {
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'income':
        result = [...result].sort((a, b) => b.totalIncome - a.totalIncome);
        break;
      case 'receivables':
        result = [...result].sort((a, b) => b.totalReceivables - a.totalReceivables);
        break;
      case 'reputation':
        const repOrder = { 'excellent': 5, 'good': 4, 'neutral': 3, 'problematic': 2, 'blacklisted': 1 };
        result = [...result].sort((a, b) => repOrder[b.reputation] - repOrder[a.reputation]);
        break;
    }

    return result;
  }, [contractors, activeTab, sortBy]);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: totals?.total || 0 },
    { key: 'customer', label: '🏢 Заказчики', count: totals?.customers || 0 },
    { key: 'supplier', label: '📦 Поставщики', count: totals?.suppliers || 0 },
    { key: 'subcontractor', label: '👷 Подрядчики', count: totals?.subcontractors || 0 },
  ];

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <div className="flex items-center gap-2 text-[13px] text-zinc-400">
          <Link href="/dashboard/contractors" className="hover:text-white">
            Контрагенты и объекты
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Контрагенты</span>
        </div>
        <PageHeader
          title="Контрагенты"
          subtitle="Управление партнёрами, заказчиками и поставщиками"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить контрагента
            </Button>
          }
        />

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Всего контрагентов</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{totals?.total || 0}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Доход от заказчиков</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">
            {((totals?.totalIncome || 0) / 1000000).toFixed(1)}M ₽
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Дебиторка</p>
          <p className="text-2xl font-semibold text-[var(--accent-amber)]">
            {((totals?.totalReceivables || 0) / 1000000).toFixed(2)}M ₽
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Просрочка</p>
          <p className={`text-2xl font-semibold ${(totals?.overdueReceivables || 0) > 0 ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}`}>
            {((totals?.overdueReceivables || 0) / 1000).toFixed(0)}к ₽
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Проблемные</p>
          <p className={`text-2xl font-semibold ${(totals?.problematic || 0) > 0 ? 'text-[var(--accent-red)]' : 'text-[var(--text-primary)]'}`}>
            {totals?.problematic || 0}
          </p>
        </div>
      </div>

      {/* Tabs & Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
                border: activeTab === tab.key ? '1px solid var(--border-secondary)' : '1px solid transparent',
              }}
            >
              {tab.label} <span className="ml-1 opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg text-sm bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)]"
          >
            <option value="income">По доходу</option>
            <option value="receivables">По дебиторке</option>
            <option value="name">По названию</option>
            <option value="reputation">По репутации</option>
          </select>
        </div>
      </div>

      {/* Contractors List */}
      <div className="space-y-4">
        {filteredContractors.map((contractor) => {
          const typeConfig = contractorTypeConfig[contractor.type];
          const repConfig = contractorReputationConfig[contractor.reputation];
          
          return (
            <Link
              key={contractor.id}
              href={`/dashboard/contractors/list/${contractor.id}`}
              className="flex items-center gap-6 p-5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all group"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${typeConfig.color}15`, border: `1px solid ${typeConfig.color}30` }}
              >
                {typeConfig.icon}
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                    {contractor.name}
                  </h3>
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ background: `${repConfig.color}15`, color: repConfig.color }}
                  >
                    {repConfig.icon} {repConfig.label}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  {typeConfig.label} • ИНН {contractor.inn}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-[var(--text-muted)]">
                    📁 {contractor.activeProjects} активных из {contractor.totalProjects}
                  </span>
                  {contractor.contacts[0] && (
                    <span className="text-xs text-[var(--text-muted)]">
                      👤 {contractor.contacts[0].name}
                    </span>
                  )}
                </div>
              </div>

              {/* Financial Stats */}
              {contractor.type === 'customer' && (
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Доход</p>
                    <p className="text-lg font-semibold text-[var(--accent-green)]">
                      +{(contractor.totalIncome / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Дебиторка</p>
                    <p className={`text-lg font-semibold ${contractor.totalReceivables > 0 ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>
                      {contractor.totalReceivables > 0 ? `${(contractor.totalReceivables / 1000).toFixed(0)}к` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Просрочка</p>
                    <p className={`text-lg font-semibold ${contractor.overdueReceivables > 0 ? 'text-[var(--accent-red)]' : 'text-[var(--text-muted)]'}`}>
                      {contractor.overdueReceivables > 0 ? `${(contractor.overdueReceivables / 1000).toFixed(0)}к` : '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment discipline for suppliers/subcontractors */}
              {contractor.type !== 'customer' && (
                <div className="text-center">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Дисциплина</p>
                  <span 
                    className="px-2 py-1 rounded text-sm font-medium"
                    style={{ 
                      background: contractor.paymentDiscipline === 'excellent' || contractor.paymentDiscipline === 'good' 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : contractor.paymentDiscipline === 'poor' 
                        ? 'rgba(239, 68, 68, 0.1)' 
                        : 'rgba(245, 158, 11, 0.1)',
                      color: contractor.paymentDiscipline === 'excellent' || contractor.paymentDiscipline === 'good' 
                        ? 'var(--accent-green)' 
                        : contractor.paymentDiscipline === 'poor' 
                        ? 'var(--accent-red)' 
                        : 'var(--accent-amber)'
                    }}
                  >
                    {contractor.paymentDiscipline === 'excellent' ? 'Отличная' : 
                     contractor.paymentDiscipline === 'good' ? 'Хорошая' : 
                     contractor.paymentDiscipline === 'average' ? 'Средняя' : 
                     'Плохая'}
                  </span>
                </div>
              )}

              {/* Arrow */}
              <svg 
                className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>

      {filteredContractors.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-muted)]">Контрагенты не найдены</p>
        </div>
      )}
      </div>
    </PageLayout>
  );
}
