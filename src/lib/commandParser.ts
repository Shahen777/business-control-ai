/**
 * Парсер команд для ИИ-чата
 * Анализирует текст и извлекает intent + payload для выполнения действий
 */

import { TaskPriority } from "@/types/tasks";
import { EmployeeRole } from "@/types/employees";
import { DecisionPriority } from "@/types/decisions";

// ============================================
// ТИПЫ ИНТЕНТОВ
// ============================================

export type CommandIntent = 
  | "CREATE_TASK"
  | "UPDATE_TASK"
  | "LIST_TASKS"
  | "CREATE_EMPLOYEE"
  | "LIST_EMPLOYEES"
  | "CREATE_DECISION"
  | "UPDATE_DECISION"
  | "ASSIGN_TASK"
  | "SHOW_OVERDUE"
  | "SHOW_EMPLOYEE_TASKS"
  // Юр модуль
  | "CREATE_CONTRACT"
  | "LIST_CONTRACTS"
  | "ANALYZE_CONTRACT"
  | "CREATE_DOCUMENT"
  | "LIST_DOCUMENTS"
  | "UNKNOWN";

// Payload для создания задачи
export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  assigneeName?: string;
  department?: string;
  tags?: string[];
  impactRub?: number;
}

// Payload для обновления задачи
export interface UpdateTaskPayload {
  taskId: string;
  status?: "new" | "in_progress" | "done" | "blocked";
  dueDateShift?: number; // дни
  assigneeName?: string;
}

// Payload для создания сотрудника
export interface CreateEmployeePayload {
  name: string;
  role: EmployeeRole;
  department?: string;
}

// Payload для создания решения
export interface CreateDecisionPayload {
  title: string;
  priority: DecisionPriority;
  impactRub?: number;
  reason?: string;
  department?: string;
}

// Payload для фильтрации задач
export interface ListTasksPayload {
  filter?: "overdue" | "all" | "in_progress" | "done";
  assigneeName?: string;
}

// Объединённый payload
export type CommandPayload = 
  | CreateTaskPayload 
  | UpdateTaskPayload 
  | CreateEmployeePayload 
  | CreateDecisionPayload
  | ListTasksPayload;

// Результат парсинга
export interface ParsedCommand {
  intent: CommandIntent;
  payload: CommandPayload | null;
  confidence: number; // 0-1
  previewText: string; // Что покажем пользователю
  originalText: string;
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Парсинг даты из текста
function parseDateFromText(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  const today = new Date();
  
  // "завтра"
  if (lowerText.includes("завтра")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }
  
  // "послезавтра"
  if (lowerText.includes("послезавтра")) {
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split("T")[0];
  }
  
  // "через X дней"
  const daysMatch = lowerText.match(/через\s*(\d+)\s*(дн|день)/i);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString().split("T")[0];
  }
  
  // "дедлайн X дней" или "срок X дней"
  const deadlineMatch = lowerText.match(/(дедлайн|срок)\s*(\d+)\s*(дн|день)/i);
  if (deadlineMatch) {
    const days = parseInt(deadlineMatch[2]);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString().split("T")[0];
  }
  
  // "X января/февраля/..." - конкретная дата
  const months: Record<string, number> = {
    "января": 0, "февраля": 1, "марта": 2, "апреля": 3,
    "мая": 4, "июня": 5, "июля": 6, "августа": 7,
    "сентября": 8, "октября": 9, "ноября": 10, "декабря": 11
  };
  
  const dateMatch = lowerText.match(/(\d{1,2})\s*(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/i);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const month = months[dateMatch[2].toLowerCase()];
    const year = today.getFullYear();
    const parsedDate = new Date(year, month, day);
    // Если дата в прошлом, берём следующий год
    if (parsedDate < today) {
      parsedDate.setFullYear(year + 1);
    }
    return parsedDate.toISOString().split("T")[0];
  }
  
  return undefined;
}

// Парсинг приоритета из текста
function parsePriorityFromText(text: string): TaskPriority | undefined {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("критич") || lowerText.includes("срочно") || lowerText.includes("urgent")) {
    return "critical";
  }
  if (lowerText.includes("высок") || lowerText.includes("важн")) {
    return "high";
  }
  if (lowerText.includes("средн") || lowerText.includes("обычн")) {
    return "medium";
  }
  if (lowerText.includes("низк") || lowerText.includes("можно позже")) {
    return "low";
  }
  
  return undefined;
}

// Парсинг приоритета решения
function parseDecisionPriorityFromText(text: string): DecisionPriority {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("критич")) return "critical";
  if (lowerText.includes("высок") || lowerText.includes("важн")) return "high";
  if (lowerText.includes("низк")) return "low";
  return "medium";
}

// Парсинг роли сотрудника
function parseRoleFromText(text: string): EmployeeRole {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("владел") || lowerText.includes("директор") || lowerText.includes("руководител")) {
    return "owner";
  }
  if (lowerText.includes("диспетчер")) return "dispatcher";
  if (lowerText.includes("бухгалтер") || lowerText.includes("финанс")) return "accountant";
  if (lowerText.includes("менеджер") || lowerText.includes("продаж")) return "manager";
  if (lowerText.includes("водител") || lowerText.includes("машинист") || lowerText.includes("оператор")) return "driver";
  if (lowerText.includes("подрядчик") || lowerText.includes("субподряд")) return "contractor";
  
  return "manager"; // По умолчанию
}

// Парсинг отдела
function parseDepartmentFromText(text: string): string | undefined {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("финанс") || lowerText.includes("бухгалтер") || lowerText.includes("оплат")) {
    return "Финансы";
  }
  if (lowerText.includes("операци") || lowerText.includes("техник") || lowerText.includes("логист")) {
    return "Операции";
  }
  if (lowerText.includes("продаж") || lowerText.includes("клиент")) {
    return "Продажи";
  }
  if (lowerText.includes("руковод") || lowerText.includes("управлен")) {
    return "Руководство";
  }
  if (lowerText.includes("снабжен") || lowerText.includes("закуп")) {
    return "Снабжение";
  }
  
  return undefined;
}

// Парсинг суммы в рублях
function parseAmountFromText(text: string): number | undefined {
  // "эффект 200000", "450000 рублей", "на 50 000"
  const amountMatch = text.match(/(\d[\d\s]*)\s*(₽|руб|тыс|рублей)?/i);
  if (amountMatch) {
    let amount = parseInt(amountMatch[1].replace(/\s/g, ""));
    if (amountMatch[2]?.toLowerCase().includes("тыс")) {
      amount *= 1000;
    }
    return amount;
  }
  return undefined;
}

// Извлечение имени человека (упрощённо)
function extractPersonName(text: string): string | undefined {
  // Ищем паттерны типа "сотруднику Иван Петров", "на Иванова", "назначь Петрову"
  const patterns = [
    /(?:сотрудник[ау]?|на|назначь|исполнител[юь])\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)/i,
    /([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)\s*(?:,\s*роль|бухгалтер|менеджер|водител|диспетчер)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return undefined;
}

// Извлечение ID задачи
function extractTaskId(text: string): string | undefined {
  // "задачу #123", "task_123", "задача 5"
  const patterns = [
    /#(\d+)/,
    /task[_\s]*(\d+)/i,
    /задач[уа]\s*(\d+)/i,
    /id\s*(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return `task_${match[1]}`;
    }
  }
  
  return undefined;
}

// ============================================
// ОСНОВНОЙ ПАРСЕР
// ============================================

export function parseCommand(text: string): ParsedCommand {
  const lowerText = text.toLowerCase().trim();
  
  // ========================================
  // СОЗДАНИЕ ЗАДАЧИ
  // ========================================
  if (
    lowerText.includes("создай задачу") ||
    lowerText.includes("добавь задачу") ||
    lowerText.includes("новая задача") ||
    lowerText.match(/^задача[:\s]/i)
  ) {
    // Извлекаем заголовок - всё после "задачу:"/"задача:" или ключевого слова
    let title = text
      .replace(/создай\s+задачу[:\s]*/i, "")
      .replace(/добавь\s+задачу[:\s]*/i, "")
      .replace(/новая\s+задача[:\s]*/i, "")
      .replace(/^задача[:\s]*/i, "")
      .trim();
    
    // Убираем информацию о сроке/приоритете из заголовка
    title = title
      .replace(/,?\s*(срок|дедлайн|приоритет|эффект|завтра|через\s+\d+\s+дн).*$/i, "")
      .trim();
    
    // Ограничиваем длину
    if (title.length > 100) {
      title = title.substring(0, 100);
    }
    
    const payload: CreateTaskPayload = {
      title: title || "Новая задача",
      dueDate: parseDateFromText(text),
      priority: parsePriorityFromText(text) || "medium",
      assigneeName: extractPersonName(text),
      department: parseDepartmentFromText(text),
      impactRub: parseAmountFromText(text),
    };
    
    // Формируем preview
    const dueDateStr = payload.dueDate 
      ? new Date(payload.dueDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
      : "+7 дней";
    
    const priorityLabels: Record<TaskPriority, string> = {
      critical: "🔴 Критичный",
      high: "🟠 Высокий",
      medium: "🟡 Средний",
      low: "🟢 Низкий"
    };
    
    let previewText = `📝 **Создать задачу**\n`;
    previewText += `• Название: "${payload.title}"\n`;
    previewText += `• Срок: ${dueDateStr}\n`;
    previewText += `• Приоритет: ${priorityLabels[payload.priority || "medium"]}`;
    if (payload.assigneeName) {
      previewText += `\n• Исполнитель: ${payload.assigneeName}`;
    }
    if (payload.department) {
      previewText += `\n• Отдел: ${payload.department}`;
    }
    if (payload.impactRub) {
      previewText += `\n• Эффект: ${payload.impactRub.toLocaleString("ru-RU")} ₽`;
    }
    
    return {
      intent: "CREATE_TASK",
      payload,
      confidence: title.length > 5 ? 0.9 : 0.6,
      previewText,
      originalText: text
    };
  }
  
  // ========================================
  // СОЗДАНИЕ СОТРУДНИКА
  // ========================================
  if (
    lowerText.includes("добавь сотрудника") ||
    lowerText.includes("создай сотрудника") ||
    lowerText.includes("новый сотрудник")
  ) {
    // Извлекаем имя
    let name = text
      .replace(/добавь\s+сотрудника\s*/i, "")
      .replace(/создай\s+сотрудника\s*/i, "")
      .replace(/новый\s+сотрудник\s*/i, "")
      .replace(/,?\s*(роль|бухгалтер|менеджер|водитель|диспетчер|подрядчик).*$/i, "")
      .trim();
    
    const role = parseRoleFromText(text);
    
    const roleLabels: Record<EmployeeRole, string> = {
      owner: "Владелец",
      dispatcher: "Диспетчер",
      accountant: "Бухгалтер",
      manager: "Менеджер",
      driver: "Водитель",
      contractor: "Подрядчик"
    };
    
    const payload: CreateEmployeePayload = {
      name: name || "Новый сотрудник",
      role,
      department: parseDepartmentFromText(text)
    };
    
    const previewText = `👤 **Добавить сотрудника**\n• Имя: "${payload.name}"\n• Роль: ${roleLabels[role]}`;
    
    return {
      intent: "CREATE_EMPLOYEE",
      payload,
      confidence: name.length > 3 ? 0.85 : 0.5,
      previewText,
      originalText: text
    };
  }
  
  // ========================================
  // СОЗДАНИЕ РЕШЕНИЯ
  // ========================================
  if (
    lowerText.includes("добавь решение") ||
    lowerText.includes("создай решение") ||
    lowerText.includes("новое решение")
  ) {
    let title = text
      .replace(/добавь\s+решение[:\s]*/i, "")
      .replace(/создай\s+решение[:\s]*/i, "")
      .replace(/новое\s+решение[:\s]*/i, "")
      .replace(/,?\s*(критич|высок|эффект\s+\d+).*$/i, "")
      .trim();
    
    const priority = parseDecisionPriorityFromText(text);
    const impactRub = parseAmountFromText(text);
    
    const priorityLabels: Record<DecisionPriority, string> = {
      critical: "🔴 Критичный",
      high: "🟠 Высокий",
      medium: "🟡 Средний",
      low: "🟢 Низкий"
    };
    
    const payload: CreateDecisionPayload = {
      title: title || "Новое решение",
      priority,
      impactRub,
      department: parseDepartmentFromText(text)
    };
    
    let previewText = `🧠 **Создать решение**\n`;
    previewText += `• Название: "${payload.title}"\n`;
    previewText += `• Приоритет: ${priorityLabels[priority]}`;
    if (impactRub) {
      previewText += `\n• Эффект: ${impactRub.toLocaleString("ru-RU")} ₽`;
    }
    
    return {
      intent: "CREATE_DECISION",
      payload,
      confidence: title.length > 5 ? 0.85 : 0.5,
      previewText,
      originalText: text
    };
  }
  
  // ========================================
  // ПОКАЗАТЬ ПРОСРОЧЕННЫЕ ЗАДАЧИ
  // ========================================
  if (
    lowerText.includes("просроченн") ||
    lowerText.includes("overdue") ||
    (lowerText.includes("покажи") && lowerText.includes("задач") && lowerText.includes("срок"))
  ) {
    return {
      intent: "SHOW_OVERDUE",
      payload: { filter: "overdue" } as ListTasksPayload,
      confidence: 0.9,
      previewText: `📋 **Показать просроченные задачи**\nВывести список задач с истёкшим сроком`,
      originalText: text
    };
  }
  
  // ========================================
  // ПОКАЗАТЬ ЗАДАЧИ СОТРУДНИКА
  // ========================================
  if (lowerText.includes("задачи") && extractPersonName(text)) {
    const name = extractPersonName(text);
    return {
      intent: "SHOW_EMPLOYEE_TASKS",
      payload: { assigneeName: name } as ListTasksPayload,
      confidence: 0.8,
      previewText: `📋 **Показать задачи сотрудника**\n• Сотрудник: ${name}`,
      originalText: text
    };
  }
  
  // ========================================
  // ПОСТАВИТЬ ЗАДАЧУ В РАБОТУ
  // ========================================
  if (
    (lowerText.includes("задач") && lowerText.includes("в работу")) ||
    (lowerText.includes("начать") && lowerText.includes("задач"))
  ) {
    const taskId = extractTaskId(text);
    if (taskId) {
      return {
        intent: "UPDATE_TASK",
        payload: { taskId, status: "in_progress" } as UpdateTaskPayload,
        confidence: 0.85,
        previewText: `▶️ **Поставить задачу в работу**\n• ID: ${taskId}`,
        originalText: text
      };
    }
  }
  
  // ========================================
  // ОТМЕТИТЬ ЗАДАЧУ ВЫПОЛНЕННОЙ
  // ========================================
  if (
    (lowerText.includes("задач") && (lowerText.includes("выполнен") || lowerText.includes("готов") || lowerText.includes("done"))) ||
    (lowerText.includes("закрой") && lowerText.includes("задач"))
  ) {
    const taskId = extractTaskId(text);
    if (taskId) {
      return {
        intent: "UPDATE_TASK",
        payload: { taskId, status: "done" } as UpdateTaskPayload,
        confidence: 0.85,
        previewText: `✅ **Отметить задачу выполненной**\n• ID: ${taskId}`,
        originalText: text
      };
    }
  }
  
  // ========================================
  // НАЗНАЧИТЬ ЗАДАЧУ НА СОТРУДНИКА
  // ========================================
  if (
    lowerText.includes("назначь") ||
    (lowerText.includes("задач") && lowerText.includes(" на "))
  ) {
    const taskId = extractTaskId(text);
    const assigneeName = extractPersonName(text);
    
    if (taskId && assigneeName) {
      return {
        intent: "ASSIGN_TASK",
        payload: { taskId, assigneeName } as UpdateTaskPayload,
        confidence: 0.85,
        previewText: `👤 **Назначить задачу**\n• Задача: ${taskId}\n• Исполнитель: ${assigneeName}`,
        originalText: text
      };
    }
  }
  
  // ========================================
  // СДВИНУТЬ СРОК ЗАДАЧИ
  // ========================================
  if (lowerText.includes("сдвин") || lowerText.includes("перенес")) {
    const taskId = extractTaskId(text);
    const daysMatch = lowerText.match(/(\d+)\s*(дн|день)/i);
    
    if (taskId && daysMatch) {
      const days = parseInt(daysMatch[1]);
      return {
        intent: "UPDATE_TASK",
        payload: { taskId, dueDateShift: days } as UpdateTaskPayload,
        confidence: 0.8,
        previewText: `📅 **Сдвинуть срок задачи**\n• Задача: ${taskId}\n• Сдвиг: +${days} дней`,
        originalText: text
      };
    }
  }
  
  // ========================================
  // НЕИЗВЕСТНАЯ КОМАНДА
  // ========================================
  return {
    intent: "UNKNOWN",
    payload: null,
    confidence: 0,
    previewText: `❓ Не удалось распознать команду.\n\nПопробуйте:\n• "Создай задачу: ..."\n• "Добавь сотрудника..."\n• "Покажи просроченные задачи"`,
    originalText: text
  };
}

// ============================================
// БЫСТРЫЕ ПОДСКАЗКИ (CHIPS)
// ============================================

export interface QuickChip {
  label: string;
  command: string;
  icon: string;
}

export const quickChips: QuickChip[] = [
  { label: "Создай задачу", command: "Создай задачу: ", icon: "📝" },
  { label: "Добавь сотрудника", command: "Добавь сотрудника ", icon: "👤" },
  { label: "Создай решение", command: "Создай решение: ", icon: "🧠" },
  { label: "Просроченные задачи", command: "Покажи просроченные задачи", icon: "⏰" },
  { label: "Задачи сотрудника", command: "Покажи задачи ", icon: "📋" },
];
