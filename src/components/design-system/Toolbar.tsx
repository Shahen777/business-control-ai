import { ReactNode } from "react";
import { Tabs } from "@/components/design-system/Tabs";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Toolbar контейнер для фильтров, сортировки, поиска
 * Содержит Tabs, Select, Toggle в одном компактном месте
 */
export function Toolbar({ children, className = "" }: ToolbarProps) {
  return (
    <div
      className={`
        flex flex-wrap items-center gap-3 p-4 mb-6
        rounded-xl bg-zinc-900/40 border border-white/[0.06]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Вспомогательные компоненты для Toolbar

interface TabItem {
  value: string;
  label: string;
}

interface ToolbarTabsProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabItem[];
}

export function ToolbarTabs({ value, onChange, tabs }: ToolbarTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      items={tabs}
      className="bg-zinc-900/50"
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
}

export function ToolbarSelect({
  value,
  onChange,
  options,
  label,
}: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-[13px] text-zinc-400">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          px-3 py-1.5 rounded-[10px] text-[13px] font-medium
          bg-zinc-900/60 border border-white/[0.06]
          text-zinc-300 hover:border-white/[0.1]
          transition-colors cursor-pointer outline-none
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToolbarToggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 checked:bg-indigo-600 accent-indigo-500"
      />
      <span className="text-[13px] text-zinc-400">{label}</span>
    </label>
  );
}
