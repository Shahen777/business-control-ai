/**
 * Лог активности системы
 * Хранит историю всех действий пользователей и ИИ
 */

const STORAGE_KEY = "business_control_activity";

// Тип действия
export type ActivityType =
  | "task_created"
  | "task_completed"
  | "task_status_changed"
  | "task_assigned"
  | "task_comment_added"
  | "decision_created"
  | "decision_approved"
  | "decision_rejected"
  | "contract_created"
  | "contract_status_changed"
  | "contract_analyzed"
  | "contract_deleted"
  | "document_generated"
  | "document_deleted"
  | "file_uploaded"
  | "employee_created"
  | "ai_suggestion"
  | "ai_chat_message"
  | "system_alert";

// Тип сущности
export type EntityType =
  | "task"
  | "decision"
  | "contract"
  | "document"
  | "employee"
  | "asset"
  | "system";

// Запись активности
export interface ActivityEntry {
  id: string;
  type: ActivityType;
  entityType: EntityType;
  entityId?: string;
  entityTitle?: string;
  description: string;
  actor?: string; // Кто выполнил действие (имя пользователя или "ИИ")
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Параметры для создания записи
export interface CreateActivityParams {
  type: ActivityType;
  entityType: EntityType;
  entityId?: string;
  entityTitle?: string;
  description: string;
  actor?: string;
  metadata?: Record<string, unknown>;
}

// Генератор ID
let activityIdCounter = 1000;

function generateActivityId(): string {
  return `activity_${++activityIdCounter}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ============================================
// НАЧАЛЬНЫЕ МОКОВЫЕ ДАННЫЕ
// ============================================

const initialActivities: ActivityEntry[] = [
  {
    id: "activity_1",
    type: "decision_created",
    entityType: "decision",
    entityId: "decision_1",
    entityTitle: "Ускорить сбор дебиторки",
    description: "ИИ сформировал решение о сборе дебиторской задолженности для предотвращения кассового разрыва",
    actor: "Finance AI",
    metadata: { impactRub: 450000 },
    createdAt: "2026-01-06T10:00:00Z",
  },
  {
    id: "activity_2",
    type: "task_created",
    entityType: "task",
    entityId: "task_1",
    entityTitle: "Ускорить получение дебиторки от СтройМир",
    description: "Создана задача на основе решения ИИ",
    actor: "Finance AI",
    metadata: { assigneeId: "emp_2", priority: "critical" },
    createdAt: "2026-01-06T10:30:00Z",
  },
  {
    id: "activity_3",
    type: "task_status_changed",
    entityType: "task",
    entityId: "task_1",
    entityTitle: "Ускорить получение дебиторки от СтройМир",
    description: "Статус задачи изменён: Новая → В работе",
    actor: "Петров А.В.",
    metadata: { oldStatus: "new", newStatus: "in_progress" },
    createdAt: "2026-01-06T11:00:00Z",
  },
  {
    id: "activity_4",
    type: "task_comment_added",
    entityType: "task",
    entityId: "task_1",
    entityTitle: "Ускорить получение дебиторки от СтройМир",
    description: "Добавлен комментарий к задаче",
    actor: "Петров А.В.",
    createdAt: "2026-01-07T14:20:00Z",
  },
  {
    id: "activity_5",
    type: "contract_created",
    entityType: "contract",
    entityId: "contract_1",
    entityTitle: "Договор подряда на земляные работы",
    description: "Создан договор с ООО «СтройМир» на сумму 4 500 000 ₽",
    actor: "Система",
    metadata: { counterparty: "ООО «СтройМир»", amountRub: 4500000 },
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "activity_6",
    type: "contract_analyzed",
    entityType: "contract",
    entityId: "contract_1",
    entityTitle: "Договор подряда на земляные работы",
    description: "ИИ проанализировал договор и выявил 1 риск (односторонний отказ заказчика)",
    actor: "Legal AI",
    metadata: { risksCount: 1 },
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "activity_7",
    type: "ai_suggestion",
    entityType: "system",
    description: "ИИ рекомендует: Обратите внимание на просроченную дебиторку от СтройМир (450 000 ₽)",
    actor: "Business AI",
    createdAt: "2026-01-06T08:00:00Z",
  },
  {
    id: "activity_8",
    type: "document_generated",
    entityType: "document",
    entityId: "legaldoc_1",
    entityTitle: "Акт выполненных работ КС-2",
    description: "Сгенерирован акт КС-2 по договору ДП-2025/001",
    actor: "Сидорова М.И.",
    createdAt: "2025-01-31T16:00:00Z",
  },
];

// ============================================
// РАБОТА С LOCALSTORAGE
// ============================================

function loadActivities(): ActivityEntry[] {
  if (typeof window === "undefined") return [...initialActivities];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading activities:", e);
  }
  return [...initialActivities];
}

function saveActivities(activities: ActivityEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    // Храним только последние 500 записей
    const toSave = activities.slice(-500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Error saving activities:", e);
  }
}

// In-memory кэш
let activitiesCache: ActivityEntry[] | null = null;

function getStore(): ActivityEntry[] {
  if (!activitiesCache) {
    activitiesCache = loadActivities();
  }
  return activitiesCache;
}

// ============================================
// API ФУНКЦИИ
// ============================================

/**
 * Получить все записи активности
 */
export function getAllActivities(): ActivityEntry[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Получить последние N записей
 */
export function getRecentActivities(limit: number = 20): ActivityEntry[] {
  return getAllActivities().slice(0, limit);
}

/**
 * Получить активности по типу сущности
 */
export function getActivitiesByEntityType(entityType: EntityType): ActivityEntry[] {
  return getAllActivities().filter((a) => a.entityType === entityType);
}

/**
 * Получить активности по конкретной сущности
 */
export function getActivitiesByEntity(entityType: EntityType, entityId: string): ActivityEntry[] {
  return getAllActivities().filter(
    (a) => a.entityType === entityType && a.entityId === entityId
  );
}

/**
 * Получить активности по типу действия
 */
export function getActivitiesByType(type: ActivityType): ActivityEntry[] {
  return getAllActivities().filter((a) => a.type === type);
}

/**
 * Получить активности за период
 */
export function getActivitiesByDateRange(startDate: string, endDate: string): ActivityEntry[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return getAllActivities().filter((a) => {
    const time = new Date(a.createdAt).getTime();
    return time >= start && time <= end;
  });
}

/**
 * Получить активности за сегодня
 */
export function getTodayActivities(): ActivityEntry[] {
  const today = new Date().toISOString().split("T")[0];
  return getAllActivities().filter((a) => a.createdAt.startsWith(today));
}

/**
 * Записать новую активность
 */
export function logActivity(params: CreateActivityParams): ActivityEntry {
  const store = getStore();

  const entry: ActivityEntry = {
    id: generateActivityId(),
    type: params.type,
    entityType: params.entityType,
    entityId: params.entityId,
    entityTitle: params.entityTitle,
    description: params.description,
    actor: params.actor || "Система",
    metadata: params.metadata,
    createdAt: nowISO(),
  };

  store.push(entry);
  saveActivities(store);

  return entry;
}

/**
 * Удалить старые записи (старше N дней)
 */
export function cleanupOldActivities(daysToKeep: number = 30): number {
  const store = getStore();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);
  const cutoffTime = cutoff.getTime();

  const before = store.length;
  const filtered = store.filter(
    (a) => new Date(a.createdAt).getTime() >= cutoffTime
  );

  activitiesCache = filtered;
  saveActivities(filtered);

  return before - filtered.length;
}

/**
 * Сброс данных (для тестирования)
 */
export function resetActivities(): void {
  activitiesCache = [...initialActivities];
  saveActivities(activitiesCache);
}

// ============================================
// СТАТИСТИКА
// ============================================

export interface ActivityStats {
  totalToday: number;
  taskActivities: number;
  decisionActivities: number;
  contractActivities: number;
  aiSuggestions: number;
}

export function getActivityStats(): ActivityStats {
  const today = getTodayActivities();
  const all = getAllActivities();

  return {
    totalToday: today.length,
    taskActivities: all.filter((a) => a.entityType === "task").length,
    decisionActivities: all.filter((a) => a.entityType === "decision").length,
    contractActivities: all.filter((a) => a.entityType === "contract").length,
    aiSuggestions: all.filter((a) => a.type === "ai_suggestion").length,
  };
}

// ============================================
// ИКОНКИ И КОНФИГИ ДЛЯ UI
// ============================================

export const activityTypeConfig: Record<
  ActivityType,
  { label: string; icon: string; color: string }
> = {
  task_created: { label: "Задача создана", icon: "➕", color: "#10B981" },
  task_completed: { label: "Задача завершена", icon: "✅", color: "#10B981" },
  task_status_changed: { label: "Статус изменён", icon: "🔄", color: "#3B82F6" },
  task_assigned: { label: "Задача назначена", icon: "👤", color: "#8B5CF6" },
  task_comment_added: { label: "Комментарий", icon: "💬", color: "#6B7280" },
  decision_created: { label: "Решение создано", icon: "💡", color: "#F59E0B" },
  decision_approved: { label: "Решение принято", icon: "✅", color: "#10B981" },
  decision_rejected: { label: "Решение отклонено", icon: "❌", color: "#EF4444" },
  contract_created: { label: "Договор создан", icon: "📄", color: "#3B82F6" },
  contract_status_changed: { label: "Статус договора", icon: "📋", color: "#8B5CF6" },
  contract_analyzed: { label: "Договор проанализирован", icon: "🔍", color: "#F59E0B" },
  contract_deleted: { label: "Договор удалён", icon: "🗑️", color: "#EF4444" },
  document_generated: { label: "Документ создан", icon: "📝", color: "#10B981" },
  document_deleted: { label: "Документ удалён", icon: "🗑️", color: "#EF4444" },
  file_uploaded: { label: "Файл загружен", icon: "📎", color: "#6B7280" },
  employee_created: { label: "Сотрудник добавлен", icon: "👤", color: "#10B981" },
  ai_suggestion: { label: "Рекомендация ИИ", icon: "🤖", color: "#F59E0B" },
  ai_chat_message: { label: "Сообщение ИИ", icon: "💬", color: "#8B5CF6" },
  system_alert: { label: "Системное уведомление", icon: "⚠️", color: "#EF4444" },
};

export const entityTypeConfig: Record<EntityType, { label: string; icon: string }> = {
  task: { label: "Задача", icon: "📋" },
  decision: { label: "Решение", icon: "💡" },
  contract: { label: "Договор", icon: "📄" },
  document: { label: "Документ", icon: "📝" },
  employee: { label: "Сотрудник", icon: "👤" },
  asset: { label: "Актив", icon: "🚜" },
  system: { label: "Система", icon: "⚙️" },
};
