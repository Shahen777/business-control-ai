"use client";

import { useState, useEffect } from "react";
import { getAllContracts } from "@/lib/mockLegal";
import { Contract, ContractStatus, contractStatusConfig } from "@/types/legal";
import Link from "next/link";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState<'all' | ContractStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setContracts(getAllContracts());
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const matchesFilter = filter === 'all' || contract.status === filter;
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.number && contract.number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activeCount = contracts.filter(c => c.status === 'active').length;
  const draftCount = contracts.filter(c => c.status === 'draft').length;
  const closedCount = contracts.filter(c => c.status === 'closed').length;
  const disputedCount = contracts.filter(c => c.status === 'disputed').length;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Договоры"
          subtitle="Управление всеми договорами компании"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать договор
            </Button>
          }
        />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{contracts.length}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Активные</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">{activeCount}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Черновики</p>
          <p className="text-2xl font-semibold text-[var(--accent-amber)]">{draftCount}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Закрыты</p>
          <p className="text-2xl font-semibold text-[var(--accent-blue)]">{closedCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Поиск по названию, контрагенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'Все' },
              { key: 'active', label: `Активные (${activeCount})` },
              { key: 'draft', label: `Черновики (${draftCount})` },
              { key: 'closed', label: `Закрыты (${closedCount})` },
              { key: 'disputed', label: `Спорные (${disputedCount})` },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: filter === item.key ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  color: filter === item.key ? 'white' : 'var(--text-primary)',
                  border: `1px solid ${filter === item.key ? 'var(--accent-blue)' : 'var(--border-secondary)'}`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="p-12 text-center rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[var(--text-muted)]">Договоры не найдены</p>
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const status = contractStatusConfig[contract.status];
            const hasRisks = contract.extracted?.riskyClauses && contract.extracted.riskyClauses.length > 0;
            const highRisks = contract.extracted?.riskyClauses?.filter(r => r.severity === 'high').length || 0;

            return (
              <Link
                key={contract.id}
                href={`/dashboard/legal/contracts/${contract.id}`}
                className="block rounded-xl p-5 hover:scale-[1.01] transition-all"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title & Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{contract.title}</h3>
                      <span 
                        className="px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{ background: status.bgColor, color: status.color }}
                      >
                        {status.label}
                      </span>
                      {hasRisks && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500">
                          ⚠️ {highRisks > 0 ? `${highRisks} критичных` : 'Есть риски'}
                        </span>
                      )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-[var(--text-muted)] text-xs mb-1">Контрагент</p>
                        <p className="text-[var(--text-primary)] font-medium">{contract.counterparty}</p>
                      </div>
                      {contract.number && (
                        <div>
                          <p className="text-[var(--text-muted)] text-xs mb-1">Номер</p>
                          <p className="text-[var(--text-primary)] font-medium">{contract.number}</p>
                        </div>
                      )}
                      {contract.amountRub && (
                        <div>
                          <p className="text-[var(--text-muted)] text-xs mb-1">Сумма</p>
                          <p className="text-[var(--text-primary)] font-medium">
                            {contract.amountRub.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      )}
                      {(contract.startDate || contract.endDate) && (
                        <div>
                          <p className="text-[var(--text-muted)] text-xs mb-1">Срок</p>
                          <p className="text-[var(--text-primary)] font-medium">
                            {contract.startDate && new Date(contract.startDate).toLocaleDateString('ru-RU')}
                            {contract.startDate && contract.endDate && ' — '}
                            {contract.endDate && new Date(contract.endDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {contract.extracted?.summary && (
                      <p className="mt-3 text-sm text-[var(--text-muted)] line-clamp-2">
                        {contract.extracted.summary}
                      </p>
                    )}
                  </div>

                  <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })
        )}
      </div>
      </div>
    </PageLayout>
  );
}
