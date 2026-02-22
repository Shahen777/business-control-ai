import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { Chip } from "@/components/design-system/Chip";

interface EquipmentCardProps {
  id: number;
  name: string;
  status: "working" | "idle" | "maintenance" | "transit";
  utilizationPercent: number;
  location: string;
  operator: string;
  hoursToday: number;
  hoursWeek: number;
  hoursMonth: number;
  revenueThisMonth: number;
}

/**
 * Карточка техники: компактная структура с метриками в одну строку
 */
export function EquipmentCard({
  id,
  name,
  status,
  utilizationPercent,
  location,
  operator,
  hoursToday,
  hoursWeek,
  hoursMonth,
  revenueThisMonth,
}: EquipmentCardProps) {
  const statusConfig = {
    working: { badge: "success", label: "Работает" },
    idle: { badge: "warning", label: "Простой" },
    maintenance: { badge: "danger", label: "ТО" },
    transit: { badge: "info", label: "В пути" },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/dashboard/operations/equipment/${id}`}>
      <div className="group rounded-xl p-4 bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600/70 transition-all duration-200 cursor-pointer">
        {/* Header: Название + Статус + Процент */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {name}
            </h3>
          </div>
          <Chip variant={config.badge as any}>{config.label}</Chip>
          <span className="text-[14px] font-bold text-white ml-3">
            {utilizationPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <ProgressBar value={utilizationPercent} />
        </div>

        {/* Meta: Объект, Оператор */}
        <div className="space-y-1 mb-3 text-[12px] text-zinc-400">
          <p>📍 {location}</p>
          <p>👤 {operator}</p>
        </div>

        {/* Metrics: Часы в одну строку */}
        <div className="flex items-center gap-4 text-[12px] text-zinc-500 mb-2 pb-2 border-b border-zinc-700/30">
          <span>⏱ Сегодня: {hoursToday}ч</span>
          <span>📅 Неделя: {hoursWeek}ч</span>
          <span>📆 Месяц: {hoursMonth}ч</span>
        </div>

        {/* Выручка */}
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-500">💰 Выручка месяца:</span>
          <span
            className="font-semibold text-white"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {(revenueThisMonth / 1000).toFixed(0)}к ₽
          </span>
        </div>
      </div>
    </Link>
  );
}
