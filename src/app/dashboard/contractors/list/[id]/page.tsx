"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  getContractorById,
  getProjectsByContractor,
} from "@/lib/mockContractors";
import {
  Contractor,
  Project,
  contractorTypeConfig,
  contractorReputationConfig,
  projectTypeConfig,
  projectStatusConfig,
} from "@/types/contractors";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContractorDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'documents' | 'history'>('overview');

  useEffect(() => {
    const c = getContractorById(id);
    if (c) {
      setContractor(c);
      setProjects(getProjectsByContractor(id));
    }
  }, [id]);

  if (!contractor) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--text-muted)]">Контрагент не найден</p>
        </div>
      </PageLayout>
    );
  }

  const typeConfig = contractorTypeConfig[contractor.type];
  const repConfig = contractorReputationConfig[contractor.reputation];
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <Link href="/dashboard/contractors/list" className="inline-flex items-center text-[13px] text-zinc-400 hover:text-white">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к контрагентам
        </Link>

        <PageHeader
          title={contractor.name}
          subtitle="Карточка контрагента и ключевые показатели"
          actions={
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
                style={{ background: typeConfig.bgColor, color: typeConfig.color }}
              >
                {typeConfig.label}
              </span>
              <span
                className="px-3 py-1 rounded-[10px] text-[13px] font-medium"
                style={{ background: repConfig.bgColor, color: repConfig.color }}
              >
                {repConfig.label}
              </span>
            </div>
          }
        />
        <div className="flex items-start gap-5">
          <div 
            className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
            style={{ background: `${typeConfig.color}15`, border: `1px solid ${typeConfig.color}30` }}
          >
            {typeConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{contractor.name}</h1>
              <span 
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: `${repConfig.color}15`, color: repConfig.color }}
              >
                {repConfig.icon} {repConfig.label}
              </span>
            </div>
            <p className="text-[var(--text-muted)]">{typeConfig.label}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">ИНН {contractor.inn} {contractor.kpp ? `• КПП ${contractor.kpp}` : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Редактировать
          </button>
          <button className="btn btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать объект
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {contractor.type === 'customer' && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего объектов</p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">{contractor.totalProjects}</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Активных</p>
            <p className="text-2xl font-semibold text-[var(--accent-blue)]">{contractor.activeProjects}</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Доход</p>
            <p className="text-2xl font-semibold text-[var(--accent-green)]">
              +{(contractor.totalIncome / 1000000).toFixed(1)}M ₽
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Дебиторка</p>
            <p className={`text-2xl font-semibold ${contractor.totalReceivables > 0 ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>
              {contractor.totalReceivables > 0 ? `${(contractor.totalReceivables / 1000).toFixed(0)}к ₽` : '—'}
            </p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Просрочка</p>
            <p className={`text-2xl font-semibold ${contractor.overdueReceivables > 0 ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}`}>
              {contractor.overdueReceivables > 0 ? `${(contractor.overdueReceivables / 1000).toFixed(0)}к ₽` : '0 ₽'}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-secondary)' }}>
        {[
          { key: 'overview', label: 'Обзор' },
          { key: 'projects', label: `Объекты (${projects.length})` },
          { key: 'documents', label: 'Документы' },
          { key: 'history', label: 'История' },
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
              {/* Contact Info */}
              <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Контактная информация</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Юридический адрес</p>
                      <p className="text-sm text-[var(--text-primary)]">{contractor.legalAddress}</p>
                    </div>
                    {contractor.actualAddress && contractor.actualAddress !== contractor.legalAddress && (
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Фактический адрес</p>
                        <p className="text-sm text-[var(--text-primary)]">{contractor.actualAddress}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Телефон</p>
                      <a href={`tel:${contractor.phone}`} className="text-sm text-[var(--accent-blue)] hover:underline">{contractor.phone}</a>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Email</p>
                      <a href={`mailto:${contractor.email}`} className="text-sm text-[var(--accent-blue)] hover:underline">{contractor.email}</a>
                    </div>
                    {contractor.website && (
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Сайт</p>
                        <a href={`https://${contractor.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent-blue)] hover:underline">{contractor.website}</a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Контактные лица</p>
                    {contractor.contacts.map((contact) => (
                      <div key={contact.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{contact.name}</p>
                          {contact.isMain && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500">Основной</span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{contact.position}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <a href={`tel:${contact.phone}`} className="text-xs text-[var(--accent-blue)]">{contact.phone}</a>
                          <a href={`mailto:${contact.email}`} className="text-xs text-[var(--accent-blue)]">{contact.email}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              {contractor.bankDetails && (
                <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Банковские реквизиты</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Банк</p>
                        <p className="text-sm text-[var(--text-primary)]">{contractor.bankDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">БИК</p>
                        <p className="text-sm text-[var(--text-primary)]">{contractor.bankDetails.bik}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Расчётный счёт</p>
                        <p className="text-sm text-[var(--text-primary)] font-mono">{contractor.bankDetails.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Корр. счёт</p>
                        <p className="text-sm text-[var(--text-primary)] font-mono">{contractor.bankDetails.correspondentAccount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reputation Notes */}
              {contractor.reputationNotes && (
                <div 
                  className="rounded-xl p-6" 
                  style={{ 
                    background: `${repConfig.color}08`, 
                    border: `1px solid ${repConfig.color}20` 
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{repConfig.icon}</span>
                    <h3 className="text-lg font-semibold" style={{ color: repConfig.color }}>
                      Репутация: {repConfig.label}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{contractor.reputationNotes}</p>
                  {contractor.averagePaymentDelay > 0 && (
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                      Средняя задержка оплаты: {contractor.averagePaymentDelay} дней
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* Active Projects */}
              {activeProjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
                    Активные объекты ({activeProjects.length})
                  </h3>
                  <div className="space-y-3">
                    {activeProjects.map((project) => {
                      const projTypeConfig = projectTypeConfig[project.type];
                      const projStatusConfig = projectStatusConfig[project.status];
                      return (
                        <Link
                          key={project.id}
                          href={`/dashboard/contractors/projects/${project.id}`}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ background: `${projTypeConfig.color}15` }}
                            >
                              {projTypeConfig.icon}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">{project.name}</p>
                              <p className="text-sm text-[var(--text-muted)]">{projTypeConfig.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className={`font-semibold ${project.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                                {project.profit >= 0 ? '+' : ''}{(project.profit / 1000).toFixed(0)}к ₽
                              </p>
                              <p className="text-xs text-[var(--text-muted)]">прибыль</p>
                            </div>
                            <span 
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ background: projStatusConfig.bgColor, color: projStatusConfig.color }}
                            >
                              {projStatusConfig.label}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Projects */}
              {completedProjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3 mt-6">
                    Завершённые объекты ({completedProjects.length})
                  </h3>
                  <div className="space-y-3">
                    {completedProjects.map((project) => {
                      const projTypeConfig = projectTypeConfig[project.type];
                      return (
                        <Link
                          key={project.id}
                          href={`/dashboard/contractors/projects/${project.id}`}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all opacity-75"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                              style={{ background: `${projTypeConfig.color}15` }}
                            >
                              {projTypeConfig.icon}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">{project.name}</p>
                              <p className="text-sm text-[var(--text-muted)]">
                                Завершён {project.actualEndDate ? new Date(project.actualEndDate).toLocaleDateString('ru-RU') : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${project.profit >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                              {project.profit >= 0 ? '+' : ''}{(project.profit / 1000000).toFixed(2)}M ₽
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">маржа {project.profitMargin.toFixed(1)}%</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[var(--text-muted)] mb-4">Нет объектов с этим контрагентом</p>
                  <button className="btn btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Создать объект
                  </button>
                </div>
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
              {/* Собираем все документы из проектов */}
              <div className="space-y-3">
                {projects.flatMap(p => p.documents.map(d => ({ ...d, projectName: p.name }))).slice(0, 10).map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer"
                    style={{ border: '1px solid var(--border-secondary)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{doc.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {doc.projectName} • {new Date(doc.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    {doc.amount && (
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {(doc.amount / 1000000).toFixed(2)}M ₽
                      </span>
                    )}
                  </div>
                ))}
                {projects.flatMap(p => p.documents).length === 0 && (
                  <p className="text-sm text-[var(--text-muted)] text-center py-8">Нет документов</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="rounded-xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">История взаимодействий</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm">💰</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Получен платёж 890 000 ₽</p>
                    <p className="text-xs text-[var(--text-muted)]">ЖК «Солнечный» • 10 января 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">📄</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Подписан акт выполненных работ</p>
                    <p className="text-xs text-[var(--text-muted)]">ЖК «Солнечный» • 8 января 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm">🏗️</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Создан новый объект «ЖК Центральный»</p>
                    <p className="text-xs text-[var(--text-muted)]">1 декабря 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-500/10 text-gray-500 flex items-center justify-center text-sm">🤝</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Контрагент добавлен в систему</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(contractor.createdAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Реквизиты</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">ИНН</span>
                <span className="text-sm font-mono text-[var(--text-primary)]">{contractor.inn}</span>
              </div>
              {contractor.kpp && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">КПП</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{contractor.kpp}</span>
                </div>
              )}
              {contractor.ogrn && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">ОГРН</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{contractor.ogrn}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Discipline */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Платёжная дисциплина</h4>
            <div className="flex items-center gap-3 mb-3">
              <span 
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
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
                {contractor.paymentDiscipline === 'excellent' ? '⭐ Отличная' : 
                 contractor.paymentDiscipline === 'good' ? '✅ Хорошая' : 
                 contractor.paymentDiscipline === 'average' ? '⚠️ Средняя' : 
                 '❌ Плохая'}
              </span>
            </div>
            {contractor.averagePaymentDelay > 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                Средняя задержка: <span className="text-[var(--text-primary)]">{contractor.averagePaymentDelay} дней</span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Статистика</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">В системе с</span>
                <span className="text-sm text-[var(--text-primary)]">
                  {new Date(contractor.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Последняя активность</span>
                <span className="text-sm text-[var(--text-primary)]">
                  {contractor.lastActivityAt ? new Date(contractor.lastActivityAt).toLocaleDateString('ru-RU') : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Всего объектов</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{contractor.totalProjects}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
            <h4 className="text-sm font-medium text-[var(--text-muted)] mb-3">Быстрые действия</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                📧 Отправить письмо
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                📞 Позвонить
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                📄 Создать договор
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                📊 Выгрузить отчёт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
