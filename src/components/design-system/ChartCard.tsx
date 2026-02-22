import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  legend?: ReactNode;
  children: ReactNode;
}

/**
 * ChartCard — карточка для графиков/аналитики
 */
export function ChartCard({ title, description, actions, legend, children }: ChartCardProps) {
  return (
    <div className="rounded-xl p-5 bg-zinc-900/60 border border-white/[0.06]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          {description && <p className="text-[12px] text-zinc-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div>{children}</div>
      {legend && <div className="mt-4 pt-4 border-t border-white/[0.06]">{legend}</div>}
    </div>
  );
}
