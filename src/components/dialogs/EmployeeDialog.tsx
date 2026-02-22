"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "./Dialog";
import { Employee, EmployeeRole, EmployeeStatus, EmployeeDepartment, roleConfig, departmentConfig } from "@/types/employees";

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  employee?: Employee | null;
  mode: "create" | "edit";
}

/**
 * Диалог создания/редактирования сотрудника
 */
export function EmployeeDialog({ isOpen, onClose, onSave, employee, mode }: EmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "manager" as EmployeeRole,
    department: "operations" as EmployeeDepartment,
    status: "available" as EmployeeStatus,
    phone: "",
    telegram: "",
    email: "",
    costPerMonthRub: "",
  });
  
  // Инициализация формы
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && employee) {
        setFormData({
          name: employee.name,
          role: employee.role,
          department: employee.department || "operations",
          status: employee.status,
          phone: employee.phone || "",
          telegram: employee.telegram || "",
          email: employee.email || "",
          costPerMonthRub: employee.costPerMonthRub?.toString() || "",
        });
      } else {
        setFormData({
          name: "",
          role: "manager",
          department: "operations",
          status: "available",
          phone: "",
          telegram: "",
          email: "",
          costPerMonthRub: "",
        });
      }
    }
  }, [isOpen, mode, employee]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name: formData.name,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      phone: formData.phone || undefined,
      telegram: formData.telegram || undefined,
      email: formData.email || undefined,
      costPerMonthRub: formData.costPerMonthRub ? parseInt(formData.costPerMonthRub) : undefined,
    });
    
    onClose();
  };
  
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Добавить сотрудника" : "Редактировать сотрудника"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ФИО */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            ФИО <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Иванов Иван Иванович"
          />
        </div>
        
        {/* Роль и Отдел */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Роль <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as EmployeeRole })}
              required
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              {Object.entries(roleConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Отдел
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as EmployeeDepartment })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              {Object.entries(departmentConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Статус */}
        {mode === "edit" && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="available">✅ Свободен</option>
              <option value="busy">🔵 Занят</option>
              <option value="overloaded">🟠 Перегружен</option>
              <option value="inactive">⚫ Неактивен</option>
            </select>
          </div>
        )}
        
        {/* Контакты */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-400">Контакты</label>
          
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Телефон: +7 (999) 123-45-67"
          />
          
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Email: example@company.ru"
          />
          
          <input
            type="text"
            value={formData.telegram}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="Telegram: @username"
          />
        </div>
        
        {/* Зарплата */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Оклад (₽/мес)
          </label>
          <input
            type="number"
            value={formData.costPerMonthRub}
            onChange={(e) => setFormData({ ...formData, costPerMonthRub: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            placeholder="80000"
          />
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
            {mode === "create" ? "Добавить" : "Сохранить"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default EmployeeDialog;
