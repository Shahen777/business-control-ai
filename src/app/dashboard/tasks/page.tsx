"use client";

import { useState, useEffect } from "react";
import { 
  getAllTasks, 
  getTaskStats, 
  changeTaskStatus, 
  isOverdue, 
  isDueToday 
} from "@/lib/mockTasks";
import { Task, statusConfig, priorityConfig } from "@/types/tasks";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'in_progress'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTasks(getAllTasks());
    setIsLoaded(true);
  }, []);

  const stats = getTaskStats();

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    if (filter === 'today') return isDueToday(task) && task.status !== 'done';
    if (filter === 'overdue') return isOverdue(task);
    if (filter === 'in_progress') return task.status === 'in_progress';
    return true;
  });

  // Сортировка: просроченные первые, потом по приоритету
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (isOverdue(a) && !isOverdue(b)) return -1;
    if (!isOverdue(a) && isOverdue(b)) return 1;
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    changeTaskStatus(taskId, newStatus);
    setTasks(getAllTasks());
  };

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-[var(--bg-secondary)] rounded-lg" />
        <div className="h-24 bg-[var(--bg-secondary)] rounded-xl" />
        <div className="h-64 bg-[var(--bg-secondary)] rounded-xl" />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Задачи"
          subtitle="Управление задачами и контроль выполнения"
        />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">В работе</p>
          <p className="text-2xl font-semibold text-[var(--accent-blue)]">{stats.in_progress}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Просрочено</p>
          <p className="text-2xl font-semibold text-[var(--accent-red)]">{stats.overdue}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Выполнено</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">{stats.done}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { key: 'all', label: 'Все' },
          { key: 'today', label: 'На сегодня' },
          { key: 'overdue', label: 'Просроченные' },
          { key: 'in_progress', label: 'В работе' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as typeof filter)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filter === item.key ? 'var(--bg-tertiary)' : 'transparent',
              color: filter === item.key ? 'var(--text-primary)' : 'var(--text-muted)',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {sortedTasks.map((task) => {
          const taskIsOverdue = isOverdue(task);
          const taskIsDueToday = isDueToday(task);
          const priority = priorityConfig[task.priority];
          const status = statusConfig[task.status];

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all hover:tranzinc-y-[-1px] ${
                taskIsOverdue 
                  ? "bg-[var(--accent-red)]/5 border-[var(--accent-red)]/20" 
                  : ""
              }`}
              style={!taskIsOverdue ? { background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' } : undefined}
            >
              <div className="flex items-start gap-4">
                {/* Priority indicator */}
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                  style={{ backgroundColor: priority.color }}
                />
                
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {taskIsOverdue && (
                      <span className="badge-error text-xs">Просрочено</span>
                    )}
                    {taskIsDueToday && !taskIsOverdue && (
                      <span className="badge-warning text-xs">Сегодня</span>
                    )}
                    <span className={status.badge}>{status.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">{priority.label}</span>
                  </div>
                  
                  {/* Title & Description */}
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span>📅 {task.dueDate}</span>
                    <span>👤 {task.assigneeName}</span>
                    {task.project && <span>📁 {task.project}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.status === 'new' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20 transition-colors"
                    >
                      Взять в работу
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'done')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-green)]/10 text-[var(--accent-green)] hover:bg-[var(--accent-green)]/20 transition-colors"
                    >
                      Завершить
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">Нет задач по выбранному фильтру</p>
          </div>
        )}
      </div>
      </div>
    </PageLayout>
  );
}
