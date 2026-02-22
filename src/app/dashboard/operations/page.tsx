"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";
import {
  OperationEvent,
  operationEventTypeConfig,
  eventPriorityConfig,
  eventStatusConfig,
  projectOperationStatusConfig,
} from "@/types/operations";
import {
  mockOperationEvents,
  mockOperationsDashboard,
  mockEquipmentUtilization,
  mockEmployeeWorkload,
  mockProjectOperationStatus,
  mockShifts,
  mockDailyAssignments,
  getEventsByPeriod,
  groupEventsByDate,
  getEventsStats,
} from "@/lib/mockOperations";

// ============================================
// ТИПЫ
// ============================================

type ViewTab = 'timeline' | 'equipment' | 'employees' | 'projects' | 'shifts';
type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'all';
type EventTypeFilter = 'all' | 'equipment' | 'employees' | 'projects' | 'tasks' | 'payments' | 'risks';

// ============================================
// ХЕЛПЕРЫ
// ============================================

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
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
  if (abs >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} млн ₽`;
  }
  if (abs >= 1000) {
    return `${(amount / 1000).toFixed(0)}к ₽`;
  }
  return `${amount} ₽`;
};

const getEventTypesByFilter = (filter: EventTypeFilter): OperationEvent['type'][] => {
  switch (filter) {
    case 'equipment':
      return ['equipment_assigned', 'equipment_unassigned', 'equipment_idle', 'equipment_breakdown', 'equipment_maintenance'];
    case 'employees':
      return ['employee_assigned', 'employee_absent', 'shift_started', 'shift_ended'];
    case 'projects':
      return ['project_started', 'project_paused', 'project_completed'];
    case 'tasks':
      return ['task_created', 'task_completed', 'task_overdue'];
    case 'payments':
      return ['payment_received', 'payment_overdue'];
    case 'risks':
      return ['risk_detected'];
    default:
      return [];
  }
};

// ============================================
// КОМПОНЕНТЫ
// ============================================

// KPI-карточка
function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend,
  color = 'var(--text-primary)',
  onClick 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  trend?: { value: number; positive: boolean };
  color?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`p-5 rounded-xl transition-all ${onClick ? 'cursor-pointer hover:tranzinc-y-[-2px]' : ''}`}
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      onClick={onClick}
    >
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">{title}</p>
      <p className="text-2xl font-semibold" style={{ color }}>{value}</p>
      {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
      {trend && (
        <p className={`text-xs mt-1 ${trend.positive ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% за период
        </p>
      )}
    </div>
  );
}

// Событие в ленте
function EventItem({ event }: { event: OperationEvent }) {
  const config = operationEventTypeConfig[event.type];
  const priorityConfig = eventPriorityConfig[event.priority];
  const statusConf = eventStatusConfig[event.status];
  
  return (
    <div 
      className="p-4 rounded-xl transition-all hover:tranzinc-y-[-1px]"
      style={{ 
        background: 'var(--bg-secondary)', 
        border: `1px solid ${event.priority === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-secondary)'}` 
      }}
    >
      <div className="flex items-start gap-3">
        {/* Иконка */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${config.color}15` }}
        >
          {config.icon}
        </div>
        
        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{event.title}</p>
            <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{formatTime(event.timestamp)}</span>
          </div>
          
          <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-2">{event.description}</p>
          
          {/* Метаданные */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Приоритет */}
            {event.priority !== 'low' && (
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: priorityConfig.bgColor, color: priorityConfig.color }}
              >
                {priorityConfig.label}
              </span>
            )}
            
            {/* Статус */}
            <span className="text-xs" style={{ color: statusConf.color }}>
              • {statusConf.label}
            </span>
            
            {/* Связи */}
            {event.projectName && (
              <Link 
                href={`/dashboard/contractors/projects/${event.projectId}`}
                className="text-xs text-[var(--accent-blue)] hover:underline"
              >
                📍 {event.projectName}
              </Link>
            )}
            
            {event.equipmentName && (
              <Link 
                href={`/dashboard/assets/equipment/${event.equipmentId}`}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                🚜 {event.equipmentName}
              </Link>
            )}
            
            {event.employeeName && (
              <span className="text-xs text-[var(--text-muted)]">
                👤 {event.employeeName}
              </span>
            )}
            
            {/* Финансовое влияние */}
            {event.financialImpact && (
              <span 
                className={`text-xs font-medium ${event.financialImpact > 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}`}
              >
                {event.financialImpact > 0 ? '+' : ''}{formatMoney(event.financialImpact)}
              </span>
            )}
          </div>
          
          {/* Рекомендуемое действие */}
          {event.suggestedAction && event.status === 'pending' && (
            <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
              <p className="text-xs text-[var(--accent-blue)]">
                💡 {event.suggestedAction}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Карточка техники
function EquipmentCard({ util }: { util: typeof mockEquipmentUtilization[0] }) {
  const statusColors = {
    working: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'Работает' },
    idle: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--accent-amber)', label: 'Простой' },
    maintenance: { bg: 'rgba(100, 116, 139, 0.1)', text: 'var(--text-muted)', label: 'ТО' },
    transit: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'В пути' },
  };
  const statusStyle = statusColors[util.status];
  
  return (
    <Link href={`/dashboard/assets/equipment/${util.equipmentId}`}>
      <div 
        className="p-4 rounded-xl transition-all hover:tranzinc-y-[-2px] cursor-pointer"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{util.equipmentName}</p>
            <p className="text-xs text-[var(--text-muted)]">{util.projectName}</p>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {statusStyle.label}
          </span>
        </div>
        
        {util.status === 'working' && (
          <>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[var(--text-muted)]">Загрузка</span>
              <span className="text-[var(--text-primary)] font-medium">{util.utilizationPercent}%</span>
            </div>
            <div className="progress-bar mb-3">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${util.utilizationPercent}%`,
                  background: util.utilizationPercent > 70 ? 'var(--accent-green)' : 'var(--accent-amber)'
                }}
              />
            </div>
          </>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[var(--text-muted)]">Сегодня</span>
            <p className="text-[var(--text-primary)] font-medium">{util.hoursToday} ч</p>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">За месяц</span>
            <p className="text-[var(--text-primary)] font-medium">{util.hoursThisMonth} ч</p>
          </div>
        </div>
        
        {util.operatorName && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <p className="text-xs text-[var(--text-muted)]">
              👤 {util.operatorName}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// Карточка сотрудника
function EmployeeCard({ workload }: { workload: typeof mockEmployeeWorkload[0] }) {
  const statusColors = {
    working: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'На смене' },
    absent: { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)', label: 'Отсутствует' },
    vacation: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'Отпуск' },
    sick: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--accent-amber)', label: 'Больничный' },
  };
  const statusStyle = statusColors[workload.status];
  
  return (
    <div 
      className="p-4 rounded-xl transition-all hover:tranzinc-y-[-1px]"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{workload.employeeName}</p>
          <p className="text-xs text-[var(--text-muted)]">{workload.position}</p>
        </div>
        <span 
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{ background: statusStyle.bg, color: statusStyle.text }}
        >
          {statusStyle.label}
        </span>
      </div>
      
      {workload.status === 'working' && (
        <>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <span className="text-[var(--text-muted)]">Отработано</span>
              <p className="text-[var(--text-primary)] font-medium">{workload.hoursWorked} ч</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Эффективность</span>
              <p className={`font-medium ${workload.performance >= 90 ? 'text-[var(--accent-green)]' : workload.performance >= 70 ? 'text-[var(--text-primary)]' : 'text-[var(--accent-amber)]'}`}>
                {workload.performance}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Задачи</span>
            <span className="text-[var(--text-primary)]">
              {workload.tasksCompleted}/{workload.tasksAssigned}
            </span>
          </div>
        </>
      )}
      
      {workload.projectName && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)]">
            📍 {workload.projectName}
          </p>
        </div>
      )}
    </div>
  );
}

// Карточка проекта
function ProjectCard({ project }: { project: typeof mockProjectOperationStatus[0] }) {
  const statusConf = projectOperationStatusConfig[project.status];
  
  return (
    <Link href={`/dashboard/contractors/projects/${project.projectId}`}>
      <div 
        className="p-4 rounded-xl transition-all hover:tranzinc-y-[-2px] cursor-pointer"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{project.projectName}</p>
            <p className="text-xs text-[var(--text-muted)]">{project.contractorName}</p>
          </div>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ background: statusConf.bgColor, color: statusConf.color }}
          >
            {statusConf.label}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[var(--text-muted)]">Прогресс</span>
          <span className="text-[var(--text-primary)] font-medium">{project.progress}%</span>
        </div>
        <div className="progress-bar mb-4">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${project.progress}%`,
              background: project.isDelayed ? 'var(--accent-amber)' : 'var(--accent-blue)'
            }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div className="text-center">
            <p className="text-[var(--text-primary)] font-medium">{project.equipmentCount}</p>
            <span className="text-[var(--text-muted)]">Техника</span>
          </div>
          <div className="text-center">
            <p className="text-[var(--text-primary)] font-medium">{project.employeeCount}</p>
            <span className="text-[var(--text-muted)]">Люди</span>
          </div>
          <div className="text-center">
            <p className="text-[var(--text-primary)] font-medium">{project.daysRemaining}</p>
            <span className="text-[var(--text-muted)]">Дней</span>
          </div>
        </div>
        
        {project.activeRisks > 0 && (
          <div className="pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <p className={`text-xs ${project.criticalRisks > 0 ? 'text-[var(--accent-red)]' : 'text-[var(--accent-amber)]'}`}>
              ⚠️ {project.activeRisks} {project.activeRisks === 1 ? 'риск' : 'рисков'}
              {project.criticalRisks > 0 && ` (${project.criticalRisks} критич.)`}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// Карточка смены
function ShiftCard({ shift }: { shift: typeof mockShifts[0] }) {
  const statusColors = {
    scheduled: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'Запланирована' },
    active: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'Активна' },
    completed: { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)', label: 'Завершена' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--accent-red)', label: 'Отменена' },
  };
  const statusStyle = statusColors[shift.status];
  
  const completion = shift.actualHours && shift.plannedHours 
    ? Math.round((shift.actualHours / shift.plannedHours) * 100) 
    : 0;
  
  return (
    <div 
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
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Выполнение</span>
            <span className={completion >= 100 ? 'text-[var(--accent-green)]' : completion >= 80 ? 'text-[var(--text-primary)]' : 'text-[var(--accent-amber)]'}>
              {completion}%
            </span>
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
}

// ============================================
// ГЛАВНАЯ СТРАНИЦА
// ============================================

export default function OperationsPage() {
  // Состояние
  const [activeTab, setActiveTab] = useState<ViewTab>('timeline');
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [eventFilter, setEventFilter] = useState<EventTypeFilter>('all');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  
  const dashboard = mockOperationsDashboard;
  
  // Фильтрация событий
  const filteredEvents = useMemo(() => {
    let events = getEventsByPeriod(period);
    
    // Фильтр по типу
    if (eventFilter !== 'all') {
      const types = getEventTypesByFilter(eventFilter);
      events = events.filter(e => types.includes(e.type));
    }
    
    // Только ожидающие
    if (showOnlyPending) {
      events = events.filter(e => e.status === 'pending' || e.status === 'in_progress');
    }
    
    return events;
  }, [period, eventFilter, showOnlyPending]);
  
  // Группировка по датам
  const groupedEvents = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));
  
  // Статистика
  const stats = useMemo(() => getEventsStats(filteredEvents), [filteredEvents]);
  
  // Табы
  const tabs: { id: ViewTab; label: string; count?: number }[] = [
    { id: 'timeline', label: 'Лента', count: stats.pending },
    { id: 'equipment', label: 'Техника', count: dashboard.idleEquipment },
    { id: 'employees', label: 'Сотрудники', count: dashboard.absentEmployees },
    { id: 'projects', label: 'Объекты', count: dashboard.delayedProjects },
    { id: 'shifts', label: 'Смены' },
  ];
  
  // Периоды
  const periods: { id: PeriodFilter; label: string }[] = [
    { id: 'today', label: 'Сегодня' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
    { id: 'all', label: 'Всё время' },
  ];
  
  // Типы событий
  const eventTypes: { id: EventTypeFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'Все', icon: '📋' },
    { id: 'equipment', label: 'Техника', icon: '🚜' },
    { id: 'employees', label: 'Сотрудники', icon: '👤' },
    { id: 'projects', label: 'Объекты', icon: '🏗️' },
    { id: 'tasks', label: 'Задачи', icon: '✅' },
    { id: 'payments', label: 'Платежи', icon: '💰' },
    { id: 'risks', label: 'Риски', icon: '⚠️' },
  ];
  
  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Операции"
          subtitle="Единая лента событий: техника, сотрудники, объекты, финансы"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/dashboard/operations/analytics">
                <Button variant="secondary" size="sm">📊 Аналитика</Button>
              </Link>
              <Link href="/dashboard/operations/history">
                <Button variant="secondary" size="sm">📜 История</Button>
              </Link>
            </div>
          }
        />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <KPICard 
          title="Техника работает" 
          value={`${dashboard.workingEquipment}/${dashboard.totalEquipment}`}
          subtitle={`Загрузка ${dashboard.avgUtilization}%`}
        />
        <KPICard 
          title="Сотрудников на смене" 
          value={`${dashboard.workingEmployees}/${dashboard.totalEmployees}`}
          subtitle={`${dashboard.absentEmployees} отсутствует`}
          color={dashboard.absentEmployees > 0 ? 'var(--accent-amber)' : undefined}
        />
        <KPICard 
          title="Активных объектов" 
          value={dashboard.activeProjects}
          subtitle={`${dashboard.delayedProjects} с отставанием`}
          color={dashboard.delayedProjects > 0 ? 'var(--accent-amber)' : undefined}
        />
        <KPICard 
          title="Выручка сегодня" 
          value={formatMoney(dashboard.todayRevenue)}
          subtitle={`Расходы: ${formatMoney(dashboard.todayExpenses)}`}
          color="var(--accent-green)"
        />
        <KPICard 
          title="Требует внимания" 
          value={stats.pending}
          subtitle={`${stats.critical} критических`}
          color={stats.critical > 0 ? 'var(--accent-red)' : stats.pending > 0 ? 'var(--accent-amber)' : 'var(--accent-green)'}
        />
      </div>

      {/* Warning Banner */}
      {(dashboard.idleEquipment > 0 || stats.critical > 0) && (
        <div 
          className="mb-6 p-4 rounded-xl"
          style={{ 
            background: stats.critical > 0 ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)', 
            border: `1px solid ${stats.critical > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'}` 
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="status-dot flex-shrink-0 mt-1" 
              style={{ background: stats.critical > 0 ? 'var(--accent-red)' : 'var(--accent-amber)' }} 
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {stats.critical > 0 
                  ? `${stats.critical} критических событий требуют немедленного внимания`
                  : `${dashboard.idleEquipment} единиц техники простаивает`
                }
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {stats.critical > 0 
                  ? 'Просроченные платежи, поломки или задержки по срокам'
                  : `Потери от простоя: ${formatMoney(dashboard.idleLossesPerDay)}/день`
                }
              </p>
            </div>
            <Link href="/dashboard/decisions">
              <button className="btn btn-sm btn-primary">Решения ИИ</button>
            </Link>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span 
                className="px-1.5 py-0.5 rounded text-xs font-medium"
                style={{ 
                  background: activeTab === tab.id ? 'var(--accent-amber)' : 'rgba(245, 158, 11, 0.2)',
                  color: activeTab === tab.id ? '#fff' : 'var(--accent-amber)'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Period Filter */}
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
            
            {/* Event Type Filter */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {eventTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setEventFilter(type.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                  style={{
                    background: eventFilter === type.id ? 'var(--bg-tertiary)' : 'transparent',
                    color: eventFilter === type.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
            
            {/* Only Pending Toggle */}
            <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyPending}
                onChange={(e) => setShowOnlyPending(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Только ожидающие
            </label>
          </div>
          
          {/* Stats Summary */}
          <div className="flex items-center gap-4 mb-6 text-xs text-[var(--text-muted)]">
            <span>Найдено: <strong className="text-[var(--text-primary)]">{filteredEvents.length}</strong> событий</span>
            {stats.totalImpact !== 0 && (
              <span>
                Влияние: <strong className={stats.totalImpact > 0 ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
                  {stats.totalImpact > 0 ? '+' : ''}{formatMoney(stats.totalImpact)}
                </strong>
              </span>
            )}
          </div>
          
          {/* Timeline */}
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
                      {groupedEvents[date].length} {groupedEvents[date].length === 1 ? 'событие' : 'событий'}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'var(--border-secondary)' }} />
                  </div>
                  <div className="space-y-3">
                    {groupedEvents[date].map(event => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* EQUIPMENT TAB */}
      {activeTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEquipmentUtilization.map(util => (
            <EquipmentCard key={util.equipmentId} util={util} />
          ))}
        </div>
      )}

      {/* EMPLOYEES TAB */}
      {activeTab === 'employees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEmployeeWorkload.map(workload => (
            <EmployeeCard key={workload.employeeId} workload={workload} />
          ))}
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProjectOperationStatus.map(project => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      )}

      {/* SHIFTS TAB */}
      {activeTab === 'shifts' && (
        <>
          <div className="mb-4">
            <p className="text-sm text-[var(--text-muted)]">Смены за последние дни</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockShifts.map(shift => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          </div>
          
          {/* Daily Assignments */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Задания на сегодня</h3>
            <div className="space-y-3">
              {mockDailyAssignments.map(assignment => {
                const statusColors = {
                  pending: { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)', label: 'Ожидает' },
                  in_progress: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--accent-blue)', label: 'В работе' },
                  completed: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--accent-green)', label: 'Выполнено' },
                  blocked: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--accent-red)', label: 'Заблокировано' },
                };
                const statusStyle = statusColors[assignment.status];
                
                return (
                  <div 
                    key={assignment.id}
                    className="p-4 rounded-xl flex items-start gap-4"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{assignment.task}</p>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span>📍 {assignment.projectName}</span>
                        <span>👤 {assignment.employeeName}</span>
                        {assignment.equipmentName && <span>🚜 {assignment.equipmentName}</span>}
                        <span>{assignment.actualHours || 0}/{assignment.plannedHours} ч</span>
                      </div>
                      {assignment.blockedReason && (
                        <p className="mt-2 text-xs text-[var(--accent-red)]">
                          🚫 {assignment.blockedReason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      </div>
    </PageLayout>
  );
}