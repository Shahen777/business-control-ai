import { ReactNode } from "react";

interface StyledCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: "default" | "elevated" | "outlined";
}

/**
 * Универсальная карточка с единым стилем: border, padding, radius
 * Может быть интерактивной (hover эффект) или статичной
 */
export function StyledCard({
  children,
  className = "",
  interactive = true,
  variant = "default",
}: StyledCardProps) {
  const variantStyles = {
    default: "bg-zinc-800/30 border border-zinc-700/50",
    elevated: "bg-zinc-800/50 border border-zinc-600/50",
    outlined: "bg-transparent border border-zinc-700/50",
  };

  const interactiveStyles = interactive
    ? "hover:bg-zinc-800/50 hover:border-zinc-600/70 transition-all duration-200"
    : "";

  return (
    <div
      className={`
        rounded-xl p-5
        ${variantStyles[variant]}
        ${interactiveStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
