"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "./Dialog";
import { Decision, DecisionPriority } from "@/types/decisions";

interface DecisionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (decision: Partial<Decision>) => void;
  decision?: Decision | null;
  mode: "create" | "edit";
}

/**
 * Диалог создания/редактирования решения
 */
export function DecisionDialog({ isOpen, onClose, onSave, decision, mode }: DecisionDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium" as DecisionPriority,
    department: "",
    reason: "",
    effect: "",
    impactRub: "",
    nextStepText: "",
    nextStepDeadline: "7 дней",
  });
  
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && decision) {
        setFormData({
          title: decision.title,
          priority: decision.priority,
          department: decision.department || "",
          reason: decision.reason,
          effect: decision.effect,
          impactRub: decision.impactRub?.toString() || "",
          nextStepText: decision.nextStep?.text || "",
          nextStepDeadline: decision.nextStep?.deadline || "7 дней",
        });
      } else {
        setFormData({
          title: "",
          priority: "medium",
          department: "",
          reason: "",
          effect: "",
          impactRub: "",
          nextStepText: "",
          nextStepDeadline: "7 дней",
        });
      }
    }
  }, [isOpen, mode, decision]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      title: formData.title,
      priority: formData.priority,
      department: formData.department || undefined,
      reason: formData.reason,
      effect: formData.effect,
      impactRub: formData.impactRub ? parseInt(formData.impactRub) : undefined,
      nextStep: {
        text: formData.nextStepText || "Определить следующий шаг",
        amount: formData.impactRub ? `${parseInt(formData.impactRub).toLocaleString("ru-RU")} ₽` : "0 ₽",
        effort: "medium",
        deadline: formData.nextStepDeadline,
      },
    });
    
    onClose();
  };
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Создать решение" : "Редактировать решение"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Название решения <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Оптимизация расходов на..."
          />
        </div>
        
        {/* Приоритет и Отдел */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Приоритет
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as DecisionPriority })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="low">🟢 Низкий</option>
              <option value="medium">🟡 Средний</option>
              <option value="high">🟠 Высокий</option>
              <option value="critical">🔴 Критичный</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Отдел
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Общее</option>
              <option value="Финансы">Финансы</option>
              <option value="Операции">Операции</option>
              <option value="Продажи">Продажи</option>
              <option value="Техника">Техника</option>
              <option value="Кадры">Кадры</option>
              <option value="Снабжение">Снабжение</option>
            </select>
          </div>
        </div>
        
        {/* Причина */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Причина / Контекст <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
            rows={2}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Почему требуется решение?"
          />
        </div>
        
        {/* Эффект */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Ожидаемый эффект
          </label>
          <textarea
            value={formData.effect}
            onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Что изменится после принятия решения?"
          />
        </div>
        
        {/* Финансовый эффект */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Финансовый эффект (₽)
          </label>
          <input
            type="number"
            value={formData.impactRub}
            onChange={(e) => setFormData({ ...formData, impactRub: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="100000"
          />
        </div>
        
        {/* Следующий шаг */}
        <div className="p-3 bg-zinc-700/50 rounded-lg border border-zinc-600 space-y-3">
          <label className="block text-sm font-medium text-zinc-400">Рекомендуемое действие</label>
          
          <input
            type="text"
            value={formData.nextStepText}
            onChange={(e) => setFormData({ ...formData, nextStepText: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Что нужно сделать?"
          />
          
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.nextStepDeadline}
              onChange={(e) => setFormData({ ...formData, nextStepDeadline: e.target.value })}
              className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              placeholder="Срок: 7 дней"
            />
          </div>
        </div>
        
        {/* Кнопки */}
        <div className="flex gap-3 pt-4 border-t border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-700 text-zinc-300 rounded-lg font-medium hover:bg-zinc-600 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
          >
            {mode === "create" ? "Создать" : "Сохранить"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default DecisionDialog;
