/**
 * Business AI - Главный ИИ-агент
 * Агрегирует данные всех модулей, выявляет ключевые проблемы,
 * расставляет приоритеты, формирует сценарии решений
 */

import { AIDecision, AIInsight, Priority } from '@/types';

export interface BusinessAIConfig {
  // Пороговые значения для определения критичности
  cashGapDaysThreshold: number;        // За сколько дней предупреждать о кассовом разрыве
  idleAssetDaysThreshold: number;      // Сколько дней простоя считать проблемой
  budgetOverrunThreshold: number;      // Процент превышения бюджета для предупреждения
  utilizationMinThreshold: number;     // Минимальная загрузка техники
}

const defaultConfig: BusinessAIConfig = {
  cashGapDaysThreshold: 14,
  idleAssetDaysThreshold: 3,
  budgetOverrunThreshold: 15,
  utilizationMinThreshold: 70,
};

/**
 * Анализирует все данные и возвращает список приоритизированных решений
 */
export function analyzeBusinessData(
  financialData: unknown,
  operationalData: unknown,
  config: BusinessAIConfig = defaultConfig
): AIDecision[] {
  const decisions: AIDecision[] = [];

  // TODO: Реализовать анализ финансовых данных
  // - Прогноз кассовых разрывов
  // - Анализ дебиторской задолженности
  // - Выявление убыточных направлений

  // TODO: Реализовать анализ операционных данных
  // - Выявление простаивающей техники
  // - Анализ эффективности проектов
  // - Контроль загрузки ресурсов

  return prioritizeDecisions(decisions);
}

/**
 * Генерирует инсайты на основе текущих данных
 */
export function generateInsights(
  financialData: unknown,
  operationalData: unknown,
  config: BusinessAIConfig = defaultConfig
): AIInsight[] {
  const insights: AIInsight[] = [];

  // TODO: Реализовать генерацию инсайтов

  return insights;
}

/**
 * Приоритизирует решения по критичности и потенциальному влиянию
 */
function prioritizeDecisions(decisions: AIDecision[]): AIDecision[] {
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return decisions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Определяет приоритет на основе финансового влияния и срочности
 */
export function calculatePriority(
  financialImpact: number,
  daysUntilDeadline: number
): Priority {
  if (financialImpact > 500000 || daysUntilDeadline < 3) {
    return 'critical';
  }
  if (financialImpact > 200000 || daysUntilDeadline < 7) {
    return 'high';
  }
  if (financialImpact > 50000 || daysUntilDeadline < 14) {
    return 'medium';
  }
  return 'low';
}

export default {
  analyzeBusinessData,
  generateInsights,
  calculatePriority,
};
