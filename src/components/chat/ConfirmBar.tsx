"use client";

import React from "react";

interface ConfirmBarProps {
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Панель подтверждения действия
 */
export function ConfirmBar({ 
  onConfirm, 
  onCancel, 
  disabled,
  confirmText = "Подтвердить",
  cancelText = "Отменить"
}: ConfirmBarProps) {
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-600">
      <button
        onClick={onConfirm}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-2
          px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200
          ${disabled 
            ? "bg-zinc-600 text-zinc-400 cursor-not-allowed" 
            : "bg-green-600 text-white hover:bg-green-500 active:scale-98"
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        {confirmText}
      </button>
      <button
        onClick={onCancel}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-2
          px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200
          ${disabled 
            ? "bg-zinc-600 text-zinc-400 cursor-not-allowed" 
            : "bg-zinc-600 text-zinc-300 hover:bg-zinc-500 active:scale-98"
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        {cancelText}
      </button>
    </div>
  );
}

export default ConfirmBar;
