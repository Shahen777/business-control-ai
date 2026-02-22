// Типы для модуля Сотрудники (Employees)

export type EmployeeRole = 'owner' | 'dispatcher' | 'accountant' | 'manager' | 'driver' | 'contractor';
export type EmployeeDepartment = 'sales' | 'finance' | 'operations' | 'management';
export type EmployeeStatus = 'available' | 'busy' | 'overloaded' | 'inactive';
export type LoadScore = 'low' | 'medium' | 'high' | 'critical';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  department?: EmployeeDepartment;
  status: EmployeeStatus;
  avatarInitials?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  costPerMonthRub?: number;
  createdAt: string;
}

export interface EmployeeStats {
  activeCount: number;      // Активные задачи (new + in_progress)
  overdueCount: number;     // Просроченные задачи
  done7dCount: number;      // Выполнено за 7 дней
  blockedCount: number;     // Заблокированные задачи
  loadScore: LoadScore;     // Уровень загрузки
}

export interface EmployeeWithStats extends Employee {
  stats: EmployeeStats;
}

// Конфигурация ролей для отображения
export const roleConfig: Record<EmployeeRole, { label: string; color: string }> = {
  owner: { label: 'Владелец', color: '#8B5CF6' },
  dispatcher: { label: 'Диспетчер', color: '#3B82F6' },
  accountant: { label: 'Бухгалтер', color: '#10B981' },
  manager: { label: 'Менеджер', color: '#F59E0B' },
  driver: { label: 'Водитель', color: '#6366F1' },
  contractor: { label: 'Подрядчик', color: '#EC4899' },
};

// Конфигурация статусов для отображения
export const statusConfig: Record<EmployeeStatus, { label: string; color: string; bgColor: string }> = {
  available: { label: 'Свободен', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  busy: { label: 'Занят', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  overloaded: { label: 'Перегружен', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  inactive: { label: 'Неактивен', color: '#71717A', bgColor: 'rgba(113, 113, 122, 0.15)' },
};

// Конфигурация загрузки
export const loadScoreConfig: Record<LoadScore, { label: string; color: string; description: string }> = {
  low: { label: 'Низкая', color: '#10B981', description: 'Можно назначать задачи' },
  medium: { label: 'Средняя', color: '#3B82F6', description: 'Оптимальная загрузка' },
  high: { label: 'Высокая', color: '#F59E0B', description: 'Близок к перегрузке' },
  critical: { label: 'Критическая', color: '#EF4444', description: 'Не назначать новые задачи' },
};

// Конфигурация отделов
export const departmentConfig: Record<EmployeeDepartment, { label: string }> = {
  sales: { label: 'Продажи' },
  finance: { label: 'Финансы' },
  operations: { label: 'Операции' },
  management: { label: 'Руководство' },
};
