// Общие типы приложения

export * from './finance';
export * from './operations';
export * from './agents';
export * from './tasks';
export * from './decisions';
export * from './employees';
export * from './employees';

// Пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  role: 'owner' | 'admin' | 'viewer';
  createdAt: string;
}

// Компания
export interface Company {
  id: string;
  name: string;
  industry: string;
  employeesCount: number;
  assetsCount: number;
  ownerId: string;
  settings: CompanySettings;
}

export interface CompanySettings {
  currency: string;
  timezone: string;
  fiscalYearStart: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  cashGapWarningDays: number;
  idleAssetWarningDays: number;
  overdueDebtorWarningDays: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
