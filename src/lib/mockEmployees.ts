/**
 * In-memory хранилище сотрудников и функции для работы с ними
 * Интеграция с модулем Tasks для расчёта загрузки
 */

import { 
  Employee, 
  EmployeeStats, 
  EmployeeWithStats, 
  EmployeeRole,
  LoadScore 
} from "@/types/employees";
import { Task } from "@/types/tasks";
import { getAllTasks, updateTask } from "./mockTasks";

const STORAGE_KEY = "business_control_employees";

// Генератор ID
let employeeIdCounter = 100;

function generateEmployeeId(): string {
  return `emp_${++employeeIdCounter}`;
}

// Получить инициалы из имени
function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// ============================================
// НАЧАЛЬНЫЕ МОКОВЫЕ ДАННЫЕ
// ============================================

const initialEmployees: Employee[] = [
  {
    id: "emp_1",
    name: "Иванов Сергей Петрович",
    role: "owner",
    department: "management",
    status: "busy",
    avatarInitials: "ИС",
    phone: "+7 (999) 123-45-67",
    telegram: "@ivanov_sp",
    email: "ivanov@company.ru",
    costPerMonthRub: 0,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "emp_2",
    name: "Петров Алексей Владимирович",
    role: "dispatcher",
    department: "operations",
    status: "busy",
    avatarInitials: "ПА",
    phone: "+7 (999) 234-56-78",
    telegram: "@petrov_av",
    costPerMonthRub: 85000,
    createdAt: "2024-03-15T00:00:00Z"
  },
  {
    id: "emp_3",
    name: "Сидорова Мария Ивановна",
    role: "accountant",
    department: "finance",
    status: "available",
    avatarInitials: "СМ",
    phone: "+7 (999) 345-67-89",
    email: "sidorova@company.ru",
    costPerMonthRub: 75000,
    createdAt: "2024-02-01T00:00:00Z"
  },
  {
    id: "emp_4",
    name: "Козлов Дмитрий Николаевич",
    role: "driver",
    department: "operations",
    status: "busy",
    avatarInitials: "КД",
    phone: "+7 (999) 456-78-90",
    costPerMonthRub: 65000,
    createdAt: "2024-04-10T00:00:00Z"
  },
  {
    id: "emp_5",
    name: "Новикова Елена Сергеевна",
    role: "manager",
    department: "sales",
    status: "overloaded",
    avatarInitials: "НЕ",
    phone: "+7 (999) 567-89-01",
    telegram: "@novikova_es",
    email: "novikova@company.ru",
    costPerMonthRub: 95000,
    createdAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "emp_6",
    name: "Морозов Андрей Викторович",
    role: "contractor",
    department: "operations",
    status: "available",
    avatarInitials: "МА",
    phone: "+7 (999) 678-90-12",
    costPerMonthRub: 120000,
    createdAt: "2024-05-01T00:00:00Z"
  },
  {
    id: "emp_7",
    name: "Волкова Анна Павловна",
    role: "dispatcher",
    department: "operations",
    status: "inactive",
    avatarInitials: "ВА",
    phone: "+7 (999) 789-01-23",
    costPerMonthRub: 80000,
    createdAt: "2024-06-15T00:00:00Z"
  }
];

// In-memory хранилище
let employeesStore: Employee[] = [...initialEmployees];
let isInitialized = false;

// ============================================
// STORAGE HELPERS
// ============================================

function saveToStorage() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employeesStore));
  }
}

function initFromStorage() {
  if (isInitialized) return;
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        employeesStore = parsed;
        
        // Restore counter
        const maxId = parsed.reduce((max: number, e: Employee) => {
          const idNum = parseInt(e.id.replace("emp_", ""));
          return !isNaN(idNum) && idNum > max ? idNum : max;
        }, 100);
        employeeIdCounter = maxId;
      }
    } catch (e) {
      console.error("Failed to parse employees from storage", e);
    }
  }
  isInitialized = true;
}

// ============================================
// CRUD ОПЕРАЦИИ
// ============================================

/**
 * Получить всех сотрудников
 */
export function getEmployees(): Employee[] {
  initFromStorage();
  return [...employeesStore];
}

/**
 * Получить сотрудника по ID
 */
export function getEmployeeById(id: string): Employee | undefined {
  initFromStorage();
  return employeesStore.find(e => e.id === id);
}

/**
 * Найти сотрудника по имени (частичное совпадение)
 */
export function getEmployeeByName(name: string): Employee | undefined {
  initFromStorage();
  const lowerName = name.toLowerCase();
  
  // Сначала ищем точное совпадение
  const exact = employeesStore.find(e => e.name.toLowerCase() === lowerName);
  if (exact) return exact;
  
  // Затем частичное совпадение (фамилия или имя)
  return employeesStore.find(e => {
    const nameParts = e.name.toLowerCase().split(" ");
    return nameParts.some(part => part.includes(lowerName) || lowerName.includes(part));
  });
}

/**
 * Создать нового сотрудника
 */
export function createEmployee(params: Omit<Employee, "id" | "createdAt" | "avatarInitials">): Employee {
  initFromStorage();
  
  const newEmployee: Employee = {
    ...params,
    id: generateEmployeeId(),
    avatarInitials: getInitials(params.name),
    createdAt: new Date().toISOString()
  };
  
  employeesStore = [newEmployee, ...employeesStore];
  saveToStorage();
  return newEmployee;
}

/**
 * Обновить сотрудника
 */
export function updateEmployee(id: string, params: Partial<Employee>): Employee | null {
  initFromStorage();
  const index = employeesStore.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  const updated: Employee = {
    ...employeesStore[index],
    ...params,
    avatarInitials: params.name ? getInitials(params.name) : employeesStore[index].avatarInitials
  };
  
  employeesStore[index] = updated;
  saveToStorage();
  return updated;
}

/**
 * Удалить сотрудника
 */
export function deleteEmployee(id: string): boolean {
  initFromStorage();
  const index = employeesStore.findIndex(e => e.id === id);
  if (index === -1) return false;
  
  employeesStore.splice(index, 1);
  saveToStorage();
  return true;
}

// ============================================
// СТАТИСТИКА И ЗАГРУЗКА
// ============================================

/**
 * Получить статистику сотрудника по задачам
 */
export function getEmployeeStats(employeeId: string, tasks?: Task[]): EmployeeStats {
  const allTasks = tasks || getAllTasks();
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  // Задачи, назначенные на этого сотрудника
  const employeeTasks = allTasks.filter(t => t.assigneeId === employeeId);
  
  // Активные задачи (new + in_progress)
  const activeTasks = employeeTasks.filter(t => 
    t.status === "new" || t.status === "in_progress"
  );
  
  // Просроченные задачи
  const overdueTasks = employeeTasks.filter(t => 
    (t.status === "new" || t.status === "in_progress") && t.dueDate < today
  );
  
  // Выполненные за 7 дней
  const done7d = employeeTasks.filter(t => 
    t.status === "done" && t.completedAt && t.completedAt >= weekAgo
  );
  
  // Заблокированные
  const blockedTasks = employeeTasks.filter(t => t.status === "blocked");
  
  // Расчёт уровня загрузки
  const loadScore = calculateLoadScore(activeTasks.length, overdueTasks.length);
  
  return {
    activeCount: activeTasks.length,
    overdueCount: overdueTasks.length,
    done7dCount: done7d.length,
    blockedCount: blockedTasks.length,
    loadScore
  };
}

/**
 * Расчёт уровня загрузки
 */
function calculateLoadScore(activeCount: number, overdueCount: number): LoadScore {
  // Если есть просрочки — критическая загрузка
  if (overdueCount >= 2) return "critical";
  if (overdueCount === 1 && activeCount >= 4) return "critical";
  
  // По количеству активных задач
  if (activeCount >= 6) return "critical";
  if (activeCount >= 4) return "high";
  if (activeCount >= 2) return "medium";
  return "low";
}

/**
 * Получить всех сотрудников со статистикой
 */
export function getEmployeesWithStats(): EmployeeWithStats[] {
  initFromStorage();
  const allTasks = getAllTasks();
  
  return employeesStore.map(employee => ({
    ...employee,
    stats: getEmployeeStats(employee.id, allTasks)
  }));
}

/**
 * Обновить статус сотрудника на основе загрузки
 */
export function updateEmployeeStatusByLoad(employeeId: string): Employee | null {
  const stats = getEmployeeStats(employeeId);
  const employee = getEmployeeById(employeeId);
  if (!employee) return null;
  
  let newStatus: Employee["status"] = employee.status;
  
  // Не меняем статус inactive
  if (employee.status !== "inactive") {
    if (stats.loadScore === "critical" || stats.overdueCount > 0) {
      newStatus = "overloaded";
    } else if (stats.activeCount === 0) {
      newStatus = "available";
    } else {
      newStatus = "busy";
    }
  }
  
  if (newStatus !== employee.status) {
    return updateEmployee(employeeId, { status: newStatus });
  }
  
  return employee;
}

// ============================================
// НАЗНАЧЕНИЕ ЗАДАЧ
// ============================================

/**
 * Назначить задачу сотруднику
 */
export function assignTaskToEmployee(taskId: string, employeeId: string): Task | null {
  const employee = getEmployeeById(employeeId);
  if (!employee) return null;
  
  const updatedTask = updateTask(taskId, {
    assigneeId: employeeId,
    assigneeName: employee.name
  });
  
  // Обновляем статус сотрудника
  if (updatedTask) {
    updateEmployeeStatusByLoad(employeeId);
  }
  
  return updatedTask;
}

/**
 * Снять назначение задачи
 */
export function unassignTask(taskId: string): Task | null {
  const allTasks = getAllTasks();
  const task = allTasks.find(t => t.id === taskId);
  const previousAssigneeId = task?.assigneeId;
  
  const updatedTask = updateTask(taskId, {
    assigneeId: undefined,
    assigneeName: "Не назначен"
  });
  
  // Обновляем статус предыдущего исполнителя
  if (previousAssigneeId) {
    updateEmployeeStatusByLoad(previousAssigneeId);
  }
  
  return updatedTask;
}

/**
 * Получить задачи сотрудника
 */
export function getEmployeeTasks(employeeId: string): Task[] {
  const allTasks = getAllTasks();
  return allTasks.filter(t => t.assigneeId === employeeId);
}

// ============================================
// РЕКОМЕНДАЦИИ ИИ
// ============================================

/**
 * Рекомендовать лучшего исполнителя для задачи
 */
export function recommendBestAssignee(excludeIds: string[] = []): {
  employee: Employee | null;
  reason: string;
  warning?: string;
} {
  const employeesWithStats = getEmployeesWithStats();
  
  // Фильтруем активных сотрудников
  const available = employeesWithStats.filter(e => 
    e.status !== "inactive" && !excludeIds.includes(e.id)
  );
  
  if (available.length === 0) {
    return {
      employee: null,
      reason: "Нет доступных сотрудников",
      warning: "Все сотрудники неактивны или исключены"
    };
  }
  
  // Сортируем: сначала без просрочек, потом по загрузке
  const sorted = [...available].sort((a, b) => {
    // Приоритет: нет просрочек
    if (a.stats.overdueCount === 0 && b.stats.overdueCount > 0) return -1;
    if (a.stats.overdueCount > 0 && b.stats.overdueCount === 0) return 1;
    
    // Затем по количеству активных задач
    return a.stats.activeCount - b.stats.activeCount;
  });
  
  const best = sorted[0];
  
  // Проверяем, не перегружены ли все
  const allOverloaded = available.every(e => 
    e.stats.loadScore === "critical" || e.stats.loadScore === "high"
  );
  
  let reason = "";
  let warning: string | undefined;
  
  if (best.stats.activeCount === 0) {
    reason = `${best.name} свободен и может взять задачу`;
  } else if (best.stats.overdueCount === 0) {
    reason = `${best.name} — минимальная загрузка (${best.stats.activeCount} задач), нет просрочек`;
  } else {
    reason = `${best.name} — наименее загружен из доступных`;
  }
  
  if (allOverloaded) {
    warning = "Все сотрудники перегружены. Рекомендуется перераспределить задачи.";
  }
  
  return { employee: best, reason, warning };
}

/**
 * Получить AI-рекомендацию для сотрудника
 */
export function getEmployeeAIRecommendation(employeeId: string): {
  type: "warning" | "info" | "success";
  message: string;
  actions?: string[];
} {
  const stats = getEmployeeStats(employeeId);
  const employee = getEmployeeById(employeeId);
  
  if (!employee) {
    return { type: "info", message: "Сотрудник не найден" };
  }
  
  // Есть просрочки
  if (stats.overdueCount > 0) {
    return {
      type: "warning",
      message: `Есть просроченные задачи (${stats.overdueCount}). Рекомендуется снизить нагрузку и перераспределить часть задач.`,
      actions: [
        "Перераспределить задачи другим сотрудникам",
        "Помочь с приоритетными задачами",
        "Выяснить причины просрочек"
      ]
    };
  }
  
  // Перегружен
  if (stats.activeCount >= 6) {
    return {
      type: "warning",
      message: `Сотрудник перегружен (${stats.activeCount} активных задач). Не назначайте новые задачи.`,
      actions: [
        "Не назначать новые задачи",
        "Рассмотреть перераспределение",
        "Помочь с текущими задачами"
      ]
    };
  }
  
  // Высокая загрузка
  if (stats.activeCount >= 4) {
    return {
      type: "info",
      message: `Высокая загрузка (${stats.activeCount} задач). Назначайте только срочные задачи.`,
      actions: ["Назначать только критичные задачи"]
    };
  }
  
  // Простой
  if (stats.activeCount === 0) {
    return {
      type: "info",
      message: "Сотрудник свободен. Назначьте задачи или используйте для подстраховки.",
      actions: [
        "Назначить задачи из бэклога",
        "Привлечь к помощи перегруженным коллегам"
      ]
    };
  }
  
  // Нормальная загрузка
  return {
    type: "success",
    message: `Оптимальная загрузка (${stats.activeCount} задач). Можно назначать новые задачи.`
  };
}

// ============================================
// АГРЕГИРОВАННАЯ СТАТИСТИКА
// ============================================

/**
 * Получить общую статистику по сотрудникам
 */
export function getEmployeesOverallStats() {
  const employeesWithStats = getEmployeesWithStats();
  const active = employeesWithStats.filter(e => e.status !== "inactive");
  
  return {
    total: employeesWithStats.length,
    active: active.length,
    available: active.filter(e => e.status === "available").length,
    busy: active.filter(e => e.status === "busy").length,
    overloaded: active.filter(e => e.status === "overloaded").length,
    inactive: employeesWithStats.filter(e => e.status === "inactive").length,
    withOverdue: active.filter(e => e.stats.overdueCount > 0).length,
    totalActiveTasks: active.reduce((sum, e) => sum + e.stats.activeCount, 0),
    totalOverdueTasks: active.reduce((sum, e) => sum + e.stats.overdueCount, 0)
  };
}

// ============================================
// СБРОС ДАННЫХ (для демо)
// ============================================

export function resetEmployees(): void {
  employeesStore = [...initialEmployees];
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  isInitialized = true;
  employeeIdCounter = 100;
  saveToStorage();
}
