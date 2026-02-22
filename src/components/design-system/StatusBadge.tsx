import { ReactNode } from "react";
import { Chip } from "@/components/design-system/Chip";

interface StatusBadgeProps {
  status: "success" | "danger" | "warning" | "info";
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Бейдж статуса: для обозначения состояния (Работает/Простой/ТО/Средне)
 */
export function StatusBadge({
  status,
  children,
  size = "sm",
  className = "",
}: StatusBadgeProps) {
  return (
    <Chip variant={status} size={size} className={`font-semibold ${className}`}>
      {children}
    </Chip>
  );
}
