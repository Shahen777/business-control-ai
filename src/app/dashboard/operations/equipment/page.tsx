"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  mockEquipmentUtilization,
  mockOperationsDashboard,
  mockOperationEvents,
} from "@/lib/mockOperations";
import { KpiCard } from "@/components/design-system/KpiCard";
import { EquipmentCard } from "@/components/design-system/EquipmentCard";
import { Toolbar, ToolbarTabs, ToolbarSelect } from "@/components/design-system/Toolbar";
import { TimelineItem } from "@/components/design-system/TimelineItem";
import { AlertCard } from "@/components/design-system/AlertCard";
import { Button } from "@/components/Button";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

const formatMoney = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1000000) return `${(amount / 1000000).toFixed(1)} млн ₽`;
  if (abs >= 1000) return `${(amount / 1000).toFixed(0)}к ₽`;
  return `${amount} ₽`;
};

type SortField = 'name' | 'utilization' | 'revenue' | 'hours';
type FilterStatus = 'all' | 'working' | 'idle' | 'maintenance';

export default function EquipmentUtilizationPage() {
  const [sortBy, setSortBy] = useState<SortField>('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  const dashboard = mockOperationsDashboard;
  
  // Фильтрация и сортировка
  const filteredEquipment = useMemo(() => {
    let result = [...mockEquipmentUtilization];
    
    // Фильтр по статусу
    if (filterStatus !== 'all') {
      result = result.filter(eq => eq.status === filterStatus);
    }
    
    // Сортировка
    result.sort((a, b) => {
      let valueA: number | string, valueB: number | string;
      
      switch (sortBy) {
        case 'name':
          valueA = a.equipmentName;
          valueB = b.equipmentName;
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        case 'utilization':
          valueA = a.utilizationPercent;
          valueB = b.utilizationPercent;
          break;
        case 'revenue':
          valueA = a.revenueThisMonth;
          valueB = b.revenueThisMonth;
          break;
        case 'hours':
          valueA = a.hoursThisMonth;
          valueB = b.hoursThisMonth;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return result;
  }, [sortBy, sortOrder, filterStatus]);
  
  // События по технике
  const equipmentEvents = useMemo(() => {
    return mockOperationEvents.filter(e => 
      e.type.startsWith('equipment_')
    ).slice(0, 5);
  }, []);
  
  // Расчёт общих показателей
  const totalRevenue = mockEquipmentUtilization.reduce((sum, eq) => sum + eq.revenueThisMonth, 0);
  const totalHours = mockEquipmentUtilization.reduce((sum, eq) => sum + eq.hoursThisMonth, 0);
  
  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Загрузка техники"
          subtitle="Анализ использования и эффективности техники"
          actions={
            <div className="flex items-center gap-2 text-[13px] text-zinc-400">
              <Link href="/dashboard/operations" className="hover:text-white">
                Операции
              </Link>
              <span>/</span>
              <span className="text-zinc-300">Загрузка техники</span>
            </div>
          }
        />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard
          icon="🏗️"
          label="Всего техники"
          value={dashboard.totalEquipment}
          status="neutral"
        />
        <KpiCard
          icon="✅"
          label="Работает"
          value={dashboard.workingEquipment}
          status="success"
        />
        <KpiCard
          icon="📊"
          label="Ср. загрузка"
          value={`${dashboard.avgUtilization}%`}
          status="neutral"
        />
        <KpiCard
          icon="💰"
          label="Выручка / мес"
          value={formatMoney(totalRevenue)}
          status="success"
        />
        <KpiCard
          icon="⏱"
          label="Часов / мес"
          value={totalHours.toString()}
          status="neutral"
        />
      </div>

      {/* Warning */}
      {dashboard.idleEquipment > 0 && (
        <AlertCard
          title={`${dashboard.idleEquipment} единиц техники простаивает`}
          description="Рекомендация: пересмотреть загрузку и перераспределить технику"
          badgeText="Внимание"
          status="warning"
          estimate={`Оценка потерь: ${formatMoney(dashboard.idleLossesPerDay)}/день`}
          primaryAction={{ label: "План действий →" }}
          secondaryAction={{ label: "Спросить ИИ" }}
          icon="⚠️"
        />
      )}

      {/* Filters */}
      <Toolbar>
        <ToolbarTabs
          value={filterStatus}
          onChange={(val) => setFilterStatus(val as FilterStatus)}
          tabs={[
            { value: "all", label: "Все" },
            { value: "working", label: "Работает" },
            { value: "idle", label: "Простой" },
            { value: "maintenance", label: "ТО" },
          ]}
        />
        <ToolbarSelect
          value={sortBy}
          onChange={(val) => setSortBy(val as SortField)}
          options={[
            { value: "utilization", label: "По загрузке" },
            { value: "revenue", label: "По выручке" },
            { value: "hours", label: "По часам" },
            { value: "name", label: "По названию" },
          ]}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "desc" ? "↓" : "↑"}
        </Button>
      </Toolbar>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredEquipment.map(eq => (
          <EquipmentCard
            key={eq.equipmentId}
            id={eq.equipmentId}
            name={eq.equipmentName}
            status={eq.status as "working" | "idle" | "maintenance" | "transit"}
            utilizationPercent={eq.utilizationPercent}
            location={eq.projectName}
            operator={eq.operatorName || "Не назначен"}
            hoursToday={eq.hoursToday}
            hoursWeek={eq.hoursThisWeek}
            hoursMonth={eq.hoursThisMonth}
            revenueThisMonth={eq.revenueThisMonth}
          />
        ))}
      </div>

      {/* Recent Equipment Events */}
      <div>
        <h2 className="text-[18px] font-semibold text-white mb-4">Последние события по технике</h2>
        <div className="space-y-2">
          {equipmentEvents.map(event => (
            <TimelineItem
              key={event.id}
              icon={
                event.type === "equipment_assigned"
                  ? "✅"
                  : event.type === "equipment_unassigned"
                    ? "↩️"
                    : event.type === "equipment_idle"
                      ? "⏸️"
                      : event.type === "equipment_breakdown"
                        ? "🔧"
                        : "🛠️"
              }
              time={new Date(event.timestamp).toLocaleDateString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              title={event.title}
              description={`${event.equipmentName} ${
                event.financialImpact
                  ? `• ${event.financialImpact > 0 ? "+" : ""}${formatMoney(event.financialImpact)}`
                  : ""
              }`}
            />
          ))}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
