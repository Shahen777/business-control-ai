"use client";

import { useState, useEffect } from "react";
import { getContractById } from "@/lib/mockLegal";
import { Contract, contractStatusConfig, severityConfig } from "@/types/legal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function ContractDetailPage() {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      const found = getContractById(params.id);
      setContract(found || null);
    }
  }, [params.id]);

  if (!contract) {
    return (
      <PageLayout>
        <div className="animate-fadeIn">
          <div className="p-12 text-center rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[var(--text-muted)] mb-4">Договор не найден</p>
            <Link href="/dashboard/legal/contracts">
              <Button variant="primary">Вернуться к списку</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const status = contractStatusConfig[contract.status];
  const hasRisks = contract.extracted?.riskyClauses && contract.extracted.riskyClauses.length > 0;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <Link href="/dashboard/legal/contracts" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку договоров
        </Link>

        <PageHeader
          title={contract.title}
          subtitle="Карточка договора и ключевые параметры"
          actions={
            <span
              className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
              style={{ background: status.bgColor, color: status.color }}
            >
              {status.label}
            </span>
          }
        />
          <p className="text-[var(--text-muted)]">
            {contract.number && `№ ${contract.number} • `}
            {contract.counterparty}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary">Редактировать</button>
          <button className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {contract.amountRub && (
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Сумма договора</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {contract.amountRub.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        )}
        {contract.advanceRub && (
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Аванс</p>
            <p className="text-2xl font-semibold text-[var(--accent-blue)]">
              {contract.advanceRub.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        )}
        {contract.startDate && (
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Дата начала</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {new Date(contract.startDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}
        {contract.endDate && (
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Дата окончания</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              {new Date(contract.endDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}
      </div>

      {/* Risky Clauses Warning */}
      {hasRisks && contract.extracted?.riskyClauses && (
        <div className="mb-8 p-5 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-500 mb-3">Обнаружены рискованные условия</h3>
              <div className="space-y-3">
                {contract.extracted.riskyClauses.map((risk, idx) => {
                  const sev = severityConfig[risk.severity];
                  return (
                    <div key={idx} className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-start gap-3 mb-2">
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                          style={{ background: sev.bgColor, color: sev.color }}
                        >
                          {sev.label}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--text-primary)] mb-1">{risk.title}</h4>
                          {risk.clauseNumber && (
                            <p className="text-xs text-[var(--text-muted)] mb-2">{risk.clauseNumber}</p>
                          )}
                          <p className="text-sm text-[var(--text-muted)]">{risk.why}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contract Info */}
          <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Информация о договоре</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Контрагент</p>
                <p className="text-[var(--text-primary)] font-medium">{contract.counterparty}</p>
              </div>
              {contract.counterpartyINN && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">ИНН контрагента</p>
                  <p className="text-[var(--text-primary)] font-medium">{contract.counterpartyINN}</p>
                </div>
              )}
              {contract.projectName && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Проект</p>
                  <p className="text-[var(--text-primary)] font-medium">{contract.projectName}</p>
                </div>
              )}
              {contract.extracted?.subject && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Предмет договора</p>
                  <p className="text-[var(--text-primary)]">{contract.extracted.subject}</p>
                </div>
              )}
              {contract.extracted?.paymentTerms && (
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Условия оплаты</p>
                  <p className="text-[var(--text-primary)]">{contract.extracted.paymentTerms}</p>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          {contract.extracted?.milestones && contract.extracted.milestones.length > 0 && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Этапы работ</h2>
              <div className="space-y-3">
                {contract.extracted.milestones.map((milestone, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-[var(--text-primary)]">{milestone.name}</p>
                      {milestone.status && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          milestone.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          milestone.status === 'overdue' ? 'bg-red-500/20 text-red-500' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {milestone.status === 'completed' ? 'Завершён' : 
                           milestone.status === 'overdue' ? 'Просрочен' : 'В работе'}
                        </span>
                      )}
                    </div>
                    {milestone.date && (
                      <p className="text-sm text-[var(--text-muted)]">
                        Срок: {new Date(milestone.date).toLocaleDateString('ru-RU')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {contract.files && contract.files.length > 0 && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Файлы</h2>
              <div className="space-y-2">
                {contract.files.map((file) => (
                  <div key={file.id} className="p-3 rounded-lg flex items-center gap-3" style={{ background: 'var(--bg-tertiary)' }}>
                    <svg className="w-8 h-8 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--text-primary)] truncate">{file.filename}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Размер неизвестен'}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-secondary">Скачать</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Obligations */}
          {contract.extracted?.obligations && contract.extracted.obligations.length > 0 && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Обязательства</h2>
              <div className="space-y-3">
                {contract.extracted.obligations.map((obligation, idx) => (
                  <div key={idx} className="p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        obligation.side === 'we' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'
                      }`}>
                        {obligation.side === 'we' ? '👤' : '🏢'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                          {obligation.side === 'we' ? 'Наши обязательства' : 'Обязательства контрагента'}
                        </p>
                        <p className="text-sm text-[var(--text-muted)] mb-2">{obligation.text}</p>
                        {obligation.dueDate && (
                          <p className="text-xs text-[var(--text-muted)]">
                            Срок: {new Date(obligation.dueDate).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                        {obligation.status && (
                          <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded ${
                            obligation.status === 'fulfilled' ? 'bg-green-500/20 text-green-500' :
                            obligation.status === 'overdue' ? 'bg-red-500/20 text-red-500' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {obligation.status === 'fulfilled' ? 'Выполнено' :
                             obligation.status === 'overdue' ? 'Просрочено' : 'В процессе'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penalties */}
          {contract.extracted?.penalties && contract.extracted.penalties.length > 0 && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Штрафы и неустойки</h2>
              <div className="space-y-3">
                {contract.extracted.penalties.map((penalty, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{penalty.trigger}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      {penalty.rate && <span>Ставка: {penalty.rate}</span>}
                      {penalty.cap && <span>Макс: {penalty.cap}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {contract.extracted?.summary && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Краткое резюме ИИ</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {contract.extracted.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
