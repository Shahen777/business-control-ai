"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  mockOperationsDashboard,
  mockOperationEvents,
} from "@/lib/mockOperations";
import { operationEventTypeConfig } from "@/types/operations";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Tabs } from "@/components/design-system/Tabs";

const formatMoney = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1000000) return `${(amount / 1000000).toFixed(1)} млн ₽`;
  if (abs >= 1000) return `${(amount / 1000).toFixed(0)}к ₽`;
  return `${amount} ₽`;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const dashboard = mockOperationsDashboard;
  
  // Статистика по типам событий
  const eventStats = useMemo(() => {
    const stats: Record<string, number> = {};
    mockOperationEvents.forEach(event => {
      const category = event.type.split('_')[0];
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }, []);
  
  // Финансовое влияние по категориям
  const financialByCategory = useMemo(() => {
    const result: Record<string, number> = {
      equipment: 0,
      employee: 0,
      project: 0,
      task: 0,
      payment: 0,
    };
    
    mockOperationEvents.forEach(event => {
      if (event.financialImpact) {
        const category = event.type.split('_')[0];
        if (result[category] !== undefined) {
          result[category] += event.financialImpact;
        }
      }
    });
    
    return result;
  }, []);
  
  // Метрики эффективности
  const metrics = useMemo(() => {
    const resolvedEvents = mockOperationEvents.filter(e => e.status === 'resolved').length;
    const totalEvents = mockOperationEvents.length;
    const criticalResolved = mockOperationEvents.filter(e => e.priority === 'critical' && e.status === 'resolved').length;
    const criticalTotal = mockOperationEvents.filter(e => e.priority === 'critical').length;
    
    return {
      resolutionRate: Math.round((resolvedEvents / totalEvents) * 100),
      criticalResolutionRate: criticalTotal > 0 ? Math.round((criticalResolved / criticalTotal) * 100) : 100,
      avgUtilization: dashboard.avgUtilization,
      employeeEfficiency: Math.round((dashboard.workingEmployees / dashboard.totalEmployees) * 100),
    };
  }, [dashboard]);
  
  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
  ];
  
  // Данные для графика загрузки (mock)
  const utilizationData = [
    { day: 'Пн', value: 78 },
    { day: 'Вт', value: 82 },
    { day: 'Ср', value: 75 },
    { day: 'Чт', value: 88 },
    { day: 'Пт', value: 72 },
    { day: 'Сб', value: 45 },
    { day: 'Вс', value: 30 },
  ];
  
  const maxUtil = Math.max(...utilizationData.map(d => d.value));
  
  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center gap-2 text-[13px] text-zinc-400">
          <Link href="/dashboard/operations" className="hover:text-white">
            Операции
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Аналитика</span>
        </div>
        <PageHeader
          title="Аналитика операций"
          subtitle="Сводные показатели эффективности операций"
          actions={
            <Tabs
              value={period}
              onChange={(val) => setPeriod(val as 'week' | 'month' | 'year')}
              items={periods.map(p => ({ value: p.id, label: p.label }))}
            />
          }
        />

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Выручка</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">{formatMoney(dashboard.monthRevenue)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Расходы</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{formatMoney(dashboard.monthExpenses)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Прибыль</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">
            {formatMoney(dashboard.monthRevenue - dashboard.monthExpenses)}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            маржа {Math.round(((dashboard.monthRevenue - dashboard.monthExpenses) / dashboard.monthRevenue) * 100)}%
          </p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Потери от простоя</p>
          <p className="text-2xl font-semibold text-[var(--accent-red)]">
            -{formatMoney(dashboard.idleLossesPerDay * (period === 'week' ? 7 : period === 'month' ? 30 : 365))}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">за {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}</p>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Показатели эффективности</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Загрузка техники</span>
                <span className={`font-medium ${metrics.avgUtilization >= 70 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}`}>
                  {metrics.avgUtilization}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${metrics.avgUtilization}%`,
                    background: metrics.avgUtilization >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Занятость сотрудников</span>
                <span className={`font-medium ${metrics.employeeEfficiency >= 70 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}`}>
                  {metrics.employeeEfficiency}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${metrics.employeeEfficiency}%`,
                    background: metrics.employeeEfficiency >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Решение событий</span>
                <span className={`font-medium ${metrics.resolutionRate >= 80 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}`}>
                  {metrics.resolutionRate}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${metrics.resolutionRate}%`,
                    background: metrics.resolutionRate >= 80 ? 'var(--accent-green)' : 'var(--accent-amber)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Критические события</span>
                <span className={`font-medium ${metrics.criticalResolutionRate >= 90 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                  {metrics.criticalResolutionRate}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${metrics.criticalResolutionRate}%`,
                    background: metrics.criticalResolutionRate >= 90 ? 'var(--accent-green)' : 'var(--accent-red)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Utilization Chart */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Загрузка по дням недели</h3>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {utilizationData.map(data => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: `${(data.value / maxUtil) * 100}%`, minHeight: '8px' }}>
                  <div 
                    className="w-full h-full rounded-t-md transition-all"
                    style={{ 
                      background: data.value >= 70 ? 'var(--accent-green)' : 
                                  data.value >= 50 ? 'var(--accent-blue)' : 'var(--accent-amber)'
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)]">{data.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: 'var(--accent-green)' }} />
              <span className="text-[var(--text-muted)]">≥70%</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: 'var(--accent-blue)' }} />
              <span className="text-[var(--text-muted)]">50-70%</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: 'var(--accent-amber)' }} />
              <span className="text-[var(--text-muted)]">&lt;50%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Events by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Distribution */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Распределение событий</h3>
          
          <div className="space-y-3">
            {Object.entries(eventStats).map(([category, count]) => {
              const total = Object.values(eventStats).reduce((a, b) => a + b, 0);
              const percent = Math.round((count / total) * 100);
              
              const categoryLabels: Record<string, string> = {
                equipment: 'Техника',
                employee: 'Сотрудники',
                project: 'Объекты',
                task: 'Задачи',
                payment: 'Платежи',
                risk: 'Риски',
                shift: 'Смены',
              };
              
              const categoryColors: Record<string, string> = {
                equipment: 'var(--accent-blue)',
                employee: 'var(--accent-purple)',
                project: 'var(--accent-green)',
                task: 'var(--accent-amber)',
                payment: 'var(--accent-green)',
                risk: 'var(--accent-red)',
                shift: 'var(--text-muted)',
              };
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--text-muted)]">{categoryLabels[category] || category}</span>
                    <span className="text-[var(--text-primary)]">{count} ({percent}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${percent}%`,
                        background: categoryColors[category] || 'var(--text-muted)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Impact by Category */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">Финансовое влияние</h3>
          
          <div className="space-y-3">
            {Object.entries(financialByCategory)
              .filter(([, value]) => value !== 0)
              .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
              .map(([category, value]) => {
                const categoryLabels: Record<string, string> = {
                  equipment: 'Техника',
                  employee: 'Сотрудники',
                  project: 'Объекты',
                  task: 'Задачи',
                  payment: 'Платежи',
                };
                
                return (
                  <div key={category} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                    <span className="text-sm text-[var(--text-muted)]">{categoryLabels[category]}</span>
                    <span className={`text-sm font-medium ${value >= 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
                      {value >= 0 ? '+' : ''}{formatMoney(value)}
                    </span>
                  </div>
                );
              })}
          </div>
          
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">Итого</span>
              <span className={`text-lg font-semibold ${
                Object.values(financialByCategory).reduce((a, b) => a + b, 0) >= 0 
                  ? 'text-[var(--accent-green)]' 
                  : 'text-[var(--accent-red)]'
              }`}>
                {Object.values(financialByCategory).reduce((a, b) => a + b, 0) >= 0 ? '+' : ''}
                {formatMoney(Object.values(financialByCategory).reduce((a, b) => a + b, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
