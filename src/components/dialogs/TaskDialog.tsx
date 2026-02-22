"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "./Dialog";
import { Task, TaskPriority, TaskStatus, priorityConfig } from "@/types/tasks";
import { Employee } from "@/types/employees";
import { getEmployees } from "@/lib/mockEmployees";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null; // null = создание новой
  mode: "create" | "edit";
}

/**
 * Диалог создания/редактирования задачи
 */
export function TaskDialog({ isOpen, onClose, onSave, task, mode }: TaskDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    status: "new" as TaskStatus,
    assigneeId: "",
    dueDate: "",
    department: "",
    impactRub: "",
  });
  
  // Загрузка сотрудников
  useEffect(() => {
    setEmployees(getEmployees());
  }, []);
  
  // Инициализация формы при открытии
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          assigneeId: task.assigneeId || "",
          dueDate: task.dueDate,
          department: task.department || "",
          impactRub: task.impactRub?.toString() || "",
        });
      } else {
        // Дефолтные значения для новой задачи
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          status: "new",
          assigneeId: "",
          dueDate: defaultDate.toISOString().split("T")[0],
          department: "",
          impactRub: "",
        });
      }
    }
  }, [isOpen, mode, task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignee = employees.find(emp => emp.id === formData.assigneeId);
    
    onSave({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId || undefined,
      assigneeName: assignee?.name || "Не назначен",
      dueDate: formData.dueDate,
      department: formData.department || undefined,
      impactRub: formData.impactRub ? parseInt(formData.impactRub) : undefined,
    });
    
    onClose();
  };
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Создать задачу" : "Редактировать задачу"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Название <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Что нужно сделать?"
          />
        </div>
        
        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Дополнительные детали..."
          />
        </div>
        
        {/* Приоритет и Статус */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Приоритет
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="low">🟢 Низкий</option>
              <option value="medium">🟡 Средний</option>
              <option value="high">🟠 Высокий</option>
              <option value="critical">🔴 Критичный</option>
            </select>
          </div>
          
          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Статус
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="blocked">Заблокирована</option>
                <option value="done">Выполнена</option>
                <option value="canceled">Отменена</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Исполнитель и Срок */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Исполнитель
            </label>
            <select
              value={formData.assigneeId}
              onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Не назначен</option>
              {employees.filter(e => e.status !== "inactive").map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Срок <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Отдел и Эффект */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Отдел
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Не указан</option>
              <option value="Финансы">Финансы</option>
              <option value="Операции">Операции</option>
              <option value="Продажи">Продажи</option>
              <option value="Руководство">Руководство</option>
              <option value="Снабжение">Снабжение</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Финансовый эффект (₽)
            </label>
            <input
              type="number"
              value={formData.impactRub}
              onChange={(e) => setFormData({ ...formData, impactRub: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              placeholder="0"
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

export default TaskDialog;
