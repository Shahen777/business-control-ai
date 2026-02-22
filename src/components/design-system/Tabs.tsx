import { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  items: TabItem[];
  className?: string;
}

/**
 * Tabs — переключатель периода/сегмента
 */
export function Tabs({ value, onChange, items, className = "" }: TabsProps) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full bg-zinc-900/60 border border-white/[0.06] p-1 ${className}`}
    >
      {items.map((item) => {
        const isActive = value === item.value;
        const isDisabled = item.disabled;

        return (
          <button
            key={item.value}
            onClick={() => !isDisabled && onChange(item.value)}
            disabled={isDisabled}
            className={`
              px-3 py-1.5 rounded-full text-[13px] font-medium transition-all
              ${isActive ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}
              ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-zinc-400" : ""}
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
