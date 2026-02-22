/**
 * Типы для раздела Контрагенты и Объекты
 * Связующий слой между финансами, техникой, сотрудниками и документами
 */

// ============================================
// ОБЪЕКТЫ (СТРОЙКИ / ПЛОЩАДКИ)
// ============================================

// Тип объекта
export type ProjectType = 'construction' | 'equipment_services';

// Статус объекта
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';

// Связанная техника на объекте
export interface ProjectEquipment {
  equipmentId: string;
  equipmentName: string;
  assignedDate: string;
  unassignedDate?: string;
  hoursPlanned?: number;
  hoursWorked: number;
  hourlyRate: number;
  income: number;
}

// Связанный сотрудник на объекте
export interface ProjectEmployee {
  employeeId: string;
  employeeName: string;
  role: string; // Прораб, Машинист, Рабочий
  assignedDate: string;
  unassignedDate?: string;
  salaryPaid: number;
}

// Документ объекта
export interface ProjectDocument {
  id: string;
  type: 'contract' | 'act' | 'invoice' | 'schedule' | 'estimate' | 'other';
  name: string;
  date: string;
  amount?: number;
  fileUrl?: string;
  status?: 'draft' | 'signed' | 'paid' | 'overdue';
}

// Риск объекта
export interface ProjectRisk {
  id: string;
  type: 'payment_delay' | 'overspend' | 'equipment_idle' | 'deadline' | 'quality' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  resolvedAt?: string;
}

// Расход по объекту (детализированный)
export interface ProjectExpense {
  id: string;
  projectId: string;
  category: 'salary' | 'equipment' | 'materials' | 'fuel' | 'subcontract' | 'other';
  description: string;
  amount: number;
  date: string;
  month: string;
  equipmentId?: string;
  employeeId?: string;
  documentId?: string;
}

// Доход по объекту
export interface ProjectIncome {
  id: string;
  projectId: string;
  type: 'contract_payment' | 'hourly_payment' | 'bonus' | 'other';
  description: string;
  amount: number;
  date: string;
  month: string;
  documentId?: string;
}

// Объект (проект / стройка / площадка)
export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  
  // Контрагент
  contractorId: string;
  contractorName: string;
  
  // Адрес
  address: string;
  coordinates?: { lat: number; lng: number };
  
  // Сроки
  startDate: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  
  // Контракт (для строек)
  contractAmount?: number;
  receivedAmount?: number;
  remainingAmount?: number;
  
  // Ставки (для услуг техники)
  isHourlyBased?: boolean;
  
  // Связи
  equipment: ProjectEquipment[];
  employees: ProjectEmployee[];
  documents: ProjectDocument[];
  risks: ProjectRisk[];
  
  // Финансовая сводка (рассчитывается)
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  
  // Смета (для строек)
  estimatedExpenses?: {
    salary: number;
    equipment: number;
    materials: number;
    other: number;
  };
  
  // Описание
  description?: string;
  notes?: string;
  
  // Метаданные
  createdAt: string;
  updatedAt?: string;
}

// Месячная сводка по объекту
export interface ProjectMonthlySummary {
  projectId: string;
  month: string;
  income: number;
  expenses: {
    salary: number;
    equipment: number;
    materials: number;
    fuel: number;
    subcontract: number;
    other: number;
    total: number;
  };
  profit: number;
  equipmentHours: number;
  equipmentUtilization: number;
}

// ============================================
// КОНТРАГЕНТЫ
// ============================================

// Тип контрагента
export type ContractorType = 'customer' | 'supplier' | 'subcontractor';

// Репутация (внутренняя оценка)
export type ContractorReputation = 'excellent' | 'good' | 'neutral' | 'problematic' | 'blacklisted';

// Контактное лицо
export interface ContactPerson {
  id: string;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  isMain: boolean;
}

// Банковские реквизиты
export interface BankDetails {
  bankName: string;
  bik: string;
  accountNumber: string;
  correspondentAccount?: string;
}

// Контрагент
export interface Contractor {
  id: string;
  name: string;
  type: ContractorType;
  
  // Юридические данные
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legalAddress?: string;
  actualAddress?: string;
  
  // Контакты
  contacts: ContactPerson[];
  phone?: string;
  email?: string;
  website?: string;
  
  // Банковские реквизиты
  bankDetails?: BankDetails;
  
  // Репутация (внутренняя)
  reputation: ContractorReputation;
  reputationNotes?: string;
  paymentDiscipline?: 'excellent' | 'good' | 'average' | 'poor'; // Платит вовремя?
  
  // Финансовая сводка (рассчитывается)
  totalProjects: number;
  activeProjects: number;
  totalIncome: number;
  totalReceivables: number; // Дебиторка
  overdueReceivables: number; // Просроченная дебиторка
  averagePaymentDelay: number; // Средняя задержка оплаты в днях
  
  // Метаданные
  createdAt: string;
  updatedAt?: string;
  lastActivityAt?: string;
}

// Сводка по контрагенту
export interface ContractorSummary {
  contractorId: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalIncome: number;
  totalReceivables: number;
  overdueReceivables: number;
  overdueDays: number;
  avgProjectProfit: number;
}

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

export const projectTypeConfig: Record<ProjectType, { label: string; icon: string; color: string }> = {
  construction: { label: 'Строительство', icon: '🏗️', color: '#3B82F6' },
  equipment_services: { label: 'Услуги техники', icon: '🚜', color: '#10B981' },
};

export const projectStatusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  planning: { label: 'Планирование', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
  active: { label: 'В работе', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  paused: { label: 'Приостановлен', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  completed: { label: 'Завершён', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  cancelled: { label: 'Отменён', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

export const contractorTypeConfig: Record<ContractorType, { label: string; icon: string; color: string }> = {
  customer: { label: 'Заказчик', icon: '👤', color: '#3B82F6' },
  supplier: { label: 'Поставщик', icon: '📦', color: '#10B981' },
  subcontractor: { label: 'Подрядчик', icon: '🔧', color: '#8B5CF6' },
};

export const contractorReputationConfig: Record<ContractorReputation, { label: string; icon: string; color: string; bgColor: string }> = {
  excellent: { label: 'Отлично', icon: '⭐', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  good: { label: 'Хорошо', icon: '✅', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  neutral: { label: 'Нейтрально', icon: '➖', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
  problematic: { label: 'Проблемный', icon: '⚠️', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  blacklisted: { label: 'Чёрный список', icon: '🚫', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

export const projectExpenseCategoryConfig: Record<ProjectExpense['category'], { label: string; icon: string; color: string }> = {
  salary: { label: 'Зарплата', icon: '👤', color: '#8B5CF6' },
  equipment: { label: 'Техника', icon: '🚜', color: '#3B82F6' },
  materials: { label: 'Материалы', icon: '🧱', color: '#F59E0B' },
  fuel: { label: 'ГСМ', icon: '⛽', color: '#EF4444' },
  subcontract: { label: 'Субподряд', icon: '🔧', color: '#10B981' },
  other: { label: 'Прочее', icon: '📦', color: '#6B7280' },
};

export const projectRiskTypeConfig: Record<ProjectRisk['type'], { label: string; icon: string }> = {
  payment_delay: { label: 'Задержка оплаты', icon: '💳' },
  overspend: { label: 'Перерасход', icon: '📈' },
  equipment_idle: { label: 'Простой техники', icon: '⏸️' },
  deadline: { label: 'Срыв сроков', icon: '⏰' },
  quality: { label: 'Качество', icon: '⚠️' },
  other: { label: 'Прочее', icon: '❓' },
};

export const projectDocumentTypeConfig: Record<ProjectDocument['type'], { label: string; icon: string }> = {
  contract: { label: 'Договор', icon: '📄' },
  act: { label: 'Акт', icon: '✅' },
  invoice: { label: 'Счёт', icon: '💳' },
  schedule: { label: 'ГПР', icon: '📅' },
  estimate: { label: 'Смета', icon: '📊' },
  other: { label: 'Прочее', icon: '📎' },
};
