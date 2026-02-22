"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  mockShifts,
  mockDailyAssignments,
} from "@/lib/mockOperations";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

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
    weekday: 'short'
  });
};

export default function ShiftsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Генерируем даты для календаря (7 дней)
  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push(date.toISOString().split('T')[0]);
    }
    return result;
  }, []);
  
  // Группируем смены по дате
  const shiftsByDate = useMemo(() => {
    const result: Record<string, typeof mockShifts> = {};
    mockShifts.forEach(shift => {
      if (!result[shift.date]) result[shift.date] = [];
      result[shift.date].push(shift);
    });
    return result;
  }, []);
  
  // Задания для выбранной даты
  const selectedDateAssignments = useMemo(() => {
    if (!selectedDate) return mockDailyAssignments;
    return mockDailyAssignments.filter(a => a.date === selectedDate);
  }, [selectedDate]);
  
  const statusColors = {
    scheduled: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'Запланирована' },
    active: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'Активна' },
    completed: { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)', label: 'Завершена' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--accent-red)', label: 'Отменена' },
  };
  
  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center gap-2 text-[13px] text-zinc-400">
          <Link href="/dashboard/operations" className="hover:text-white">
            Операции
          </Link>
          <span>/</span>
          <span className="text-zinc-300">Смены</span>
        </div>
        <PageHeader
          title="Смены и задания"
          subtitle="Управление сменами и дневными заданиями"
        />

      {/* Date Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedDate(null)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
          style={{
            background: !selectedDate ? 'var(--bg-tertiary)' : 'transparent',
            color: !selectedDate ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          Все дни
        </button>
        {dates.map(date => {
          const shiftsCount = shiftsByDate[date]?.length || 0;
          const isSelected = selectedDate === date;
          
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2"
              style={{
                background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {formatDate(date)}
              {shiftsCount > 0 && (
                <span 
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{ 
                    background: isSelected ? 'var(--accent-blue)' : 'rgba(59, 130, 246, 0.2)',
                    color: isSelected ? '#fff' : 'var(--accent-blue)'
                  }}
                >
                  {shiftsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Всего смен</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{mockShifts.length}</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Активных</p>
          <p className="text-xl font-semibold text-[var(--accent-green)]">
            {mockShifts.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Сотрудников</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">
            {mockShifts.reduce((sum, s) => sum + s.employees.length, 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] mb-1">Техники</p>
          <p className="text-xl font-semibold text-[var(--text-primary)]">
            {mockShifts.reduce((sum, s) => sum + s.equipment.length, 0)}
          </p>
        </div>
      </div>

      {/* Shifts List */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">Смены</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockShifts
            .filter(shift => !selectedDate || shift.date === selectedDate)
            .map(shift => {
              const statusStyle = statusColors[shift.status];
              const completion = shift.actualHours && shift.plannedHours 
                ? Math.round((shift.actualHours / shift.plannedHours) * 100) 
                : 0;
              
              return (
                <div 
                  key={shift.id}
                  className="p-4 rounded-xl"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{shift.projectName}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {shift.type === 'day' ? 'Дневная' : 'Ночная'} смена • {formatDate(shift.date)}
                      </p>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ background: statusStyle.bg, color: statusStyle.text }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Сотрудники</p>
                      <div className="space-y-1">
                        {shift.employees.slice(0, 3).map(emp => (
                          <p key={emp.employeeId} className="text-xs text-[var(--text-primary)]">
                            {emp.status === 'started' ? '🟢' : emp.status === 'completed' ? '✅' : '⚪'} {emp.employeeName}
                          </p>
                        ))}
                        {shift.employees.length > 3 && (
                          <p className="text-xs text-[var(--text-muted)]">+{shift.employees.length - 3} ещё</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Техника</p>
                      <div className="space-y-1">
                        {shift.equipment.map(eq => (
                          <p key={eq.equipmentId} className="text-xs text-[var(--text-primary)]">
                            {eq.status === 'working' ? '🟢' : eq.status === 'idle' ? '🟡' : '⚪'} {eq.equipmentName.split(' ')[0]}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {(shift.status === 'active' || shift.status === 'completed') && (
                    <div className="pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[var(--text-muted)]">Выполнение</span>
                        <span className={completion >= 100 ? 'text-[var(--accent-green)]' : completion >= 80 ? 'text-[var(--text-primary)]' : 'text-[var(--accent-amber)]'}>
                          {completion}%
                        </span>
                      </div>
                      <div className="progress-bar mb-2">
                        <div 
                          className="progress-bar-fill"
                          style={{ 
                            width: `${Math.min(completion, 100)}%`,
                            background: completion >= 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
                          }}
                        />
                      </div>
                      {shift.actualOutput && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Результат: {shift.actualOutput}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Daily Assignments */}
      <div>
        <h2 className="text-lg font-medium text-[var(--text-primary)] mb-4">Задания</h2>
        <div className="space-y-3">
          {selectedDateAssignments.map(assignment => {
            const taskStatusColors = {
              pending: { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)', label: 'Ожидает' },
              in_progress: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'В работе' },
              completed: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'Выполнено' },
              blocked: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--accent-red)', label: 'Заблокировано' },
            };
            const statusStyle = taskStatusColors[assignment.status];
            const progress = assignment.actualHours 
              ? Math.round((assignment.actualHours / assignment.plannedHours) * 100) 
              : 0;
            
            return (
              <div 
                key={assignment.id}
                className="p-4 rounded-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-1">{assignment.task}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span>📍 {assignment.projectName}</span>
                      <span>👤 {assignment.employeeName}</span>
                      {assignment.equipmentName && <span>🚜 {assignment.equipmentName}</span>}
                    </div>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    style={{ background: statusStyle.bg, color: statusStyle.text }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[var(--text-muted)]">Прогресс</span>
                  <span className="text-[var(--text-primary)]">
                    {assignment.actualHours || 0} / {assignment.plannedHours} ч ({progress}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      background: assignment.status === 'completed' ? 'var(--accent-green)' : 
                                  assignment.status === 'blocked' ? 'var(--accent-red)' : 'var(--accent-blue)'
                    }}
                  />
                </div>
                
                {assignment.blockedReason && (
                  <p className="mt-3 text-xs text-[var(--accent-red)]">
                    🚫 {assignment.blockedReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
