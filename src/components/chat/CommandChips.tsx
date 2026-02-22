"use client";

import React from "react";
import { QuickChip, quickChips } from "@/lib/commandParser";

interface CommandChipsProps {
  onChipClick: (command: string) => void;
  disabled?: boolean;
}

/**
 * Быстрые подсказки для чата (chips)
 */
export function CommandChips({ onChipClick, disabled }: CommandChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3 border-t border-zinc-700 bg-zinc-800/50">
      <span className="text-xs text-zinc-500 mr-1 self-center">Быстрые команды:</span>
      {quickChips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onChipClick(chip.command)}
          disabled={disabled}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 
            text-xs font-medium rounded-full
            transition-all duration-200
            ${disabled 
              ? "bg-zinc-700 text-zinc-500 cursor-not-allowed" 
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white active:scale-95"
            }
          `}
        >
          <span>{chip.icon}</span>
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}

export default CommandChips;
