// Типы для финансового модуля

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  projectId?: string;
  assetId?: string;
}

export interface Debtor {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  contactInfo?: string;
}

export interface Creditor {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'paid';
}

export interface CashFlowForecast {
  date: string;
  balance: number;
  inflows: number;
  outflows: number;
}

export interface FinancialSummary {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
  debtorsTotal: number;
  creditorsTotal: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}
