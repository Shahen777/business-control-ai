import { useState } from "react";
import { Chip } from "@/components/design-system/Chip";
import { Button } from "@/components/Button";

export interface ReceivableItem {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
}

interface ReceivablesListProps {
  items: ReceivableItem[];
  overdueTotal: number;
  bulkOptions?: { label: string; onClick?: () => void }[];
}

const getOverdueVariant = (days: number) => {
  if (days > 30) return "critical";
  if (days >= 8) return "danger";
  if (days > 0) return "warning";
  return "success";
};

/**
 * ReceivablesList — список дебиторки с быстрыми действиями
 */
export function ReceivablesList({ items, overdueTotal, bulkOptions }: ReceivablesListProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="rounded-xl p-5 bg-zinc-800/30 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold text-white">Дебиторская задолженность</h3>
        <span className="text-[12px] text-amber-300 tabular-nums">
          {(overdueTotal / 1000).toFixed(0)}к ₽ просрочено
        </span>
      </div>
      <div className="space-y-3">
        {items.map((debtor) => (
          <div
            key={debtor.id}
            className="flex items-center gap-4 p-3 rounded-[10px] border border-zinc-700/40 bg-zinc-900/40"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-white truncate">{debtor.name}</p>
              <div className="flex items-center gap-2 text-[12px] text-zinc-400 mt-1">
                <span>до {debtor.dueDate}</span>
                {debtor.overdueDays > 0 && (
                  <Chip variant={getOverdueVariant(debtor.overdueDays)}>
                    просрочка {debtor.overdueDays} дн.
                  </Chip>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-semibold text-white tabular-nums">
                {(debtor.amount / 1000).toFixed(0)}к ₽
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">Напомнить</Button>
              <Button size="sm" variant="ghost">Создать задачу</Button>
              <Button size="sm" variant="ghost">Позвонить</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end">
        <div className="relative">
          <Button size="sm" variant="secondary" onClick={() => setIsMenuOpen((v) => !v)}>
            Отправить напоминания →
          </Button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-[10px] border border-zinc-700/60 bg-zinc-900 shadow-lg z-20">
              <div className="p-2">
                {(bulkOptions ?? [
                  { label: "Всем" },
                  { label: "Только просроченным" },
                ]).map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      option.onClick?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-zinc-300 hover:bg-zinc-800/70"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
