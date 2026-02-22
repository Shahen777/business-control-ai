"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getAllContracts,
  createContract,
  deleteContract,
} from "@/lib/mockLegal";
import {
  Contract,
  ContractStatus,
  contractStatusConfig,
  CreateContractParams,
} from "@/types/legal";

// Форматирование суммы
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Форматирование даты
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SortField = "title" | "counterparty" | "amountRub" | "createdAt" | "status";
type SortDir = "asc" | "desc";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных
  useEffect(() => {
    setContracts(getAllContracts());
    setIsLoading(false);
  }, []);

  // Фильтрация и сортировка
  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Фильтр по поиску
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.counterparty.toLowerCase().includes(lower) ||
          c.number?.toLowerCase().includes(lower)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Сортировка
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "counterparty":
          cmp = a.counterparty.localeCompare(b.counterparty);
          break;
        case "amountRub":
          cmp = (a.amountRub || 0) - (b.amountRub || 0);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "createdAt":
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [contracts, search, statusFilter, sortField, sortDir]);

  // Создание договора
  const handleCreate = (params: CreateContractParams) => {
    const newContract = createContract(params);
    setContracts(getAllContracts());
    setShowDialog(false);
  };

  // Удаление договора
  const handleDelete = (id: string) => {
    if (confirm("Удалить договор?")) {
      deleteContract(id);
      setContracts(getAllContracts());
    }
  };

  // Toggle сортировки
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
            <Link href="/dashboard/legal" className="hover:text-zinc-300">
              Юр отдел
            </Link>
            <span>/</span>
            <span className="text-white">Договоры</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Договоры</h1>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            color: "#FFFFFF",
          }}
        >
          + Добавить договор
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl"
        style={{
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Поиск по названию, контрагенту, номеру..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContractStatus | "all")}
          className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Все статусы</option>
          {Object.entries(contractStatusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MiniStat
          label="Всего"
          value={contracts.length}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />
        <MiniStat
          label="Активных"
          value={contracts.filter((c) => c.status === "active").length}
          color="#10B981"
          active={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
        />
        <MiniStat
          label="Черновиков"
          value={contracts.filter((c) => c.status === "draft").length}
          color="#71717A"
          active={statusFilter === "draft"}
          onClick={() => setStatusFilter("draft")}
        />
        <MiniStat
          label="Спорных"
          value={contracts.filter((c) => c.status === "disputed").length}
          color="#EF4444"
          active={statusFilter === "disputed"}
          onClick={() => setStatusFilter("disputed")}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Table Header */}
        <div
          className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide"
          style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
        >
          <div
            className="col-span-4 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => toggleSort("title")}
          >
            Договор
            {sortField === "title" && (
              <span>{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </div>
          <div
            className="col-span-3 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => toggleSort("counterparty")}
          >
            Контрагент
            {sortField === "counterparty" && (
              <span>{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => toggleSort("amountRub")}
          >
            Сумма
            {sortField === "amountRub" && (
              <span>{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => toggleSort("status")}
          >
            Статус
            {sortField === "status" && (
              <span>{sortDir === "asc" ? "↑" : "↓"}</span>
            )}
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {filteredContracts.map((contract) => {
            const statusCfg = contractStatusConfig[contract.status];
            return (
              <div
                key={contract.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4 hover:bg-white/5 transition-colors"
              >
                {/* Title & Number */}
                <div className="col-span-4">
                  <Link
                    href={`/dashboard/legal/contracts/${contract.id}`}
                    className="text-sm font-medium text-white hover:text-blue-400"
                  >
                    {contract.title}
                  </Link>
                  {contract.number && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      № {contract.number}{" "}
                      {contract.date && `от ${formatDate(contract.date)}`}
                    </p>
                  )}
                </div>

                {/* Counterparty */}
                <div className="col-span-3">
                  <p className="text-sm text-zinc-300">{contract.counterparty}</p>
                  {contract.projectName && (
                    <p className="text-xs text-zinc-500">{contract.projectName}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  {contract.amountRub ? (
                    <p className="text-sm text-white">
                      {formatMoney(contract.amountRub)}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500">—</p>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: statusCfg.bgColor,
                      color: statusCfg.color,
                    }}
                  >
                    {statusCfg.label}
                  </span>
                  {contract.extracted?.riskyClauses &&
                    contract.extracted.riskyClauses.length > 0 && (
                      <span className="ml-1 text-amber-500" title="Есть риски">
                        ⚠️
                      </span>
                    )}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Link
                    href={`/dashboard/legal/contracts/${contract.id}`}
                    className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                    title="Открыть"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          {filteredContracts.length === 0 && (
            <div className="px-4 py-12 text-center text-zinc-500">
              {search || statusFilter !== "all"
                ? "Договоры не найдены. Попробуйте изменить фильтры."
                : "Нет договоров. Добавьте первый договор."}
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      {showDialog && (
        <ContractDialog
          onClose={() => setShowDialog(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

// Mini Stat Component
function MiniStat({
  label,
  value,
  color = "#FAFAFA",
  active,
  onClick,
}: {
  label: string;
  value: number;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-lg text-left transition-colors"
      style={{
        backgroundColor: active ? "rgba(59, 130, 246, 0.15)" : "#18181B",
        border: active ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid transparent",
      }}
    >
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-lg font-semibold" style={{ color }}>
        {value}
      </p>
    </button>
  );
}

// Contract Dialog Component
function ContractDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (params: CreateContractParams) => void;
}) {
  const [form, setForm] = useState<CreateContractParams>({
    title: "",
    number: "",
    date: new Date().toISOString().split("T")[0],
    counterparty: "",
    projectName: "",
    status: "draft",
    amountRub: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.counterparty) {
      alert("Заполните название и контрагента");
      return;
    }
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg rounded-xl p-6"
        style={{ backgroundColor: "#111113", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Новый договор</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Название / Предмет *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Договор подряда на..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Номер</label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="ДП-2025/001"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Дата</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Контрагент *</label>
            <input
              type="text"
              value={form.counterparty}
              onChange={(e) => setForm({ ...form, counterparty: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              placeholder="ООО «Название»"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Проект</label>
              <input
                type="text"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="ЖК Солнечный"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Сумма, ₽</label>
              <input
                type="number"
                value={form.amountRub || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amountRub: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                placeholder="1000000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
