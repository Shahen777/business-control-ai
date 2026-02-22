import { ReactNode } from "react";

interface TimelineItemProps {
  icon: ReactNode;
  time?: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Элемент временной линии: иконка + время + заголовок + описание
 * Для отображения события вместо логов
 */
export function TimelineItem({
  icon,
  time,
  title,
  description,
  className = "",
}: TimelineItemProps) {
  return (
    <div className={`flex gap-4 pb-4 border-l border-zinc-700/50 pl-4 ml-2 last:border-0 ${className}`}>
      {/* Иконка */}
      <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
        {icon}
      </div>

      {/* Контент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[14px] font-medium text-white">{title}</p>
          {time && <p className="text-[12px] text-zinc-500">{time}</p>}
        </div>
        {description && (
          <p className="text-[13px] text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  );
}
