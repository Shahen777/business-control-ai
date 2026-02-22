import { StatusBadge } from "./StatusBadge";
import { Chip } from "@/components/design-system/Chip";
import { Button } from "@/components/Button";

interface DecisionCardProps {
  id: number;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  agent: "Finance AI" | "Operations AI" | "Business AI";
  impactRub?: number;
  cost?: number;
  effort?: string;
  risks?: string[];
  timeline?: string;
  status: "pending" | "accepted" | "rejected";
  onAccept?: () => void;
  onReject?: () => void;
}

/**
 * Карточка рекомендации AI: приоритет + агент + описание + финансовый эффект
 */
export function DecisionCard({
  id,
  title,
  description,
  priority,
  agent,
  impactRub,
  cost,
  effort,
  risks,
  timeline,
  status,
  onAccept,
  onReject,
}: DecisionCardProps) {
  const priorityConfig = {
    critical: { badge: "danger", icon: "🔴" },
    high: { badge: "warning", icon: "🟠" },
    medium: { badge: "info", icon: "🔵" },
    low: { badge: "info", icon: "⚪" },
  };

  const config = priorityConfig[priority];

  return (
    <div className="rounded-xl p-6 bg-zinc-900/60 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200">
      {/* Header: Badge + Agent + Status */}
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={config.badge as any}>
          {`${config.icon} ${priority.charAt(0).toUpperCase() + priority.slice(1)}`}
        </StatusBadge>
        <Chip variant="neutral">{agent}</Chip>
        {status === "accepted" && (
          <div className="ml-auto">
            <Chip variant="success">✓ Принято</Chip>
          </div>
        )}
        {status === "rejected" && (
          <div className="ml-auto">
            <Chip variant="danger">✗ Отклонено</Chip>
          </div>
        )}
      </div>

      {/* Title + Description */}
      <h3 className="text-[16px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[14px] text-zinc-400 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Divider */}
      <div className="border-b border-zinc-700/30 mb-4" />

      {/* Effects Box */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-[10px] bg-zinc-900/60 border border-white/[0.04]">
        {impactRub !== undefined && (
          <div>
            <p className="text-[12px] text-zinc-500 mb-1">Ожидаемый эффект</p>
            <p className="text-[16px] font-bold text-emerald-400" style={{ fontVariantNumeric: "tabular-nums" }}>
              +{(impactRub / 1000).toFixed(0)}к ₽
            </p>
          </div>
        )}
        {cost !== undefined && (
          <div>
            <p className="text-[12px] text-zinc-500 mb-1">Примерная стоимость</p>
            <p className="text-[16px] font-bold text-blue-400" style={{ fontVariantNumeric: "tabular-nums" }}>
              {(cost / 1000).toFixed(0)}к ₽
            </p>
          </div>
        )}
      </div>

      {/* Risks (if any) */}
      {risks && risks.length > 0 && (
        <div className="mb-4">
          <p className="text-[13px] font-medium text-zinc-400 mb-2">Риски:</p>
          <div className="flex flex-wrap gap-1.5">
            {risks.map((risk, i) => (
              <Chip key={i} variant="warning">
                • {risk}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {timeline && (
        <div className="mb-4 flex items-center gap-2 text-[13px] text-zinc-400">
          <span>⏱ {timeline}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-b border-zinc-700/30 mb-4" />

      {/* Actions */}
      {status === "pending" && (
        <div className="flex items-center gap-2">
          <Button size="md" variant="primary" className="flex-1" onClick={onAccept}>
            ✓ Принять
          </Button>
          <Button size="md" variant="secondary" className="flex-1" onClick={onReject}>
            Отклонить
          </Button>
        </div>
      )}
    </div>
  );
}
