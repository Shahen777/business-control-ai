"use client";

import { useState, useEffect } from "react";
import { getEmployees } from "@/lib/mockEmployees";
import { Employee, statusConfig as empStatusConfig, roleConfig, departmentConfig } from "@/types/employees";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.role && roleConfig[emp.role]?.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (emp.department && departmentConfig[emp.department]?.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const employee = selectedEmployee 
    ? employees.find(e => e.id === selectedEmployee) 
    : null;

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">организация / люди</p>
        <PageHeader
          title="Сотрудники"
          subtitle="Управление командой: контакты, должности, графики и задачи"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить
            </Button>
          }
        />
        <div className="border-b border-zinc-700/50" />

      <div className="flex gap-10">
        {/* Employee List */}
        <div className="w-96 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-8">
            <svg className="absolute left-4 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Поиск по имени или должности..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-[10px] text-sm transition border border-zinc-800/80 bg-zinc-900/60 text-white placeholder-zinc-500 focus:border-indigo-500/40 focus:outline-none focus:ring-0"
            />
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-3">
            {filteredEmployees.map((emp) => {
              const status = empStatusConfig[emp.status];
              const role = emp.role ? roleConfig[emp.role] : null;
              const isSelected = selectedEmployee === emp.id;
              
              return (
                <div 
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp.id)}
                  className="group relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all duration-200 border border-zinc-800/80 hover:border-zinc-700/80 hover:shadow-[0_8px_24px_-12px_rgba(99,102,241,0.15)]"
                  style={{ 
                    background: isSelected ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))' : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? 'rgba(99,102,241,0.4)' : undefined,
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_50%)] opacity-0 group-hover:opacity-100 transition duration-300" aria-hidden />
                  
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-white/10"
                      style={{ 
                        background: `linear-gradient(135deg, ${status.color}25, ${status.color}10)`,
                        color: status.color
                      }}
                    >
                      {emp.avatarInitials || emp.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white leading-tight truncate">{emp.name}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed truncate mt-0.5">{role?.label || 'Должность не указана'}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: status.color }}
                        />
                        <span className="text-xs text-zinc-500 font-medium">{status.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Details */}
        <div className="flex-1">
          {employee ? (
            <div className="rounded-2xl p-8 border border-zinc-800/80 bg-gradient-to-br from-zinc-900/70 via-zinc-900/80 to-zinc-950/70">
              {/* Header */}
              <div className="flex items-start gap-6 mb-10 pb-8" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0 border border-white/10"
                  style={{ 
                    background: `linear-gradient(135deg, ${empStatusConfig[employee.status].color}30, ${empStatusConfig[employee.status].color}15)`,
                    color: empStatusConfig[employee.status].color
                  }}
                >
                  {employee.avatarInitials || employee.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="text-2xl font-semibold text-white leading-tight">{employee.name}</h2>
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/20"
                      style={{ 
                        background: `${empStatusConfig[employee.status].color}20`, 
                        color: empStatusConfig[employee.status].color 
                      }}
                    >
                      {empStatusConfig[employee.status].label}
                    </span>
                  </div>
                  {employee.role && (
                    <p className="text-zinc-300 font-medium text-base mb-1.5">{roleConfig[employee.role].label}</p>
                  )}
                  {employee.department && (
                    <p className="text-sm text-zinc-400 leading-relaxed">{departmentConfig[employee.department].label}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:border-zinc-700 hover:bg-white/10 hover:text-white">Редактировать</button>
                  <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-3 py-2 transition hover:border-zinc-700 hover:bg-white/10">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white mb-5">Контактные данные</h3>
                  <div className="space-y-4">
                    {employee.phone && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5 border border-white/10">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-1.5">Телефон</p>
                          <p className="text-sm font-medium text-white leading-relaxed">{employee.phone}</p>
                        </div>
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5 border border-white/10">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-1.5">Email</p>
                          <p className="text-sm font-medium text-white leading-relaxed break-all">{employee.email}</p>
                        </div>
                      </div>
                    )}
                    {employee.telegram && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5 border border-white/10">
                          <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.17.325.015.093.034.305.019.471z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 mb-1.5">Telegram</p>
                          <p className="text-sm font-medium text-white leading-relaxed">{employee.telegram}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white mb-5">Информация о работе</h3>
                  <div className="space-y-4">
                    {employee.department && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">Отдел</span>
                        <span className="text-sm font-medium text-white">{departmentConfig[employee.department].label}</span>
                      </div>
                    )}
                    {employee.costPerMonthRub !== undefined && employee.costPerMonthRub > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">Оплата в месяц</span>
                        <span className="text-sm font-medium text-emerald-300">{employee.costPerMonthRub.toLocaleString()} ₽</span>
                      </div>
                    )}
                    {employee.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">В системе с</span>
                        <span className="text-sm font-medium text-white">{new Date(employee.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 pt-8" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-white/10 hover:text-white flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Назначить задачу
                </button>
                <button className="rounded-lg border border-zinc-800/80 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-white/10 hover:text-white flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Задачи
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="rounded-2xl p-16 text-center h-full flex flex-col items-center justify-center border border-zinc-800/80 bg-gradient-to-br from-zinc-900/50 via-zinc-900/60 to-zinc-950/60"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-white/5 border border-white/10">
                <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-zinc-400 text-base leading-relaxed max-w-sm">Выберите сотрудника из списка для просмотра контактной информации и истории работы</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
