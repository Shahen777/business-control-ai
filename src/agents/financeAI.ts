/**
 * Finance AI - Финансовый ИИ-агент
 * Анализ ДДС, прогноз кассовых разрывов, контроль дебиторки и кредиторки,
 * выявление убыточных направлений, рекомендации по платежам
 */

import { 
  AIInsight, 
  CashFlowForecast, 
  Debtor, 
  Creditor, 
  Transaction,
  FinancialSummary 
} from '@/types';

export interface FinanceAIConfig {
  cashGapWarningDays: number;           // За сколько дней предупреждать о кассовом разрыве
  minBalanceThreshold: number;          // Минимальный остаток на счёте
  overdueDebtorDays: number;            // Через сколько дней дебиторка считается просроченной
  expenseGrowthAlertPercent: number;    // Процент роста расходов для алерта
}

const defaultConfig: FinanceAIConfig = {
  cashGapWarningDays: 14,
  minBalanceThreshold: 500000,
  overdueDebtorDays: 7,
  expenseGrowthAlertPercent: 20,
};

/**
 * Прогнозирует движение денежных средств на заданный период
 */
export function forecastCashFlow(
  currentBalance: number,
  transactions: Transaction[],
  debtors: Debtor[],
  creditors: Creditor[],
  daysAhead: number = 30
): CashFlowForecast[] {
  const forecast: CashFlowForecast[] = [];
  let balance = currentBalance;
  
  const today = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    
    // TODO: Реализовать прогнозирование на основе:
    // - Плановых платежей кредиторам
    // - Ожидаемых поступлений от дебиторов
    // - Регулярных расходов (зарплата, аренда и т.д.)
    
    const inflows = 0;  // TODO: рассчитать
    const outflows = 0; // TODO: рассчитать
    
    balance = balance + inflows - outflows;
    
    forecast.push({
      date: dateStr,
      balance,
      inflows,
      outflows,
    });
  }
  
  return forecast;
}

/**
 * Определяет дату потенциального кассового разрыва
 */
export function detectCashGap(
  forecast: CashFlowForecast[],
  minBalance: number = 0
): { hasGap: boolean; gapDate?: string; gapAmount?: number } {
  for (const point of forecast) {
    if (point.balance < minBalance) {
      return {
        hasGap: true,
        gapDate: point.date,
        gapAmount: Math.abs(point.balance - minBalance),
      };
    }
  }
  return { hasGap: false };
}

/**
 * Анализирует дебиторскую задолженность и возвращает рекомендации
 */
export function analyzeDebtors(
  debtors: Debtor[],
  config: FinanceAIConfig = defaultConfig
): AIInsight[] {
  const insights: AIInsight[] = [];
  const today = new Date();
  
  for (const debtor of debtors) {
    const dueDate = new Date(debtor.dueDate.split('.').reverse().join('-'));
    const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      // Просроченная задолженность
      insights.push({
        id: `debtor-overdue-${debtor.id}`,
        type: 'warning',
        agent: 'finance',
        message: `Просроченная дебиторка от ${debtor.name}: ${debtor.amount.toLocaleString('ru-RU')} ₽ (${Math.abs(daysDiff)} дней)`,
        createdAt: new Date().toISOString(),
        relatedEntityId: debtor.id,
        relatedEntityType: 'debtor',
      });
    } else if (daysDiff <= config.overdueDebtorDays) {
      // Скоро будет просрочена
      insights.push({
        id: `debtor-upcoming-${debtor.id}`,
        type: 'alert',
        agent: 'finance',
        message: `Дебиторка от ${debtor.name} (${debtor.amount.toLocaleString('ru-RU')} ₽) истекает через ${daysDiff} дней`,
        createdAt: new Date().toISOString(),
        relatedEntityId: debtor.id,
        relatedEntityType: 'debtor',
      });
    }
  }
  
  return insights;
}

/**
 * Анализирует расходы и выявляет аномалии
 */
export function analyzeExpenses(
  currentPeriod: Transaction[],
  previousPeriod: Transaction[],
  config: FinanceAIConfig = defaultConfig
): AIInsight[] {
  const insights: AIInsight[] = [];
  
  // Группировка расходов по категориям
  const currentByCategory = groupByCategory(currentPeriod.filter(t => t.type === 'expense'));
  const previousByCategory = groupByCategory(previousPeriod.filter(t => t.type === 'expense'));
  
  for (const [category, amount] of Object.entries(currentByCategory)) {
    const prevAmount = previousByCategory[category] || 0;
    if (prevAmount > 0) {
      const growthPercent = ((amount - prevAmount) / prevAmount) * 100;
      
      if (growthPercent > config.expenseGrowthAlertPercent) {
        insights.push({
          id: `expense-growth-${category}`,
          type: 'insight',
          agent: 'finance',
          message: `Расходы на "${category}" выросли на ${growthPercent.toFixed(0)}% по сравнению с прошлым периодом`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
  
  return insights;
}

/**
 * Группирует транзакции по категориям
 */
function groupByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Рассчитывает финансовое здоровье бизнеса
 */
export function calculateFinancialHealth(summary: FinancialSummary): {
  score: number;
  status: 'good' | 'warning' | 'critical';
  factors: string[];
} {
  let score = 100;
  const factors: string[] = [];
  
  // Проверка прибыльности
  const profitMargin = summary.netProfit / summary.monthlyIncome;
  if (profitMargin < 0) {
    score -= 40;
    factors.push('Убыточная деятельность');
  } else if (profitMargin < 0.1) {
    score -= 20;
    factors.push('Низкая маржинальность');
  }
  
  // Проверка дебиторки
  const debtorRatio = summary.debtorsTotal / summary.monthlyIncome;
  if (debtorRatio > 0.5) {
    score -= 20;
    factors.push('Высокая дебиторская задолженность');
  }
  
  // Проверка баланса
  const balanceRatio = summary.currentBalance / summary.monthlyExpenses;
  if (balanceRatio < 1) {
    score -= 30;
    factors.push('Низкий запас денежных средств');
  }
  
  return {
    score: Math.max(0, score),
    status: score >= 70 ? 'good' : score >= 40 ? 'warning' : 'critical',
    factors,
  };
}

export default {
  forecastCashFlow,
  detectCashGap,
  analyzeDebtors,
  analyzeExpenses,
  calculateFinancialHealth,
};
