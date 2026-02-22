import { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "critical" | "info";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Chip — компактный бейдж/фильтр с округлением 999px
 */
export function Chip({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: ChipProps) {
  const variantStyles = {
    neutral: "bg-zinc-800/50 text-zinc-300 border-zinc-700/40",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    danger: "bg-red-500/15 text-red-300 border-red-500/30",
    critical: "bg-red-600/20 text-red-200 border-red-500/40",
    info: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-[12px]",
    md: "px-3 py-1.5 text-[13px]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
