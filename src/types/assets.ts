/**
 * Типы для раздела Активы
 * Техника (Собственная, Лизинг, Аренда) и Недвижимость
 */

// ============================================
// ТЕХНИКА
// ============================================

// Тип владения техникой
export type EquipmentOwnership = 'own' | 'leasing' | 'rent';

// Статус техники
export type EquipmentStatus = 'working' | 'idle' | 'maintenance' | 'repair';

// Категория техники
export type EquipmentCategory = 'excavator' | 'loader' | 'bulldozer' | 'crane' | 'truck' | 'other';

// Платёж по лизингу
export interface LeasingPayment {
  month: string; // "2025-01"
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidAt?: string;
}

// Договор лизинга
export interface LeasingContract {
  id: string;
  contractNumber: string;
  leasingCompany: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  monthlyPayment: number;
  buyoutAmount?: number; // Выкупная стоимость
  payments: LeasingPayment[];
  documentFile?: string; // Скан договора
  extractedAt?: string;
}

// Договор аренды техники
export interface RentContract {
  id: string;
  contractNumber?: string;
  lessor: string; // Арендодатель
  startDate: string;
  endDate?: string;
  dailyRate?: number;
  monthlyRate?: number;
  includesOperator?: boolean;
  includesFuel?: boolean;
}

// Расход по технике
export interface EquipmentExpense {
  id: string;
  equipmentId: string;
  type: 'fuel' | 'salary' | 'parts' | 'maintenance' | 'repair' | 'insurance' | 'leasing' | 'rent' | 'other';
  description: string;
  amount: number;
  date: string;
  month: string; // "2025-01" для группировки
  vendor?: string; // Поставщик
}

// Доход по технике
export interface EquipmentIncome {
  id: string;
  equipmentId: string;
  projectId?: string;
  projectName?: string;
  source?: string; // Источник дохода
  description: string;
  hours?: number;
  hourlyRate?: number;
  amount: number;
  date: string;
  month: string;
}

// Закреплённый сотрудник
export interface AssignedEmployee {
  employeeId: string;
  employeeName: string;
  role: 'operator' | 'driver' | 'mechanic' | 'backup';
  phone?: string;
}

// Единица техники
export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  year?: number;
  serialNumber?: string;
  plateNumber?: string; // Гос. номер
  ownership: EquipmentOwnership;
  status: EquipmentStatus;
  
  // Технические характеристики
  engineHours?: number; // Моточасы
  mileage?: number; // Пробег в км
  fuelType?: 'diesel' | 'petrol' | 'electric';
  fuelConsumption?: number; // л/час или л/100км
  
  // Обслуживание
  nextMaintenanceDate?: string;
  nextMaintenanceHours?: number;
  
  // Связи
  currentProjectId?: string;
  currentProjectName?: string;
  assignedEmployees: AssignedEmployee[];
  
  // Лизинг
  leasingContract?: LeasingContract;
  
  // Аренда
  rentContract?: RentContract;
  
  // Финансы (рассчитываются)
  purchaseDate?: string; // Дата покупки
  purchasePrice?: number; // Для собственной
  currentValue?: number; // Текущая оценка
  
  // Ставки
  hourlyRate?: number;
  
  // Метаданные
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// Месячная сводка по технике
export interface EquipmentMonthlySummary {
  equipmentId: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  hoursWorked: number;
  workingHours: number; // alias для hoursWorked
  daysIdle: number;
  utilization: number; // % загрузки
}

// ============================================
// НЕДВИЖИМОСТЬ
// ============================================

// Тип владения недвижимостью
export type PropertyOwnership = 'own' | 'rent';

// Тип недвижимости
export type PropertyType = 'office' | 'warehouse' | 'base' | 'parking' | 'land' | 'other';

// Расход по недвижимости
export interface PropertyExpense {
  id: string;
  propertyId: string;
  type: 'rent' | 'utilities' | 'security' | 'maintenance' | 'taxes' | 'insurance' | 'other';
  description: string;
  amount: number;
  date: string;
  month: string;
  isRecurring?: boolean;
}

// Доход от недвижимости
export interface PropertyIncome {
  id: string;
  propertyId: string;
  type: 'subrent' | 'storage' | 'services' | 'other';
  description: string;
  amount: number;
  date: string;
  month: string;
}

// Договор аренды недвижимости
export interface PropertyRentContract {
  id: string;
  contractNumber?: string;
  lessor: string; // Арендодатель
  startDate: string;
  endDate?: string;
  monthlyRate: number;
  depositAmount?: number;
}

// Объект недвижимости
export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  ownership: PropertyOwnership;
  address: string;
  area: number; // м²
  purpose?: string; // Назначение
  
  // Аренда
  rentContract?: PropertyRentContract;
  
  // Собственная
  purchasePrice?: number;
  currentValue?: number;
  
  // Метаданные
  photoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// Месячная сводка по недвижимости
export interface PropertyMonthlySummary {
  propertyId: string;
  month: string;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
}

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

export const equipmentOwnershipConfig: Record<EquipmentOwnership, { label: string; color: string; bgColor: string }> = {
  own: { label: 'Собственная', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  leasing: { label: 'Лизинг', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  rent: { label: 'Аренда', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
};

export const equipmentStatusConfig: Record<EquipmentStatus, { label: string; color: string; bgColor: string }> = {
  working: { label: 'В работе', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  idle: { label: 'Простой', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  maintenance: { label: 'ТО', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  repair: { label: 'Ремонт', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

export const equipmentCategoryConfig: Record<EquipmentCategory, { label: string; icon: string }> = {
  excavator: { label: 'Экскаватор', icon: '🚜' },
  loader: { label: 'Погрузчик', icon: '🏗️' },
  bulldozer: { label: 'Бульдозер', icon: '🚧' },
  crane: { label: 'Кран', icon: '🏗️' },
  truck: { label: 'Самосвал', icon: '🚛' },
  other: { label: 'Другое', icon: '⚙️' },
};

export const expenseTypeConfig: Record<EquipmentExpense['type'], { label: string; icon: string; color: string }> = {
  fuel: { label: 'ГСМ', icon: '⛽', color: '#F59E0B' },
  salary: { label: 'Зарплата', icon: '👤', color: '#8B5CF6' },
  parts: { label: 'Запчасти', icon: '🔧', color: '#EF4444' },
  maintenance: { label: 'ТО и сервис', icon: '🛠️', color: '#3B82F6' },
  repair: { label: 'Ремонт', icon: '🔩', color: '#DC2626' },
  insurance: { label: 'Страховка', icon: '🛡️', color: '#10B981' },
  leasing: { label: 'Лизинг', icon: '📄', color: '#6366F1' },
  rent: { label: 'Аренда', icon: '🔑', color: '#EC4899' },
  other: { label: 'Прочее', icon: '📦', color: '#71717A' },
};

export const propertyTypeConfig: Record<PropertyType, { label: string; icon: string }> = {
  office: { label: 'Офис', icon: '🏢' },
  warehouse: { label: 'Склад', icon: '🏭' },
  base: { label: 'База', icon: '🏗️' },
  parking: { label: 'Стоянка', icon: '🅿️' },
  land: { label: 'Участок', icon: '🌍' },
  other: { label: 'Другое', icon: '🏠' },
};

export const propertyOwnershipConfig: Record<PropertyOwnership, { label: string; color: string; bgColor: string }> = {
  own: { label: 'Собственность', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  rent: { label: 'Аренда', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
};
