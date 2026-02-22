import { ReactNode } from "react";
import { Button } from "@/components/Button";
import { Chip } from "@/components/design-system/Chip";

interface AlertCardProps {
  title: string;
  description: string;
  status?: "warning" | "danger" | "info" | "success";
  badgeText?: string;
  estimate?: string;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  icon?: ReactNode;
}

/**
 * AlertCard — акцентный блок с рекомендацией и CTA
 */
export function AlertCard({
  title,
  description,
  status = "warning",
  badgeText,
  estimate,
  primaryAction,
  secondaryAction,
  icon,
}: AlertCardProps) {
  const statusStyles = {
    warning: "bg-amber-500/10 border-amber-500/30",
    danger: "bg-red-500/10 border-red-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
    success: "bg-emerald-500/10 border-emerald-500/30",
  };

  return (
    <div className={`rounded-xl p-5 border ${statusStyles[status]}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-center text-lg">
          {icon ?? "⚠️"}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
            {badgeText && <Chip variant={status === "danger" ? "danger" : status}>{badgeText}</Chip>}
          </div>
          <p className="text-[13px] text-zinc-400">{description}</p>
          <p className="text-[12px] text-zinc-500">{estimate ?? "Оценка дефицита: —"}</p>
        </div>
        <div className="flex items-center gap-2">
          {primaryAction && (
            <Button size="sm" variant="primary" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
