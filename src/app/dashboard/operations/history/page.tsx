"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  mockOperationEvents,
  getEventsByPeriod,
  groupEventsByDate,
  getEventsStats,
} from "@/lib/mockOperations";
import {
  operationEventTypeConfig,
  eventPriorityConfig,
  eventStatusConfig,
} from "@/types/operations";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'all';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Сегодня';
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
  
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const formatMoney = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1000000) return `${(amount / 1000000).toFixed(1)} млн ₽`;
  if (abs >= 1000) return `${(amount / 1000).toFixed(0)}к ₽`;
  return `${amount} ₽`;
};

export default function OperationsHistoryPage() {
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredEvents = useMemo(() => {
    let events = getEventsByPeriod(period);
    
    if (priorityFilter !== 'all') {
      events = events.filter(e => e.priority === priorityFilter);
    }
    
    if (statusFilter !== 'all') {
      events = events.filter(e => e.status === statusFilter);
    }
    
    return events;
  }, [period, priorityFilter, statusFilter]);
  
  const groupedEvents = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));
  const stats = useMemo(() => getEventsStats(filteredEvents), [filteredEvents]);
  
  const periods: { id: PeriodFilter; label: string }[] = [
    { id: 'today', label: 'Сегодня' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
    { id: 'all', label: 'Всё время' },
  ];
  
  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center gap-2 text-[13px] text-zinc-400">
          <Link href="/dashboard/operations" className="hover:text-white">
            Операции
          </Link>
          <span>/</span>
          <span className="text-zinc-300">История событий</span>
        </div>
        <PageHeader
          title="История операций"
          subtitle="Полная история событий за все время работы"
        />

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Всего событий</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Решено</p>
          <p className="text-xl font-semibold text-[var(--accent-green)]">{stats.resolved}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">В работе</p>
          <p className="text-xl font-semibold text-[var(--accent-blue)]">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Ожидает</p>
          <p className="text-xl font-semibold text-[var(--accent-amber)]">{stats.pending}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Критических</p>
          <p className="text-xl font-semibold text-[var(--accent-red)]">{stats.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Period */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background: period === p.id ? 'var(--bg-secondary)' : 'transparent',
                color: period === p.id ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        
        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none' }}
        >
          <option value="all">Все приоритеты</option>
          <option value="critical">Критический</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
        
        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none' }}
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="in_progress">В работе</option>
          <option value="resolved">Решено</option>
          <option value="ignored">Игнорировано</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-6 text-xs text-[var(--text-muted)]">
        <span>Найдено: <strong className="text-[var(--text-primary)]">{filteredEvents.length}</strong> событий</span>
        {stats.totalImpact !== 0 && (
          <span>
            Финансовое влияние: <strong className={stats.totalImpact > 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
              {stats.totalImpact > 0 ? '+' : ''}{formatMoney(stats.totalImpact)}
            </strong>
          </span>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Нет событий за выбранный период</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {formatDate(date)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {groupedEvents[date].length} событий
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-secondary)' }} />
              </div>
              <div className="space-y-2">
                {groupedEvents[date].map(event => {
                  const config = operationEventTypeConfig[event.type];
                  const priorityConf = eventPriorityConfig[event.priority];
                  const statusConf = eventStatusConfig[event.status];
                  
                  return (
                    <div 
                      key={event.id}
                      className="p-4 rounded-xl transition-all hover:tranzinc-y-[-1px]"
                      style={{ 
                        background: 'var(--bg-secondary)', 
                        border: `1px solid ${event.priority === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-secondary)'}` 
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: `${config.color}15` }}
                        >
                          {config.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-medium text-[var(--text-primary)]">{event.title}</p>
                            <span className="text-xs text-[var(--text-muted)]">{formatTime(event.timestamp)}</span>
                          </div>
                          
                          <p className="text-xs text-[var(--text-muted)] mb-2">{event.description}</p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {event.priority !== 'low' && (
                              <span 
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ background: priorityConf.bgColor, color: priorityConf.color }}
                              >
                                {priorityConf.label}
                              </span>
                            )}
                            <span className="text-xs" style={{ color: statusConf.color }}>
                              • {statusConf.label}
                            </span>
                            {event.projectName && (
                              <Link 
                                href={`/dashboard/contractors/projects/${event.projectId}`}
                                className="text-xs text-[var(--accent-blue)] hover:underline"
                              >
                                📍 {event.projectName}
                              </Link>
                            )}
                            {event.financialImpact && (
                              <span className={`text-xs font-medium ${event.financialImpact > 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                                {event.financialImpact > 0 ? '+' : ''}{formatMoney(event.financialImpact)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </PageLayout>
  );
}
