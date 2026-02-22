interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Прогресс-бар
 */
export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantStyles = {
    default: "bg-indigo-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  // Автоматическое определение цвета на основе значения
  const autoVariant =
    percentage >= 70 ? "success" : percentage >= 40 ? "warning" : "danger";
  const barColor = variant === "default" ? variantStyles.default : variantStyles[variant];

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400 text-sm">Прогресс</span>
          <span className="text-gray-300 text-sm">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-700 rounded-full ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
