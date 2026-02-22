import { Chip } from "@/components/design-system/Chip";
import { Button } from "@/components/Button";

export interface TransactionItem {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
}

interface TransactionsListProps {
  items: TransactionItem[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

const categoryIcon: Record<string, string> = {
  Проекты: "🏗️",
  Зарплата: "👥",
  Техника: "🚜",
  Материалы: "🧱",
};

/**
 * TransactionsList — список операций с фильтрами
 */
export function TransactionsList({ items, activeFilter, onFilterChange }: TransactionsListProps) {
  const filters = ["Все", "Доходы", "Расходы", "Проекты", "Зарплата", "Материалы", "Техника"];

  return (
    <div className="rounded-xl p-5 bg-zinc-800/30 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold text-white">Последние операции</h3>
        <Button size="sm" variant="ghost">Все операции →</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button key={filter} onClick={() => onFilterChange(filter)}>
            <Chip variant={activeFilter === filter ? "info" : "neutral"}>{filter}</Chip>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-4 p-3 rounded-[10px] border border-zinc-700/40 bg-zinc-900/40"
          >
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-zinc-800/60 text-[16px]">
              {categoryIcon[tx.category] ?? "💳"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-white truncate">{tx.description}</p>
              <p className="text-[12px] text-zinc-400">{tx.category} • {tx.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-zinc-500">{tx.type === "income" ? "↘" : "↗"}</span>
              <p
                className={`text-[14px] font-semibold tabular-nums ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {tx.amount >= 0 ? "+" : "-"}{Math.abs(tx.amount / 1000).toFixed(0)}к ₽
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
