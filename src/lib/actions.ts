/**
 * Модуль действий для чата
 * Выполняет операции с данными на основе распознанных команд
 */

import { 
  ParsedCommand,
  CreateTaskPayload, 
  UpdateTaskPayload,
  CreateEmployeePayload,
  CreateDecisionPayload,
  ListTasksPayload
} from "./commandParser";
import { createTask, updateTask, getAllTasks, getTaskById } from "./mockTasks";
import { createEmployee, getEmployees, getEmployeeByName } from "./mockEmployees";
import { addDecision, getAllDecisions } from "./mockDecisions";
import { Task } from "@/types/tasks";
import { Employee } from "@/types/employees";
import { Decision } from "@/types/decisions";

// ============================================
// ТИПЫ РЕЗУЛЬТАТОВ
// ============================================

export interface ActionResult {
  success: boolean;
  message: string;
  data?: Task | Employee | Decision | Task[] | null;
  entityType?: "task" | "employee" | "decision" | "tasks";
  entityId?: string | number;
  navigateTo?: string; // URL для перехода
}

// ============================================
// ВЫПОЛНЕНИЕ ДЕЙСТВИЙ
// ============================================

export async function executeAction(command: ParsedCommand): Promise<ActionResult> {
  switch (command.intent) {
    case "CREATE_TASK":
      return executeCreateTask(command.payload as CreateTaskPayload);
    
    case "UPDATE_TASK":
    case "ASSIGN_TASK":
      return executeUpdateTask(command.payload as UpdateTaskPayload);
    
    case "CREATE_EMPLOYEE":
      return executeCreateEmployee(command.payload as CreateEmployeePayload);
    
    case "CREATE_DECISION":
      return executeCreateDecision(command.payload as CreateDecisionPayload);
    
    case "SHOW_OVERDUE":
      return executeShowOverdue();
    
    case "SHOW_EMPLOYEE_TASKS":
      return executeShowEmployeeTasks(command.payload as ListTasksPayload);
    
    default:
      return {
        success: false,
        message: "Не удалось выполнить команду. Попробуйте переформулировать."
      };
  }
}

// ============================================
// СОЗДАНИЕ ЗАДАЧИ
// ============================================

function executeCreateTask(payload: CreateTaskPayload): ActionResult {
  try {
    // Определяем дату по умолчанию (+7 дней)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    
    // Ищем сотрудника по имени, если указан
    let assigneeId: string | undefined;
    let assigneeName: string = "Не назначен";
    
    if (payload.assigneeName) {
      const employee = getEmployeeByName(payload.assigneeName);
      if (employee) {
        assigneeId = employee.id;
        assigneeName = employee.name;
      } else {
        assigneeName = payload.assigneeName;
      }
    }
    
    const task = createTask({
      title: payload.title,
      description: payload.description || "",
      priority: payload.priority || "medium",
      dueDate: payload.dueDate || defaultDueDate.toISOString().split("T")[0],
      assigneeId,
      assigneeName,
      department: payload.department,
      tags: payload.tags,
      impactRub: payload.impactRub,
    });
    
    return {
      success: true,
      message: `✅ Задача создана: "${task.title}"`,
      data: task,
      entityType: "task",
      entityId: task.id,
      navigateTo: `/dashboard/tasks?id=${task.id}`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка создания задачи: ${error}`
    };
  }
}

// ============================================
// ОБНОВЛЕНИЕ ЗАДАЧИ
// ============================================

function executeUpdateTask(payload: UpdateTaskPayload): ActionResult {
  try {
    const existingTask = getTaskById(payload.taskId);
    if (!existingTask) {
      return {
        success: false,
        message: `❌ Задача ${payload.taskId} не найдена`
      };
    }
    
    const updates: Record<string, unknown> = {};
    
    // Обновляем статус
    if (payload.status) {
      updates.status = payload.status;
      if (payload.status === "done") {
        updates.completedAt = new Date().toISOString();
      }
    }
    
    // Сдвигаем дедлайн
    if (payload.dueDateShift) {
      const currentDue = new Date(existingTask.dueDate);
      currentDue.setDate(currentDue.getDate() + payload.dueDateShift);
      updates.dueDate = currentDue.toISOString().split("T")[0];
    }
    
    // Назначаем исполнителя
    if (payload.assigneeName) {
      const employee = getEmployeeByName(payload.assigneeName);
      if (employee) {
        updates.assigneeId = employee.id;
        updates.assigneeName = employee.name;
      } else {
        updates.assigneeName = payload.assigneeName;
      }
    }
    
    const task = updateTask(payload.taskId, updates);
    
    if (!task) {
      return {
        success: false,
        message: `❌ Не удалось обновить задачу ${payload.taskId}`
      };
    }
    
    let statusText = "";
    if (payload.status === "in_progress") statusText = "переведена в работу";
    else if (payload.status === "done") statusText = "отмечена выполненной";
    else if (payload.dueDateShift) statusText = `срок сдвинут на ${payload.dueDateShift} дней`;
    else if (payload.assigneeName) statusText = `назначена на ${task.assigneeName}`;
    
    return {
      success: true,
      message: `✅ Задача ${statusText}: "${task.title}"`,
      data: task,
      entityType: "task",
      entityId: task.id,
      navigateTo: `/dashboard/tasks?id=${task.id}`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка обновления задачи: ${error}`
    };
  }
}

// ============================================
// СОЗДАНИЕ СОТРУДНИКА
// ============================================

function executeCreateEmployee(payload: CreateEmployeePayload): ActionResult {
  try {
    // Определяем отдел по роли
    let department: "sales" | "finance" | "operations" | "management" = "operations";
    
    switch (payload.role) {
      case "owner":
        department = "management";
        break;
      case "accountant":
        department = "finance";
        break;
      case "manager":
        department = "sales";
        break;
      default:
        department = "operations";
    }
    
    const employee = createEmployee({
      name: payload.name,
      role: payload.role,
      department,
      status: "available",
    });
    
    return {
      success: true,
      message: `✅ Сотрудник добавлен: "${employee.name}"`,
      data: employee,
      entityType: "employee",
      entityId: employee.id,
      navigateTo: `/dashboard/employees?id=${employee.id}`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка добавления сотрудника: ${error}`
    };
  }
}

// ============================================
// СОЗДАНИЕ РЕШЕНИЯ
// ============================================

function executeCreateDecision(payload: CreateDecisionPayload): ActionResult {
  try {
    const decision = addDecision({
      title: payload.title,
      priority: payload.priority,
      agent: "User",
      department: payload.department || "Общее",
      impactRub: payload.impactRub || 0,
      reason: payload.reason || "Создано пользователем через ИИ-чат",
      effect: "Ожидает оценки",
      risks: [],
      nextStep: {
        text: "Определить следующий шаг",
        amount: "0 ₽",
        effort: "medium",
        deadline: "7 дней"
      },
      alternatives: []
    });
    
    return {
      success: true,
      message: `✅ Решение создано: "${decision.title}"`,
      data: decision,
      entityType: "decision",
      entityId: decision.id,
      navigateTo: `/dashboard/decisions?id=${decision.id}`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка создания решения: ${error}`
    };
  }
}

// ============================================
// ПОКАЗАТЬ ПРОСРОЧЕННЫЕ ЗАДАЧИ
// ============================================

function executeShowOverdue(): ActionResult {
  try {
    const allTasks = getAllTasks();
    const today = new Date().toISOString().split("T")[0];
    
    const overdueTasks = allTasks.filter(task => 
      task.status !== "done" && 
      task.status !== "canceled" && 
      task.dueDate < today
    );
    
    if (overdueTasks.length === 0) {
      return {
        success: true,
        message: "✅ Просроченных задач нет!",
        data: [],
        entityType: "tasks"
      };
    }
    
    return {
      success: true,
      message: `⚠️ Найдено ${overdueTasks.length} просроченных задач`,
      data: overdueTasks,
      entityType: "tasks",
      navigateTo: `/dashboard/tasks?filter=overdue`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка получения задач: ${error}`
    };
  }
}

// ============================================
// ПОКАЗАТЬ ЗАДАЧИ СОТРУДНИКА
// ============================================

function executeShowEmployeeTasks(payload: ListTasksPayload): ActionResult {
  try {
    if (!payload.assigneeName) {
      return {
        success: false,
        message: "❌ Не указано имя сотрудника"
      };
    }
    
    const allTasks = getAllTasks();
    const lowerName = payload.assigneeName.toLowerCase();
    
    const employeeTasks = allTasks.filter(task => 
      task.assigneeName?.toLowerCase().includes(lowerName)
    );
    
    if (employeeTasks.length === 0) {
      return {
        success: true,
        message: `📋 У сотрудника "${payload.assigneeName}" нет задач`,
        data: [],
        entityType: "tasks"
      };
    }
    
    const activeTasks = employeeTasks.filter(t => t.status !== "done" && t.status !== "canceled");
    
    return {
      success: true,
      message: `📋 Найдено ${employeeTasks.length} задач (${activeTasks.length} активных)`,
      data: employeeTasks,
      entityType: "tasks"
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка получения задач: ${error}`
    };
  }
}
