import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * Базовая карточка
 */
export function Card({ children, className = "", onClick, selected }: CardProps) {
  const baseStyles = "bg-zinc-800 rounded-xl border transition";
  const borderStyles = selected ? "border-indigo-500" : "border-zinc-700";
  const hoverStyles = onClick ? "cursor-pointer hover:border-zinc-600" : "";

  return (
    <div
      className={`${baseStyles} ${borderStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
}

/**
 * Карточка со статистикой
 */
export function StatCard({ label, value, subtext, trend, trendValue, icon }: StatCardProps) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-gray-400 text-sm mb-1">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
          {(subtext || trendValue) && (
            <div className={`text-sm mt-2 ${trend ? trendColors[trend] : "text-gray-400"}`}>
              {trend && <span>{trendIcons[trend]} </span>}
              {trendValue || subtext}
            </div>
          )}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </Card>
  );
}

export default Card;
