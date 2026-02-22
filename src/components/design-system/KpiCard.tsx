import { ReactNode } from "react";

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  secondary?: string;
  badge?: ReactNode;
  status?: "success" | "warning" | "danger" | "neutral";
  className?: string;
}

/**
 * KPI карточка: иконка + лейбл + крупное значение + тренд
 * Используется для метрик на любых страницах
 */
export function KpiCard({
  icon,
  label,
  value,
  secondary,
  badge,
  status = "neutral",
  className = "",
}: KpiCardProps) {
  const statusColors = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400",
    neutral: "text-blue-400",
  };

  return (
    <div
      className={`
        rounded-xl p-5 bg-zinc-900/60 border border-white/[0.06]
        hover:bg-zinc-900/80 hover:border-white/[0.1]
        transition-all duration-200 min-h-[140px] flex flex-col
        ${className}
      `}
    >
      {/* Иконка + Лейбл */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-zinc-500 text-[13px] font-medium uppercase tracking-wide">
            {label}
          </p>
          {badge}
        </div>
        <div className={`p-2 rounded-lg bg-zinc-800/40 ${statusColors[status]}`}>
          {icon}
        </div>
      </div>

      {/* Крупное значение */}
      <p
        className="text-white text-[32px] font-bold tracking-tight mb-auto"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </p>

      {/* Вторичная информация (тренд/пояснение) */}
      {secondary && (
        <p className={`text-[12px] font-medium mt-2 ${statusColors[status]}`}>
          {secondary}
        </p>
      )}
    </div>
  );
}
