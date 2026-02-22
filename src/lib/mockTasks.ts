/**
 * In-memory хранилище задач и CRUD операции
 * MVP для демонстрации workflow: Решение → Задача → Исполнение
 */

import { 
  Task, 
  TaskComment, 
  CreateTaskParams, 
  UpdateTaskParams, 
  TaskPriority,
  priorityConfig 
} from "@/types/tasks";

const STORAGE_KEY = "business_control_tasks";

// Генератор уникальных ID
let taskIdCounter = 100;
let commentIdCounter = 1000;

function generateTaskId(): string {
  return `task_${++taskIdCounter}`;
}

function generateCommentId(): string {
  return `comment_${++commentIdCounter}`;
}

// Получить текущую дату в формате YYYY-MM-DD
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// Добавить дни к дате
function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// ============================================
// НАЧАЛЬНЫЕ МОКОВЫЕ ДАННЫЕ
// ============================================

const initialTasks: Task[] = [
  {
    id: "task_1",
    title: "Ускорить получение дебиторки от СтройМир",
    description: "Связаться с контрагентом СтройМир и согласовать график погашения задолженности 450 000 ₽. Это критично для предотвращения кассового разрыва 22 января.",
    priority: "critical",
    status: "in_progress",
    assigneeId: "emp_2",
    assigneeName: "Петров Алексей Владимирович",
    dueDate: "2026-01-15",
    createdAt: "2026-01-06T10:30:00Z",
    relatedDecisionId: "decision_1",
    department: "Финансы",
    impactRub: 450000,
    tags: ["дебиторка", "кассовый разрыв"],
    comments: [
      {
        id: "comment_1",
        author: "Петров А.В.",
        text: "Связался с бухгалтерией СтройМир, обещали рассмотреть до конца недели",
        createdAt: "2026-01-07T14:20:00Z"
      }
    ]
  },
  {
    id: "task_2",
    title: "Перебросить экскаватор Volvo на ЖК Солнечный",
    description: "Организовать переброску экскаватора Volvo EC220 с базы на объект ЖК Солнечный. Простой 5 дней, потери ~75 000 ₽.",
    priority: "high",
    status: "new",
    assigneeId: "emp_4",
    assigneeName: "Козлов Дмитрий Николаевич",
    dueDate: "2026-01-08",
    createdAt: "2026-01-06T11:00:00Z",
    relatedDecisionId: "decision_2",
    department: "Операции",
    impactRub: 25000,
    tags: ["техника", "простой"],
    comments: []
  },
  {
    id: "task_3",
    title: "Провести переговоры о допфинансировании Склад Логистик",
    description: "Подготовить обоснование и провести переговоры с заказчиком о дополнительном финансировании 400 000 ₽ на проект Склад Логистик.",
    priority: "high",
    status: "new",
    assigneeId: "emp_1",
    assigneeName: "Иванов Сергей Петрович",
    dueDate: "2026-01-12",
    createdAt: "2026-01-06T12:00:00Z",
    relatedDecisionId: "decision_3",
    department: "Руководство",
    impactRub: 400000,
    tags: ["проект", "бюджет"],
    comments: []
  },
  {
    id: "task_4",
    title: "Направить бульдозер Komatsu на сервис",
    description: "Плановое ТО-2000 для бульдозера Komatsu D65. Наработка 2000 моточасов. Замена масла, фильтров, проверка ходовой.",
    priority: "medium",
    status: "done",
    assigneeId: "emp_4",
    assigneeName: "Козлов Дмитрий Николаевич",
    dueDate: "2026-01-08",
    createdAt: "2026-01-02T09:00:00Z",
    completedAt: "2026-01-06T16:00:00Z",
    relatedDecisionId: "decision_4",
    department: "Операции",
    impactRub: -45000,
    tags: ["ТО", "техника"],
    comments: [
      {
        id: "comment_2",
        author: "Козлов Д.Н.",
        text: "Техника доставлена на сервис",
        createdAt: "2026-01-06T08:30:00Z"
      },
      {
        id: "comment_3",
        author: "Система",
        text: "Задача выполнена. Ожидаемое завершение ТО: 10.01.2026",
        createdAt: "2026-01-06T16:00:00Z"
      }
    ]
  },
  {
    id: "task_5",
    title: "Проверить акты выполненных работ по проекту Офис Технопарк",
    description: "Проект на 90% завершён. Необходимо собрать и проверить все акты выполненных работ перед финальным закрытием.",
    priority: "low",
    status: "new",
    assigneeId: "emp_3",
    assigneeName: "Сидорова Мария Ивановна",
    dueDate: "2026-01-18",
    createdAt: "2026-01-05T10:00:00Z",
    department: "Документооборот",
    tags: ["документы", "проект"],
    comments: []
  },
  {
    id: "task_6",
    title: "Оплатить поставщику Бетон-Плюс",
    description: "Срочная оплата поставщику за материалы. Просрочка может привести к остановке поставок на объект.",
    priority: "critical",
    status: "blocked",
    assigneeId: "emp_3",
    assigneeName: "Сидорова Мария Ивановна",
    dueDate: "2026-01-05",
    createdAt: "2026-01-03T09:00:00Z",
    department: "Финансы",
    impactRub: -320000,
    tags: ["оплата", "поставщик"],
    comments: [
      {
        id: "comment_4",
        author: "Сидорова М.И.",
        text: "Недостаточно средств на счёте. Ожидаем поступление дебиторки.",
        createdAt: "2026-01-05T11:00:00Z"
      }
    ]
  },
  {
    id: "task_7",
    title: "Подготовить отчёт по загрузке техники за декабрь",
    description: "Собрать данные по всем единицам техники, рассчитать коэффициент загрузки и подготовить аналитический отчёт.",
    priority: "medium",
    status: "in_progress",
    assigneeId: "emp_5",
    assigneeName: "Новикова Елена Сергеевна",
    dueDate: "2026-01-10",
    createdAt: "2026-01-04T09:00:00Z",
    department: "Операции",
    tags: ["отчёт", "аналитика"],
    comments: []
  },
  {
    id: "task_8",
    title: "Согласовать график поставок на январь",
    description: "Связаться с поставщиками и согласовать график поставок материалов на январь для всех активных объектов.",
    priority: "high",
    status: "in_progress",
    assigneeId: "emp_5",
    assigneeName: "Новикова Елена Сергеевна",
    dueDate: "2026-01-08",
    createdAt: "2026-01-03T10:00:00Z",
    department: "Снабжение",
    tags: ["поставки", "планирование"],
    comments: []
  },
  {
    id: "task_9",
    title: "Провести инвентаризацию склада",
    description: "Полная инвентаризация материалов и инструментов на центральном складе.",
    priority: "medium",
    status: "new",
    assigneeId: "emp_5",
    assigneeName: "Новикова Елена Сергеевна",
    dueDate: "2026-01-06",
    createdAt: "2026-01-02T08:00:00Z",
    department: "Операции",
    tags: ["склад", "инвентаризация"],
    comments: []
  }
];

// In-memory хранилище
let tasksStore: Task[] = [...initialTasks];
let isInitialized = false;

// ============================================
// STORAGE HELPERS
// ============================================

function saveToStorage() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksStore));
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
        tasksStore = parsed;
        
        // Restore counters
        const maxTaskId = parsed.reduce((max: number, t: Task) => {
          const idNum = parseInt(t.id.replace("task_", ""));
          return !isNaN(idNum) && idNum > max ? idNum : max;
        }, 100);
        taskIdCounter = maxTaskId;

        let maxCommentId = 1000;
        parsed.forEach((t: Task) => {
          if (t.comments) {
            t.comments.forEach((c: TaskComment) => {
              const cNum = parseInt(c.id.replace("comment_", ""));
              if (!isNaN(cNum) && cNum > maxCommentId) maxCommentId = cNum;
            });
          }
        });
        commentIdCounter = maxCommentId;
      }
    } catch (e) {
      console.error("Failed to parse tasks from storage", e);
    }
  }
  isInitialized = true;
}

// ============================================
// CRUD ОПЕРАЦИИ
// ============================================

/**
 * Получить все задачи
 */
export function getAllTasks(): Task[] {
  initFromStorage();
  return [...tasksStore];
}

/**
 * Получить задачу по ID
 */
export function getTaskById(id: string): Task | undefined {
  initFromStorage();
  return tasksStore.find(t => t.id === id);
}

/**
 * Создать новую задачу
 */
export function createTask(params: CreateTaskParams): Task {
  initFromStorage();
  const newTask: Task = {
    id: generateTaskId(),
    title: params.title,
    description: params.description,
    priority: params.priority,
    status: "new",
    assigneeName: params.assigneeName || "Ответственный не назначен",
    dueDate: params.dueDate,
    createdAt: new Date().toISOString(),
    department: params.department,
    relatedDecisionId: params.relatedDecisionId,
    tags: params.tags || [],
    impactRub: params.impactRub,
    comments: []
  };
  
  tasksStore = [newTask, ...tasksStore];
  saveToStorage();
  return newTask;
}

/**
 * Создать задачу из решения ИИ
 */
export function createTaskFromDecision(
  decisionId: string,
  title: string,
  description: string,
  priority: TaskPriority,
  impactRub?: number,
  department?: string
): Task {
  // createTask handles initFromStorage
  const today = getToday();
  const dueDays = priorityConfig[priority].dueDays;
  const dueDate = addDays(today, dueDays);
  
  return createTask({
    title,
    description: `Сформировано из решения ИИ.\n\n${description}`,
    priority,
    dueDate,
    relatedDecisionId: decisionId,
    impactRub,
    department,
    tags: ["ИИ-решение"]
  });
}

/**
 * Обновить задачу
 */
export function updateTask(id: string, params: UpdateTaskParams): Task | null {
  initFromStorage();
  const index = tasksStore.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updated: Task = {
    ...tasksStore[index],
    ...params,
    // Если статус меняется на "done", фиксируем время завершения
    completedAt: params.status === "done" 
      ? new Date().toISOString() 
      : tasksStore[index].completedAt
  };
  
  tasksStore[index] = updated;
  saveToStorage();
  return updated;
}

/**
 * Изменить статус задачи (быстрое действие)
 */
export function changeTaskStatus(id: string, status: Task["status"]): Task | null {
  return updateTask(id, { status });
}

/**
 * Добавить комментарий к задаче
 */
export function addComment(taskId: string, author: string, text: string): TaskComment | null {
  initFromStorage();
  const task = tasksStore.find(t => t.id === taskId);
  if (!task) return null;
  
  const comment: TaskComment = {
    id: generateCommentId(),
    author,
    text,
    createdAt: new Date().toISOString()
  };
  
  task.comments.push(comment);
  saveToStorage();
  return comment;
}

/**
 * Удалить задачу
 */
export function deleteTask(id: string): boolean {
  initFromStorage();
  const index = tasksStore.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasksStore.splice(index, 1);
  saveToStorage();
  return true;
}

// ============================================
// ФИЛЬТРАЦИЯ И СТАТИСТИКА
// ============================================

/**
 * Проверить, просрочена ли задача
 */
export function isOverdue(task: Task): boolean {
  if (task.status === "done" || task.status === "canceled") return false;
  const today = getToday();
  return task.dueDate < today;
}

/**
 * Проверить, задача на сегодня
 */
export function isDueToday(task: Task): boolean {
  if (task.status === "done" || task.status === "canceled") return false;
  return task.dueDate === getToday();
}

/**
 * Получить задачи по фильтру
 */
export function getTasksByFilter(filter: string): Task[] {
  initFromStorage();
  const today = getToday();
  
  switch (filter) {
    case "new":
      return tasksStore.filter(t => t.status === "new");
    case "in_progress":
      return tasksStore.filter(t => t.status === "in_progress");
    case "done":
      return tasksStore.filter(t => t.status === "done");
    case "blocked":
      return tasksStore.filter(t => t.status === "blocked");
    case "overdue":
      return tasksStore.filter(t => isOverdue(t));
    case "today":
      return tasksStore.filter(t => isDueToday(t));
    default:
      return [...tasksStore];
  }
}

/**
 * Получить статистику по задачам
 */
export function getTaskStats() {
  initFromStorage();
  const today = getToday();
  const all = tasksStore;
  
  return {
    total: all.length,
    new: all.filter(t => t.status === "new").length,
    inProgress: all.filter(t => t.status === "in_progress").length,
    done: all.filter(t => t.status === "done").length,
    blocked: all.filter(t => t.status === "blocked").length,
    overdue: all.filter(t => isOverdue(t)).length,
    today: all.filter(t => isDueToday(t)).length,
    thisWeek: all.filter(t => {
      if (t.status === "done" || t.status === "canceled") return false;
      const dueDate = new Date(t.dueDate);
      const todayDate = new Date(today);
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      return dueDate >= todayDate && dueDate <= weekLater;
    }).length
  };
}

/**
 * Сортировка задач: сначала critical/high и просроченные
 */
export function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  };
  
  return [...tasks].sort((a, b) => {
    // Сначала просроченные
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Потом по приоритету
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Потом по дате (ближайшие раньше)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

/**
 * Поиск задач по названию
 */
export function searchTasks(query: string): Task[] {
  initFromStorage();
  const q = query.toLowerCase().trim();
  if (!q) return tasksStore;
  
  return tasksStore.filter(t => 
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.assigneeName.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

// ============================================
// СБРОС ДАННЫХ (для демо)
// ============================================

export function resetTasks(): void {
  tasksStore = [...initialTasks];
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  isInitialized = true;
  taskIdCounter = 100;
  commentIdCounter = 1000;
  saveToStorage();
}
