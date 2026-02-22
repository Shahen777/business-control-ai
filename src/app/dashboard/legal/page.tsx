"use client";

import { useState, useEffect } from "react";
import { getAllContracts } from "@/lib/mockLegal";
import { Contract, contractStatusConfig } from "@/types/legal";
import Link from "next/link";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function LegalPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    setContracts(getAllContracts());
  }, []);

  const activeContracts = contracts.filter(c => c.status === 'active');
  const draftContracts = contracts.filter(c => c.status === 'draft');
  const closedContracts = contracts.filter(c => c.status === 'closed');
  const disputedContracts = contracts.filter(c => c.status === 'disputed');

  const totalAmount = activeContracts.reduce((sum, c) => sum + (c.amountRub || 0), 0);

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Юридический модуль"
          subtitle="Управление договорами и документами"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard/legal/documents">
                <Button variant="secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Документы
                </Button>
              </Link>
              <Link href="/dashboard/legal/contracts">
                <Button variant="primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Новый договор
                </Button>
              </Link>
            </div>
          }
        />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего договоров</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{contracts.length}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Активные</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">{activeContracts.length}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Черновики</p>
          <p className="text-2xl font-semibold text-[var(--accent-amber)]">{draftContracts.length}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Общая сумма активных</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {totalAmount.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link 
          href="/dashboard/legal/contracts"
          className="p-6 rounded-xl hover:scale-[1.02] transition-transform"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
              📄
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Договоры</h3>
          <p className="text-sm text-[var(--text-muted)]">Управление всеми договорами компании</p>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Активные:</span>
              <span className="font-semibold text-[var(--accent-green)]">{activeContracts.length}</span>
            </div>
          </div>
        </Link>

        <Link 
          href="/dashboard/legal/documents"
          className="p-6 rounded-xl hover:scale-[1.02] transition-transform"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}>
              📋
            </div>
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Документы</h3>
          <p className="text-sm text-[var(--text-muted)]">Генерация актов, счетов и других документов</p>
        </Link>
      </div>

      {/* Recent Contracts */}
      <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Последние договоры</h2>
          <Link href="/dashboard/legal/contracts" className="text-sm text-[var(--accent-blue)] hover:underline">
            Посмотреть все →
          </Link>
        </div>

        <div className="space-y-3">
          {contracts.slice(0, 5).map((contract) => {
            const status = contractStatusConfig[contract.status];
            return (
              <Link
                key={contract.id}
                href={`/dashboard/legal/contracts/${contract.id}`}
                className="block p-4 rounded-lg hover:scale-[1.01] transition-transform"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-[var(--text-primary)]">{contract.title}</h3>
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: status.bgColor, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span>{contract.counterparty}</span>
                      {contract.number && <span>№ {contract.number}</span>}
                      {contract.amountRub && (
                        <span className="font-medium text-[var(--text-primary)]">
                          {contract.amountRub.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
