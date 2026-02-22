"use client";

import { useState, useEffect } from "react";
import { getAllLegalDocs } from "@/lib/mockLegal";
import { LegalDocument, LegalDocType, legalDocTypeConfig } from "@/types/legal";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [filter, setFilter] = useState<'all' | LegalDocType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  useEffect(() => {
    setDocuments(getAllLegalDocs());
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.type === filter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const docTypes = Object.keys(legalDocTypeConfig) as LegalDocType[];
  const typeCounts: Record<LegalDocType, number> = {} as any;
  docTypes.forEach(type => {
    typeCounts[type] = documents.filter(d => d.type === type).length;
  });

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Юридические документы"
          subtitle="Генерация и управление документами"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать документ
            </Button>
          }
        />

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Всего</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{documents.length}</p>
        </div>
        {docTypes.slice(0, 5).map(type => {
          const config = legalDocTypeConfig[type];
          return (
            <div key={type} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
                {config.icon} {config.label}
              </p>
              <p className="text-xl font-semibold text-[var(--text-primary)]">{typeCounts[type]}</p>
            </div>
          );
        })}
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
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === 'all' ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: filter === 'all' ? 'white' : 'var(--text-primary)',
                border: `1px solid ${filter === 'all' ? 'var(--accent-blue)' : 'var(--border-secondary)'}`,
              }}
            >
              Все
            </button>
            {docTypes.map((type) => {
              const config = legalDocTypeConfig[type];
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: filter === type ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                    color: filter === type ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${filter === type ? 'var(--accent-blue)' : 'var(--border-secondary)'}`,
                  }}
                >
                  {config.icon} {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Document List */}
        <div className="space-y-3">
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[var(--text-muted)]">Документы не найдены</p>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const config = legalDocTypeConfig[doc.type];
              const isSelected = selectedDoc?.id === doc.id;
              
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                  style={{ 
                    background: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', 
                    border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-secondary)'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{config.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--text-primary)] mb-1 truncate">{doc.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>{config.label}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Document Preview */}
        <div className="rounded-xl p-6 h-fit sticky top-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          {selectedDoc ? (
            <>
              <div className="flex items-start justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{legalDocTypeConfig[selectedDoc.type].icon}</span>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">{selectedDoc.title}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {legalDocTypeConfig[selectedDoc.type].label} • {new Date(selectedDoc.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm btn-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button className="btn btn-sm btn-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="rounded-lg p-6 font-mono text-xs whitespace-pre-wrap max-h-[600px] overflow-y-auto"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
                {selectedDoc.content}
              </div>

              {/* Variables */}
              {selectedDoc.variables && Object.keys(selectedDoc.variables).length > 0 && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Переменные</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedDoc.variables).map(([key, value]) => (
                      <div key={key} className="p-2 rounded text-xs" style={{ background: 'var(--bg-tertiary)' }}>
                        <p className="text-[var(--text-muted)] mb-1">{key}</p>
                        <p className="text-[var(--text-primary)] font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[var(--text-muted)]">Выберите документ для просмотра</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
