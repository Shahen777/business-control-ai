/**
 * Типы для операционного модуля
 * Связи: Техника ↔ Объекты ↔ Сотрудники ↔ Задачи
 */

// ============================================
// ОПЕРАЦИОННЫЕ СОБЫТИЯ
// ============================================

// Тип события
export type OperationEventType = 
  | 'equipment_assigned'      // Техника назначена на объект
  | 'equipment_unassigned'    // Техника снята с объекта
  | 'equipment_idle'          // Техника простаивает
  | 'equipment_breakdown'     // Поломка техники
  | 'equipment_maintenance'   // ТО техники
  | 'employee_assigned'       // Сотрудник назначен
  | 'employee_absent'         // Сотрудник отсутствует
  | 'project_started'         // Объект начат
  | 'project_paused'          // Объект приостановлен
  | 'project_completed'       // Объект завершён
  | 'task_created'            // Задача создана
  | 'task_completed'          // Задача выполнена
  | 'task_overdue'            // Задача просрочена
  | 'payment_received'        // Оплата получена
  | 'payment_overdue'         // Просроченная оплата
  | 'risk_detected'           // Обнаружен риск
  | 'shift_started'           // Смена началась
  | 'shift_ended';            // Смена завершилась

// Приоритет события
export type EventPriority = 'low' | 'medium' | 'high' | 'critical';

// Статус события
export type EventStatus = 'pending' | 'in_progress' | 'resolved' | 'ignored';

// Операционное событие
export interface OperationEvent {
  id: string;
  type: OperationEventType;
  priority: EventPriority;
  status: EventStatus;
  title: string;
  description: string;
  timestamp: string;
  
  // Связи
  equipmentId?: string;
  equipmentName?: string;
  projectId?: string;
  projectName?: string;
  employeeId?: string;
  employeeName?: string;
  contractorId?: string;
  contractorName?: string;
  taskId?: string;
  
  // Финансовые последствия
  financialImpact?: number;
  lossPerDay?: number;
  
  // Действия
  suggestedAction?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

// ============================================
// ОПЕРАЦИОННЫЕ СВОДКИ
// ============================================

// Загрузка техники на объекте
export interface EquipmentUtilization {
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  projectId: string;
  projectName: string;
  status: 'working' | 'idle' | 'maintenance' | 'transit';
  hoursToday: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
  utilizationPercent: number;
  revenueToday: number;
  revenueThisMonth: number;
  operatorId?: string;
  operatorName?: string;
  lastActivity?: string;
}

// Сводка по сотруднику на объекте
export interface EmployeeWorkload {
  employeeId: string;
  employeeName: string;
  position: string;
  projectId: string;
  projectName: string;
  status: 'working' | 'absent' | 'vacation' | 'sick';
  shiftStart?: string;
  shiftEnd?: string;
  hoursWorked: number;
  tasksAssigned: number;
  tasksCompleted: number;
  performance: number; // 0-100%
}

// Статус объекта в операциях
export interface ProjectOperationStatus {
  projectId: string;
  projectName: string;
  projectType: 'construction' | 'equipment_services';
  contractorId: string;
  contractorName: string;
  status: 'active' | 'paused' | 'delayed' | 'on_track';
  
  // Прогресс
  progress: number;
  daysRemaining: number;
  isDelayed: boolean;
  delayDays?: number;
  
  // Ресурсы
  equipmentCount: number;
  employeeCount: number;
  equipmentUtilization: number;
  
  // Финансы
  budgetUsed: number;
  budgetTotal: number;
  budgetPercent: number;
  isOverBudget: boolean;
  
  // Риски
  activeRisks: number;
  criticalRisks: number;
}

// ============================================
// СМЕНЫ И ЗАДАНИЯ
// ============================================

export type ShiftStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Shift {
  id: string;
  date: string;
  type: 'day' | 'night';
  status: ShiftStatus;
  
  projectId: string;
  projectName: string;
  
  // Назначенные ресурсы
  employees: {
    employeeId: string;
    employeeName: string;
    role: string;
    hoursWorked?: number;
    status: 'assigned' | 'started' | 'completed' | 'absent';
  }[];
  
  equipment: {
    equipmentId: string;
    equipmentName: string;
    hoursWorked?: number;
    status: 'assigned' | 'working' | 'idle' | 'breakdown';
  }[];
  
  // Результаты
  plannedHours: number;
  actualHours?: number;
  plannedOutput?: string;
  actualOutput?: string;
  notes?: string;
  
  // Временные метки
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
}

// Задание на день
export interface DailyAssignment {
  id: string;
  date: string;
  shiftId?: string;
  
  projectId: string;
  projectName: string;
  
  equipmentId?: string;
  equipmentName?: string;
  employeeId: string;
  employeeName: string;
  
  task: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  
  plannedHours: number;
  actualHours?: number;
  
  notes?: string;
  blockedReason?: string;
  completedAt?: string;
}

// ============================================
// ДАШБОРД ОПЕРАЦИЙ
// ============================================

export interface OperationsDashboard {
  // Текущий статус
  date: string;
  
  // Техника
  totalEquipment: number;
  workingEquipment: number;
  idleEquipment: number;
  maintenanceEquipment: number;
  avgUtilization: number;
  
  // Объекты
  activeProjects: number;
  delayedProjects: number;
  onTrackProjects: number;
  
  // Сотрудники
  totalEmployees: number;
  workingEmployees: number;
  absentEmployees: number;
  
  // Финансовые показатели
  todayRevenue: number;
  todayExpenses: number;
  idleLossesPerDay: number;
  monthRevenue: number;
  monthExpenses: number;
  
  // События
  pendingEvents: number;
  criticalEvents: number;
  
  // Задачи
  tasksToday: number;
  tasksCompleted: number;
  tasksOverdue: number;
}

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

export const operationEventTypeConfig: Record<OperationEventType, { label: string; icon: string; color: string }> = {
  equipment_assigned: { label: 'Техника назначена', icon: '🚜', color: '#10B981' },
  equipment_unassigned: { label: 'Техника снята', icon: '🚜', color: '#6B7280' },
  equipment_idle: { label: 'Простой техники', icon: '⏸️', color: '#F59E0B' },
  equipment_breakdown: { label: 'Поломка техники', icon: '🔧', color: '#EF4444' },
  equipment_maintenance: { label: 'ТО техники', icon: '🛠️', color: '#3B82F6' },
  employee_assigned: { label: 'Сотрудник назначен', icon: '👤', color: '#10B981' },
  employee_absent: { label: 'Отсутствие сотрудника', icon: '👤', color: '#F59E0B' },
  project_started: { label: 'Объект начат', icon: '🏗️', color: '#10B981' },
  project_paused: { label: 'Объект приостановлен', icon: '⏸️', color: '#F59E0B' },
  project_completed: { label: 'Объект завершён', icon: '✅', color: '#10B981' },
  task_created: { label: 'Задача создана', icon: '📋', color: '#3B82F6' },
  task_completed: { label: 'Задача выполнена', icon: '✅', color: '#10B981' },
  task_overdue: { label: 'Задача просрочена', icon: '⚠️', color: '#EF4444' },
  payment_received: { label: 'Оплата получена', icon: '💰', color: '#10B981' },
  payment_overdue: { label: 'Просроченная оплата', icon: '💳', color: '#EF4444' },
  risk_detected: { label: 'Обнаружен риск', icon: '⚠️', color: '#F59E0B' },
  shift_started: { label: 'Смена началась', icon: '▶️', color: '#3B82F6' },
  shift_ended: { label: 'Смена завершилась', icon: '⏹️', color: '#6B7280' },
};

export const eventPriorityConfig: Record<EventPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Низкий', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
  medium: { label: 'Средний', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  high: { label: 'Высокий', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  critical: { label: 'Критический', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

export const eventStatusConfig: Record<EventStatus, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: '#F59E0B' },
  in_progress: { label: 'В работе', color: '#3B82F6' },
  resolved: { label: 'Решено', color: '#10B981' },
  ignored: { label: 'Игнорировано', color: '#6B7280' },
};

export const shiftStatusConfig: Record<ShiftStatus, { label: string; color: string; bgColor: string }> = {
  scheduled: { label: 'Запланирована', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  active: { label: 'Активна', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  completed: { label: 'Завершена', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
  cancelled: { label: 'Отменена', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

export const projectOperationStatusConfig: Record<ProjectOperationStatus['status'], { label: string; color: string; bgColor: string }> = {
  active: { label: 'Активен', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  paused: { label: 'Приостановлен', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  delayed: { label: 'Отстаёт', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  on_track: { label: 'По плану', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
};
