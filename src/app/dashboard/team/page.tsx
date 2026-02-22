"use client";

import { useState, useEffect } from "react";
import { getEmployees } from "@/lib/mockEmployees";
import { Employee, statusConfig as empStatusConfig, roleConfig, departmentConfig, EmployeeStatus, EmployeeDepartment } from "@/types/employees";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";
import { Button } from "@/components/Button";

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<'all' | EmployeeStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesFilter = filter === 'all' || emp.status === filter;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (emp.role && roleConfig[emp.role]?.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const availableCount = employees.filter(e => e.status === 'available').length;
  const busyCount = employees.filter(e => e.status === 'busy').length;
  const overloadedCount = employees.filter(e => e.status === 'overloaded').length;
  const inactiveCount = employees.filter(e => e.status === 'inactive').length;

  // Группировка по отделам
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean))) as EmployeeDepartment[];

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Команда"
          subtitle="Управление сотрудниками компании"
          actions={
            <Button variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить сотрудника
            </Button>
          }
        />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Всего сотрудников</p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">{employees.length}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Свободны</p>
          <p className="text-2xl font-semibold text-[var(--accent-green)]">{availableCount}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Заняты</p>
          <p className="text-2xl font-semibold text-[var(--accent-blue)]">{busyCount}</p>
        </div>
        <div className="p-5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Перегружены</p>
          <p className="text-2xl font-semibold text-[var(--accent-amber)]">{overloadedCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Поиск по имени..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            {[
              { key: 'all', label: 'Все' },
              { key: 'available', label: `Свободны (${availableCount})` },
              { key: 'busy', label: `Заняты (${busyCount})` },
              { key: 'overloaded', label: `Перегружены (${overloadedCount})` },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: filter === item.key ? 'var(--bg-tertiary)' : 'transparent',
                  color: filter === item.key ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employees by Department */}
      {departments.map(dept => {
        const deptEmployees = filteredEmployees.filter(e => e.department === dept);
        if (deptEmployees.length === 0) return null;
        
        return (
          <div key={dept} className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {departmentConfig[dept]?.label || dept}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {deptEmployees.map((emp) => {
                const status = empStatusConfig[emp.status];
                const role = emp.role ? roleConfig[emp.role] : null;
                return (
                  <div 
                    key={emp.id}
                    className="p-5 rounded-xl transition-all hover:tranzinc-y-[-1px] cursor-pointer"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0"
                        style={{ 
                          background: `linear-gradient(135deg, ${status.color}40, ${status.color}20)`,
                          color: status.color
                        }}
                      >
                        {emp.avatarInitials || emp.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base font-semibold text-[var(--text-primary)]">{emp.name}</h3>
                          <span 
                            className="px-2.5 py-1 rounded-md text-xs font-medium"
                            style={{ background: status.bgColor, color: status.color }}
                          >
                            {status.label}
                          </span>
                        </div>
                        
                        {role && (
                          <p className="text-sm text-[var(--text-muted)] mb-3">{role.label}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                          {emp.phone && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{emp.phone}</span>
                            </div>
                          )}
                          {emp.email && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{emp.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">Сотрудники не найдены</p>
        </div>
      )}
      </div>
    </PageLayout>
  );
}
