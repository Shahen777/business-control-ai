
/**
 * Типы для модуля Задачи (Tasks)
 * Workflow: Решение ИИ → Задача → Исполнение → Подтверждение → Эффект
 */

// Приоритет задачи
export type TaskPriority = "low" | "medium" | "high" | "critical";

// Статус задачи
export type TaskStatus = "new" | "in_progress" | "done" | "blocked" | "canceled";

// Комментарий к задаче
export interface TaskComment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO date string
}

// Основная сущность задачи
export interface Task {
  id: string;
  title: string;
  description: string;
  department?: string; // Отдел (опционально)
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId?: string; // ID сотрудника (связь с Employee)
  assigneeName: string;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO date string
  completedAt?: string; // Когда выполнена
  relatedDecisionId?: string; // Связь с решением ИИ
  tags?: string[];
  impactRub?: number; // Финансовый эффект в рублях
  comments: TaskComment[];
}

// Параметры для создания задачи
export interface CreateTaskParams {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: string;
  assigneeName?: string;
  department?: string;
  relatedDecisionId?: string;
  tags?: string[];
  impactRub?: number;
}

// Параметры для обновления задачи
export interface UpdateTaskParams {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  department?: string;
  tags?: string[];
  impactRub?: number;
}

// Фильтры для списка задач
export type TaskFilter = "all" | "new" | "in_progress" | "overdue" | "done" | "blocked";

// Конфигурация приоритетов
export const priorityConfig: Record<TaskPriority, { 
  label: string; 
  color: string; // CSS переменная цвета
  textClass: string; // text-* класс
  bgColor: string;
  dueDays: number; // Сколько дней до срока по умолчанию
}> = {
  critical: { 
    label: "Критичный", 
    color: "var(--accent-red)",
    textClass: "text-[var(--accent-red)]", 
    bgColor: "bg-[var(--accent-red)]/10",
    dueDays: 3 
  },
  high: { 
    label: "Высокий", 
    color: "var(--accent-amber)",
    textClass: "text-[var(--accent-amber)]", 
    bgColor: "bg-[var(--accent-amber)]/10",
    dueDays: 7 
  },
  medium: { 
    label: "Средний", 
    color: "var(--accent-blue)",
    textClass: "text-[var(--accent-blue)]", 
    bgColor: "bg-[var(--accent-blue)]/10",
    dueDays: 14 
  },
  low: { 
    label: "Низкий", 
    color: "var(--text-muted)",
    textClass: "text-[var(--text-muted)]", 
    bgColor: "bg-[var(--bg-tertiary)]",
    dueDays: 30 
  },
};

// Конфигурация статусов
export const statusConfig: Record<TaskStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: string;
  badge: string; // CSS класс для badge
}> = {
  new: { 
    label: "Новая", 
    color: "text-[var(--accent-purple)]", 
    bgColor: "bg-[var(--accent-purple)]/10",
    icon: "circle",
    badge: "badge-neutral"
  },
  in_progress: { 
    label: "В работе", 
    color: "text-[var(--accent-blue)]", 
    bgColor: "bg-[var(--accent-blue)]/10",
    icon: "play",
    badge: "badge-info" 
  },
  done: { 
    label: "Выполнена", 
    color: "text-[var(--accent-green)]", 
    bgColor: "bg-[var(--accent-green)]/10",
    icon: "check",
    badge: "badge-success"
  },
  blocked: { 
    label: "Заблокирована", 
    color: "text-[var(--accent-red)]", 
    bgColor: "bg-[var(--accent-red)]/10",
    icon: "block",
    badge: "badge-error"
  },
  canceled: { 
    label: "Отменена", 
    color: "text-[var(--text-muted)]", 
    bgColor: "bg-[var(--bg-tertiary)]",
    icon: "x",
    badge: "badge-neutral"
  },
};
