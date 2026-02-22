/**
 * Типы для юридического модуля (Legal)
 * Договоры, документы, извлечённые условия
 */

// Статус договора
export type ContractStatus = 'draft' | 'active' | 'closed' | 'disputed';

// Файл договора
export interface ContractFile {
  id: string;
  filename: string;
  mimeType: string;
  size?: number;
  text?: string; // Извлечённый текст из файла
  uploadedAt: string;
}

// Этап/веха договора
export interface ContractMilestone {
  name: string;
  date?: string;
  deliverable?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

// Штраф/неустойка
export interface ContractPenalty {
  trigger: string;
  rate?: string;
  cap?: string;
}

// Обязательство по договору
export interface ContractObligation {
  side: 'we' | 'counterparty';
  text: string;
  dueDate?: string;
  status?: 'pending' | 'fulfilled' | 'overdue';
}

// Рискованный пункт
export interface RiskyClause {
  title: string;
  why: string;
  severity: 'low' | 'medium' | 'high';
  clauseNumber?: string;
}

// Извлечённые условия договора (от GPT)
export interface ContractExtract {
  parties?: {
    customer?: string;
    contractor?: string;
  };
  subject?: string;
  amountRub?: number;
  advanceRub?: number;
  paymentTerms?: string;
  workStartDate?: string;
  workEndDate?: string;
  milestones?: ContractMilestone[];
  penalties?: ContractPenalty[];
  closingDocs?: string[];
  obligations?: ContractObligation[];
  riskyClauses?: RiskyClause[];
  summary?: string;
  extractedAt?: string;
}

// Договор
export interface Contract {
  id: string;
  title: string;
  number?: string;
  date?: string;
  counterparty: string;
  counterpartyINN?: string;
  projectName?: string;
  status: ContractStatus;
  startDate?: string;
  endDate?: string;
  amountRub?: number;
  advanceRub?: number;
  files: ContractFile[];
  extracted?: ContractExtract;
  relatedTaskIds?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Тип юридического документа
export type LegalDocType = 'power_of_attorney' | 'invoice' | 'act' | 'contract' | 'letter' | 'agreement';

// Сгенерированный документ
export interface LegalDocument {
  id: string;
  type: LegalDocType;
  title: string;
  relatedContractId?: string;
  relatedTaskId?: string;
  content: string;
  variables?: Record<string, string>;
  createdAt: string;
}

// Параметры создания договора
export interface CreateContractParams {
  title: string;
  number?: string;
  date?: string;
  counterparty: string;
  counterpartyINN?: string;
  projectName?: string;
  status?: ContractStatus;
  startDate?: string;
  endDate?: string;
  amountRub?: number;
  advanceRub?: number;
}

// Параметры генерации документа
export interface CreateLegalDocParams {
  type: LegalDocType;
  title: string;
  relatedContractId?: string;
  variables: Record<string, string>;
}

// Конфигурация статусов договора
export const contractStatusConfig: Record<ContractStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Черновик', color: '#71717A', bgColor: 'rgba(113, 113, 122, 0.15)' },
  active: { label: 'Активный', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  closed: { label: 'Закрыт', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  disputed: { label: 'Спорный', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};

// Конфигурация типов документов
export const legalDocTypeConfig: Record<LegalDocType, { label: string; icon: string }> = {
  power_of_attorney: { label: 'Доверенность', icon: '📜' },
  invoice: { label: 'Счёт', icon: '🧾' },
  act: { label: 'Акт', icon: '📋' },
  contract: { label: 'Договор', icon: '📄' },
  letter: { label: 'Письмо', icon: '✉️' },
  agreement: { label: 'Соглашение', icon: '🤝' },
};

// Конфигурация severity
export const severityConfig: Record<'low' | 'medium' | 'high', { label: string; color: string; bgColor: string }> = {
  low: { label: 'Низкий', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  medium: { label: 'Средний', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  high: { label: 'Высокий', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
};
