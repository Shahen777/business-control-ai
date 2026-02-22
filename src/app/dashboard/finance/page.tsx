"use client";

import { useState } from "react";
import { KpiCard } from "@/components/design-system/KpiCard";
import { Tabs } from "@/components/design-system/Tabs";
import { AlertCard } from "@/components/design-system/AlertCard";
import { ChartCard } from "@/components/design-system/ChartCard";
import { Chip } from "@/components/design-system/Chip";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { ReceivablesList } from "@/components/finance/ReceivablesList";
import { TransactionsList } from "@/components/finance/TransactionsList";

// Типы
interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

interface Debtor {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
}

// Данные
const transactions: Transaction[] = [
  { id: 1, description: "Оплата от ООО СтройМир", amount: 450000, date: "07.01", category: "Проекты", type: "income" },
  { id: 2, description: "Зарплата сотрудников", amount: -380000, date: "05.01", category: "Зарплата", type: "expense" },
  { id: 3, description: "Аренда техники", amount: -85000, date: "04.01", category: "Техника", type: "expense" },
  { id: 4, description: "Аванс проект Парковка", amount: 200000, date: "03.01", category: "Проекты", type: "income" },
  { id: 5, description: "Материалы на склад", amount: -120000, date: "02.01", category: "Материалы", type: "expense" },
  { id: 6, description: "Оплата от ИП Петров", amount: 180000, date: "01.01", category: "Проекты", type: "income" },
];

const debtors: Debtor[] = [
  { id: 1, name: "ООО «СтройМир»", amount: 450000, dueDate: "24.12", overdueDays: 14 },
  { id: 2, name: "ИП Петров А.С.", amount: 120000, dueDate: "01.01", overdueDays: 7 },
  { id: 3, name: "ООО «Логистик»", amount: 85000, dueDate: "05.01", overdueDays: 3 },
];

const cashFlowData = [
  { month: "Авг", income: 1200, expense: 900 },
  { month: "Сен", income: 1400, expense: 1100 },
  { month: "Окт", income: 1100, expense: 1000 },
  { month: "Ноя", income: 1600, expense: 1200 },
  { month: "Дек", income: 1300, expense: 1400 },
  { month: "Янв", income: 900, expense: 1100 },
];

export default function FinancePage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [transactionFilter, setTransactionFilter] = useState("Все");

  // Расчёты
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = 2450000; // Текущий баланс
  const totalDebt = debtors.reduce((sum, d) => sum + d.amount, 0);
  const overdueDebt = debtors.filter(d => d.overdueDays > 0).reduce((sum, d) => sum + d.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Финансы"
          subtitle="Контроль денежных потоков и дебиторской задолженности"
          actions={
            <Tabs
              value={period}
              onChange={(val) => setPeriod(val as typeof period)}
              items={[
                { value: "week", label: "Неделя" },
                { value: "month", label: "Месяц" },
                { value: "quarter", label: "Квартал" },
                { value: "custom", label: "📅 Свой период", disabled: true },
              ]}
            />
          }
        />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          icon="💼"
          label="Баланс"
          value={`${(balance / 1000000).toFixed(2)} млн ₽`}
          secondary="↑ +12% за месяц"
          status="success"
        />
        <KpiCard
          icon="📈"
          label="Доходы"
          value={`+${(totalIncome / 1000).toFixed(0)}к ₽`}
          secondary="за период"
          status="success"
        />
        <KpiCard
          icon="📉"
          label="Расходы"
          value={`-${(totalExpense / 1000).toFixed(0)}к ₽`}
          secondary="за период"
          status="warning"
        />
        <KpiCard
          icon="🧾"
          label="Дебиторка"
          value={`${(totalDebt / 1000).toFixed(0)}к ₽`}
          secondary="за период"
          badge={<Chip variant="warning">{debtors.filter(d => d.overdueDays > 0).length} просрочено</Chip>}
          status="warning"
        />
        <KpiCard
          icon="🧮"
          label="Чистый поток"
          value={`${netCashFlow >= 0 ? "+" : "-"}${Math.abs(netCashFlow / 1000).toFixed(0)}к ₽`}
          secondary="за период"
          status={netCashFlow >= 0 ? "success" : "danger"}
        />
      </div>

      {/* Cash Gap Warning */}
      <AlertCard
        title="Отрицательный баланс через 12 дней"
        description="Рекомендация: ускорить дебиторку или перенести платежи"
        badgeText="Критично"
        status="danger"
        estimate="Оценка дефицита: —"
        primaryAction={{ label: "План действий →" }}
        secondaryAction={{ label: "Спросить ИИ" }}
        icon="⚡"
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Денежный поток"
          description="Доходы, расходы и баланс по месяцам"
          legend={
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-400/70" />
                <span className="text-[12px] text-zinc-400">Доходы</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-zinc-500/50" />
                <span className="text-[12px] text-zinc-400">Расходы</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-400/60" />
                <span className="text-[12px] text-zinc-400">Баланс</span>
              </div>
            </div>
          }
        >
          <div className="h-52 flex items-end gap-3">
            {cashFlowData.map((item, i) => {
              const maxValue = Math.max(...cashFlowData.map(d => Math.max(d.income, d.expense)));
              const incomeHeight = (item.income / maxValue) * 100;
              const expenseHeight = (item.expense / maxValue) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 h-36 items-end">
                    <div
                      className="flex-1 rounded-t-md transition-all hover:opacity-100"
                      style={{
                        background: "#34d399",
                        opacity: 0.8,
                        height: `${incomeHeight}%`,
                      }}
                      title={`Доходы: ${item.income}к ₽`}
                    />
                    <div
                      className="flex-1 rounded-t-md transition-all hover:opacity-60"
                      style={{
                        background: "#94a3b8",
                        opacity: 0.4,
                        height: `${expenseHeight}%`,
                      }}
                      title={`Расходы: ${item.expense}к ₽`}
                    />
                  </div>
                  <span className="text-[12px] text-zinc-500 mt-2">{item.month}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ReceivablesList
          items={debtors}
          overdueTotal={overdueDebt}
        />
      </div>

      {/* Transactions */}
        <TransactionsList
          items={transactions}
          activeFilter={transactionFilter}
          onFilterChange={setTransactionFilter}
        />
      </div>
    </PageLayout>
  );
}
