/**
 * Mock-данные для раздела Операции
 * Единая лента всех операций с фильтрацией по датам
 * Связи: Техника ↔ Сотрудники ↔ Проекты ↔ Финансы ↔ Задачи
 */

import {
  OperationEvent,
  OperationsDashboard,
  EquipmentUtilization,
  EmployeeWorkload,
  ProjectOperationStatus,
  Shift,
  DailyAssignment,
} from "@/types/operations";

// ============================================
// СОБЫТИЯ ОПЕРАЦИЙ (Последние 30 дней)
// ============================================

// Генерируем даты для последних дней
const today = new Date();
const getDateStr = (daysAgo: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const getDateOnly = (daysAgo: number): string => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Операционные события за месяц
export const mockOperationEvents: OperationEvent[] = [
  // Сегодня
  {
    id: "evt_001",
    type: "shift_started",
    priority: "low",
    status: "resolved",
    title: "Начало смены на ЖК Солнечный",
    description: "Дневная смена началась. 3 оператора, 2 единицы техники.",
    timestamp: getDateStr(0),
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
  },
  {
    id: "evt_002",
    type: "equipment_assigned",
    priority: "medium",
    status: "resolved",
    title: "Экскаватор CAT 320 назначен на объект",
    description: "Техника переброшена с базы на ЖК Солнечный.",
    timestamp: getDateStr(0),
    equipmentId: "eq_1",
    equipmentName: "Экскаватор CAT 320",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    employeeId: "emp_1",
    employeeName: "Иванов Алексей",
  },
  {
    id: "evt_003",
    type: "task_completed",
    priority: "medium",
    status: "resolved",
    title: "Задача выполнена: Земляные работы котлован",
    description: "Выполнено 120 м³ грунта. Эффективность 110%.",
    timestamp: getDateStr(0),
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    taskId: "task_001",
    financialImpact: 84000,
  },
  {
    id: "evt_004",
    type: "payment_received",
    priority: "high",
    status: "resolved",
    title: "Получена оплата от ООО СтройМир",
    description: "Частичная оплата по акту №45 за январь.",
    timestamp: getDateStr(0),
    contractorId: "contr_1",
    contractorName: "ООО «СтройМир»",
    financialImpact: 450000,
  },
  {
    id: "evt_005",
    type: "equipment_idle",
    priority: "high",
    status: "pending",
    title: "Простой: Самосвал КАМАЗ 6520",
    description: "Техника простаивает 3 день. Нет заявок на перевозку.",
    timestamp: getDateStr(0),
    equipmentId: "eq_3",
    equipmentName: "Самосвал КАМАЗ 6520",
    lossPerDay: 15000,
    financialImpact: -45000,
    suggestedAction: "Разместить на субаренду или перебросить на Склад Логистик",
  },
  // Вчера
  {
    id: "evt_006",
    type: "equipment_maintenance",
    priority: "medium",
    status: "in_progress",
    title: "ТО: Кран LIEBHERR LTM 1050",
    description: "Плановое техобслуживание. Ожидаемый срок 2 дня.",
    timestamp: getDateStr(1),
    equipmentId: "eq_4",
    equipmentName: "Кран LIEBHERR LTM 1050",
  },
  {
    id: "evt_007",
    type: "employee_absent",
    priority: "medium",
    status: "resolved",
    title: "Отсутствие: Сидоров Михаил",
    description: "Больничный лист. Замена назначена - Козлов Андрей.",
    timestamp: getDateStr(1),
    employeeId: "emp_3",
    employeeName: "Сидоров Михаил",
    projectId: "proj_2",
    projectName: "Склад Логистик",
  },
  {
    id: "evt_008",
    type: "project_paused",
    priority: "high",
    status: "pending",
    title: "Приостановка: Офис Технопарк",
    description: "Заказчик попросил паузу на 1 неделю для согласования изменений.",
    timestamp: getDateStr(1),
    projectId: "proj_3",
    projectName: "Офис Технопарк",
    contractorId: "contr_4",
    contractorName: "ООО «Технопарк Инвест»",
    financialImpact: -75000,
    lossPerDay: 15000,
  },
  {
    id: "evt_009",
    type: "shift_ended",
    priority: "low",
    status: "resolved",
    title: "Завершение смены на Дорога Северная",
    description: "Дневная смена завершена. Выполнено 85% плана.",
    timestamp: getDateStr(1),
    projectId: "proj_4",
    projectName: "Дорога Северная",
  },
  // 2 дня назад
  {
    id: "evt_010",
    type: "task_overdue",
    priority: "critical",
    status: "pending",
    title: "Просрочена задача: Сдача документации",
    description: "Исполнительная документация по этапу 2 просрочена на 2 дня.",
    timestamp: getDateStr(2),
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    taskId: "task_002",
    employeeId: "emp_5",
    employeeName: "Новикова Елена",
    suggestedAction: "Назначить дополнительного сотрудника или перенести срок",
  },
  {
    id: "evt_011",
    type: "equipment_breakdown",
    priority: "critical",
    status: "resolved",
    title: "Поломка: Погрузчик Volvo L120",
    description: "Неисправность гидросистемы. Ремонт выполнен на месте.",
    timestamp: getDateStr(2),
    equipmentId: "eq_2",
    equipmentName: "Погрузчик Volvo L120",
    projectId: "proj_2",
    projectName: "Склад Логистик",
    financialImpact: -32000,
    resolvedAt: getDateStr(1),
    resolvedBy: "Механик Федоров П.А.",
  },
  {
    id: "evt_012",
    type: "payment_overdue",
    priority: "critical",
    status: "pending",
    title: "Просроченная оплата: ООО ЛогистикГрупп",
    description: "Дебиторская задолженность 275 000 ₽. Просрочка 5 дней.",
    timestamp: getDateStr(2),
    contractorId: "contr_2",
    contractorName: "ООО «ЛогистикГрупп»",
    financialImpact: -275000,
    suggestedAction: "Связаться с бухгалтерией, отправить напоминание",
  },
  // 3 дня назад
  {
    id: "evt_013",
    type: "project_started",
    priority: "high",
    status: "resolved",
    title: "Начало работ: Дорога Северная",
    description: "Подготовительный этап завершён, начаты основные работы.",
    timestamp: getDateStr(3),
    projectId: "proj_4",
    projectName: "Дорога Северная",
    contractorId: "contr_5",
    contractorName: "Администрация г. Химки",
  },
  {
    id: "evt_014",
    type: "employee_assigned",
    priority: "medium",
    status: "resolved",
    title: "Назначение: Петров Сергей на ЖК Солнечный",
    description: "Оператор назначен запасным на экскаватор CAT 320.",
    timestamp: getDateStr(3),
    employeeId: "emp_2",
    employeeName: "Петров Сергей",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    equipmentId: "eq_1",
    equipmentName: "Экскаватор CAT 320",
  },
  // 5 дней назад
  {
    id: "evt_015",
    type: "risk_detected",
    priority: "high",
    status: "in_progress",
    title: "Риск: Отставание по срокам Склад Логистик",
    description: "Прогнозируемое отставание 5-7 дней из-за погодных условий.",
    timestamp: getDateStr(5),
    projectId: "proj_2",
    projectName: "Склад Логистик",
    suggestedAction: "Увеличить количество смен или привлечь субподряд",
  },
  {
    id: "evt_016",
    type: "equipment_unassigned",
    priority: "medium",
    status: "resolved",
    title: "Техника снята: Бульдозер SHANTUI SD22",
    description: "Завершены работы по планировке на ЖК Солнечный.",
    timestamp: getDateStr(5),
    equipmentId: "eq_5",
    equipmentName: "Бульдозер SHANTUI SD22",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
  },
  // Неделю назад
  {
    id: "evt_017",
    type: "payment_received",
    priority: "high",
    status: "resolved",
    title: "Аванс: ООО СтройМир",
    description: "Получен аванс 30% по новому этапу работ.",
    timestamp: getDateStr(7),
    contractorId: "contr_1",
    contractorName: "ООО «СтройМир»",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    financialImpact: 1350000,
  },
  {
    id: "evt_018",
    type: "task_created",
    priority: "medium",
    status: "resolved",
    title: "Создана задача: Подготовка площадки",
    description: "Задача от Business AI: подготовить площадку для нового этапа.",
    timestamp: getDateStr(7),
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    taskId: "task_003",
  },
  // 2 недели назад
  {
    id: "evt_019",
    type: "project_completed",
    priority: "high",
    status: "resolved",
    title: "Завершён проект: Благоустройство двора",
    description: "Проект сдан заказчику, акты подписаны.",
    timestamp: getDateStr(14),
    projectId: "proj_old_1",
    projectName: "Благоустройство двора ул. Мира",
    contractorId: "contr_6",
    contractorName: "ТСЖ «Уют»",
    financialImpact: 890000,
  },
  // Месяц назад
  {
    id: "evt_020",
    type: "equipment_assigned",
    priority: "medium",
    status: "resolved",
    title: "Новая техника: Экскаватор Hitachi ZX200",
    description: "Техника получена по лизингу и введена в эксплуатацию.",
    timestamp: getDateStr(30),
    equipmentId: "eq_6",
    equipmentName: "Экскаватор Hitachi ZX200",
  },
];

// ============================================
// ЗАГРУЗКА ТЕХНИКИ
// ============================================

export const mockEquipmentUtilization: EquipmentUtilization[] = [
  {
    equipmentId: "eq_1",
    equipmentName: "Экскаватор CAT 320",
    equipmentCategory: "excavator",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    status: "working",
    hoursToday: 6.5,
    hoursThisWeek: 38,
    hoursThisMonth: 156,
    utilizationPercent: 85,
    revenueToday: 22750,
    revenueThisMonth: 546000,
    operatorId: "emp_1",
    operatorName: "Иванов Алексей",
    lastActivity: getDateStr(0),
  },
  {
    equipmentId: "eq_2",
    equipmentName: "Погрузчик Volvo L120",
    equipmentCategory: "loader",
    projectId: "proj_2",
    projectName: "Склад Логистик",
    status: "working",
    hoursToday: 7,
    hoursThisWeek: 42,
    hoursThisMonth: 168,
    utilizationPercent: 92,
    revenueToday: 17500,
    revenueThisMonth: 420000,
    operatorId: "emp_3",
    operatorName: "Сидоров Михаил",
    lastActivity: getDateStr(0),
  },
  {
    equipmentId: "eq_3",
    equipmentName: "Самосвал КАМАЗ 6520",
    equipmentCategory: "truck",
    projectId: "",
    projectName: "База",
    status: "idle",
    hoursToday: 0,
    hoursThisWeek: 0,
    hoursThisMonth: 24,
    utilizationPercent: 13,
    revenueToday: 0,
    revenueThisMonth: 48000,
    operatorId: "emp_4",
    operatorName: "Козлов Андрей",
    lastActivity: getDateStr(3),
  },
  {
    equipmentId: "eq_4",
    equipmentName: "Кран LIEBHERR LTM 1050",
    equipmentCategory: "crane",
    projectId: "",
    projectName: "СТО (ТО)",
    status: "maintenance",
    hoursToday: 0,
    hoursThisWeek: 16,
    hoursThisMonth: 98,
    utilizationPercent: 54,
    revenueToday: 0,
    revenueThisMonth: 392000,
    lastActivity: getDateStr(1),
  },
  {
    equipmentId: "eq_5",
    equipmentName: "Бульдозер SHANTUI SD22",
    equipmentCategory: "bulldozer",
    projectId: "proj_4",
    projectName: "Дорога Северная",
    status: "working",
    hoursToday: 8,
    hoursThisWeek: 44,
    hoursThisMonth: 172,
    utilizationPercent: 94,
    revenueToday: 24000,
    revenueThisMonth: 516000,
    operatorId: "emp_6",
    operatorName: "Морозов Дмитрий",
    lastActivity: getDateStr(0),
  },
  {
    equipmentId: "eq_6",
    equipmentName: "Экскаватор Hitachi ZX200",
    equipmentCategory: "excavator",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    status: "working",
    hoursToday: 5,
    hoursThisWeek: 32,
    hoursThisMonth: 128,
    utilizationPercent: 70,
    revenueToday: 15000,
    revenueThisMonth: 384000,
    operatorId: "emp_7",
    operatorName: "Белов Николай",
    lastActivity: getDateStr(0),
  },
];

// ============================================
// ЗАГРУЗКА СОТРУДНИКОВ
// ============================================

export const mockEmployeeWorkload: EmployeeWorkload[] = [
  {
    employeeId: "emp_1",
    employeeName: "Иванов Алексей",
    position: "Оператор экскаватора",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    status: "working",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    hoursWorked: 6.5,
    tasksAssigned: 3,
    tasksCompleted: 2,
    performance: 95,
  },
  {
    employeeId: "emp_3",
    employeeName: "Сидоров Михаил",
    position: "Оператор погрузчика",
    projectId: "proj_2",
    projectName: "Склад Логистик",
    status: "sick",
    hoursWorked: 0,
    tasksAssigned: 2,
    tasksCompleted: 0,
    performance: 0,
  },
  {
    employeeId: "emp_4",
    employeeName: "Козлов Андрей",
    position: "Водитель самосвала",
    projectId: "",
    projectName: "",
    status: "absent",
    hoursWorked: 0,
    tasksAssigned: 0,
    tasksCompleted: 0,
    performance: 0,
  },
  {
    employeeId: "emp_5",
    employeeName: "Новикова Елена",
    position: "Инженер ПТО",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    status: "working",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    hoursWorked: 5,
    tasksAssigned: 5,
    tasksCompleted: 2,
    performance: 72,
  },
  {
    employeeId: "emp_6",
    employeeName: "Морозов Дмитрий",
    position: "Оператор бульдозера",
    projectId: "proj_4",
    projectName: "Дорога Северная",
    status: "working",
    shiftStart: "07:00",
    shiftEnd: "16:00",
    hoursWorked: 8,
    tasksAssigned: 2,
    tasksCompleted: 2,
    performance: 110,
  },
  {
    employeeId: "emp_7",
    employeeName: "Белов Николай",
    position: "Оператор экскаватора",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    status: "working",
    shiftStart: "08:00",
    shiftEnd: "17:00",
    hoursWorked: 5,
    tasksAssigned: 2,
    tasksCompleted: 1,
    performance: 88,
  },
];

// ============================================
// СТАТУС ПРОЕКТОВ
// ============================================

export const mockProjectOperationStatus: ProjectOperationStatus[] = [
  {
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    projectType: "construction",
    contractorId: "contr_1",
    contractorName: "ООО «СтройМир»",
    status: "active",
    progress: 75,
    daysRemaining: 62,
    isDelayed: false,
    equipmentCount: 2,
    employeeCount: 4,
    equipmentUtilization: 78,
    budgetUsed: 3200000,
    budgetTotal: 4500000,
    budgetPercent: 71,
    isOverBudget: false,
    activeRisks: 1,
    criticalRisks: 0,
  },
  {
    projectId: "proj_2",
    projectName: "Склад Логистик",
    projectType: "construction",
    contractorId: "contr_2",
    contractorName: "ООО «ЛогистикГрупп»",
    status: "delayed",
    progress: 45,
    daysRemaining: 47,
    isDelayed: true,
    delayDays: 5,
    equipmentCount: 1,
    employeeCount: 2,
    equipmentUtilization: 92,
    budgetUsed: 1800000,
    budgetTotal: 2800000,
    budgetPercent: 64,
    isOverBudget: false,
    activeRisks: 2,
    criticalRisks: 1,
  },
  {
    projectId: "proj_3",
    projectName: "Офис Технопарк",
    projectType: "construction",
    contractorId: "contr_4",
    contractorName: "ООО «Технопарк Инвест»",
    status: "paused",
    progress: 90,
    daysRemaining: 8,
    isDelayed: false,
    equipmentCount: 0,
    employeeCount: 0,
    equipmentUtilization: 0,
    budgetUsed: 1050000,
    budgetTotal: 1200000,
    budgetPercent: 88,
    isOverBudget: false,
    activeRisks: 1,
    criticalRisks: 0,
  },
  {
    projectId: "proj_4",
    projectName: "Дорога Северная",
    projectType: "construction",
    contractorId: "contr_5",
    contractorName: "Администрация г. Химки",
    status: "on_track",
    progress: 30,
    daysRemaining: 108,
    isDelayed: false,
    equipmentCount: 1,
    employeeCount: 2,
    equipmentUtilization: 94,
    budgetUsed: 850000,
    budgetTotal: 3200000,
    budgetPercent: 27,
    isOverBudget: false,
    activeRisks: 0,
    criticalRisks: 0,
  },
];

// ============================================
// СМЕНЫ
// ============================================

export const mockShifts: Shift[] = [
  {
    id: "shift_001",
    date: getDateOnly(0),
    type: "day",
    status: "active",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    employees: [
      { employeeId: "emp_1", employeeName: "Иванов Алексей", role: "Оператор", hoursWorked: 6.5, status: "started" },
      { employeeId: "emp_5", employeeName: "Новикова Елена", role: "Инженер ПТО", hoursWorked: 5, status: "started" },
      { employeeId: "emp_7", employeeName: "Белов Николай", role: "Оператор", hoursWorked: 5, status: "started" },
    ],
    equipment: [
      { equipmentId: "eq_1", equipmentName: "Экскаватор CAT 320", hoursWorked: 6.5, status: "working" },
      { equipmentId: "eq_6", equipmentName: "Экскаватор Hitachi ZX200", hoursWorked: 5, status: "working" },
    ],
    plannedHours: 24,
    actualHours: 16.5,
    plannedOutput: "150 м³ грунта",
    actualOutput: "135 м³ грунта",
    scheduledStart: `${getDateOnly(0)}T08:00:00`,
    scheduledEnd: `${getDateOnly(0)}T17:00:00`,
    actualStart: `${getDateOnly(0)}T08:15:00`,
  },
  {
    id: "shift_002",
    date: getDateOnly(0),
    type: "day",
    status: "active",
    projectId: "proj_4",
    projectName: "Дорога Северная",
    employees: [
      { employeeId: "emp_6", employeeName: "Морозов Дмитрий", role: "Оператор", hoursWorked: 8, status: "completed" },
    ],
    equipment: [
      { equipmentId: "eq_5", equipmentName: "Бульдозер SHANTUI SD22", hoursWorked: 8, status: "working" },
    ],
    plannedHours: 8,
    actualHours: 8,
    plannedOutput: "200 м² планировки",
    actualOutput: "220 м² планировки",
    scheduledStart: `${getDateOnly(0)}T07:00:00`,
    scheduledEnd: `${getDateOnly(0)}T16:00:00`,
    actualStart: `${getDateOnly(0)}T07:00:00`,
    actualEnd: `${getDateOnly(0)}T16:00:00`,
  },
  {
    id: "shift_003",
    date: getDateOnly(1),
    type: "day",
    status: "completed",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    employees: [
      { employeeId: "emp_1", employeeName: "Иванов Алексей", role: "Оператор", hoursWorked: 8, status: "completed" },
      { employeeId: "emp_5", employeeName: "Новикова Елена", role: "Инженер ПТО", hoursWorked: 8, status: "completed" },
    ],
    equipment: [
      { equipmentId: "eq_1", equipmentName: "Экскаватор CAT 320", hoursWorked: 8, status: "working" },
    ],
    plannedHours: 16,
    actualHours: 16,
    plannedOutput: "130 м³ грунта",
    actualOutput: "128 м³ грунта",
    scheduledStart: `${getDateOnly(1)}T08:00:00`,
    scheduledEnd: `${getDateOnly(1)}T17:00:00`,
    actualStart: `${getDateOnly(1)}T08:00:00`,
    actualEnd: `${getDateOnly(1)}T17:00:00`,
  },
];

// ============================================
// ЗАДАНИЯ НА ДЕНЬ
// ============================================

export const mockDailyAssignments: DailyAssignment[] = [
  {
    id: "assign_001",
    date: getDateOnly(0),
    shiftId: "shift_001",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    equipmentId: "eq_1",
    equipmentName: "Экскаватор CAT 320",
    employeeId: "emp_1",
    employeeName: "Иванов Алексей",
    task: "Выемка грунта котлована, сектор Б-3",
    status: "in_progress",
    priority: "high",
    plannedHours: 8,
    actualHours: 6.5,
  },
  {
    id: "assign_002",
    date: getDateOnly(0),
    shiftId: "shift_001",
    projectId: "proj_1",
    projectName: "ЖК Солнечный",
    employeeId: "emp_5",
    employeeName: "Новикова Елена",
    task: "Подготовка исполнительной документации этап 2",
    status: "blocked",
    priority: "high",
    plannedHours: 8,
    actualHours: 5,
    blockedReason: "Ожидание согласования от заказчика",
  },
  {
    id: "assign_003",
    date: getDateOnly(0),
    shiftId: "shift_002",
    projectId: "proj_4",
    projectName: "Дорога Северная",
    equipmentId: "eq_5",
    equipmentName: "Бульдозер SHANTUI SD22",
    employeeId: "emp_6",
    employeeName: "Морозов Дмитрий",
    task: "Планировка земляного полотна ПК 5+00 - ПК 7+00",
    status: "completed",
    priority: "medium",
    plannedHours: 8,
    actualHours: 8,
    completedAt: getDateStr(0),
  },
  {
    id: "assign_004",
    date: getDateOnly(0),
    projectId: "proj_2",
    projectName: "Склад Логистик",
    equipmentId: "eq_2",
    equipmentName: "Погрузчик Volvo L120",
    employeeId: "emp_8",
    employeeName: "Замена: Федоров Павел",
    task: "Погрузочные работы, склад временного хранения",
    status: "in_progress",
    priority: "medium",
    plannedHours: 8,
    actualHours: 7,
    notes: "Замена больного Сидорова М.",
  },
];

// ============================================
// ДАШБОРД ОПЕРАЦИЙ
// ============================================

export const mockOperationsDashboard: OperationsDashboard = {
  date: getDateOnly(0),
  
  // Техника
  totalEquipment: 6,
  workingEquipment: 4,
  idleEquipment: 1,
  maintenanceEquipment: 1,
  avgUtilization: 68,
  
  // Объекты
  activeProjects: 4,
  delayedProjects: 1,
  onTrackProjects: 2,
  
  // Сотрудники
  totalEmployees: 8,
  workingEmployees: 5,
  absentEmployees: 2,
  
  // Финансовые показатели
  todayRevenue: 79250,
  todayExpenses: 45000,
  idleLossesPerDay: 15000,
  monthRevenue: 2306000,
  monthExpenses: 1450000,
  
  // События
  pendingEvents: 4,
  criticalEvents: 2,
  
  // Задачи
  tasksToday: 12,
  tasksCompleted: 7,
  tasksOverdue: 2,
};

// ============================================
// ХЕЛПЕРЫ
// ============================================

/**
 * Получить события за период
 */
export function getEventsByPeriod(
  period: 'today' | 'week' | 'month' | 'year' | 'all',
  events: OperationEvent[] = mockOperationEvents
): OperationEvent[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = startOfDay;
      break;
    case 'week':
      startDate = new Date(startOfDay);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(startOfDay);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(startOfDay);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
    default:
      return events;
  }
  
  return events.filter(event => new Date(event.timestamp) >= startDate);
}

/**
 * Получить события по типу
 */
export function getEventsByType(
  types: OperationEvent['type'][],
  events: OperationEvent[] = mockOperationEvents
): OperationEvent[] {
  return events.filter(event => types.includes(event.type));
}

/**
 * Группировка событий по дате
 */
export function groupEventsByDate(events: OperationEvent[]): Record<string, OperationEvent[]> {
  return events.reduce((acc, event) => {
    const date = event.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, OperationEvent[]>);
}

/**
 * Статистика по событиям
 */
export function getEventsStats(events: OperationEvent[]) {
  const total = events.length;
  const pending = events.filter(e => e.status === 'pending').length;
  const resolved = events.filter(e => e.status === 'resolved').length;
  const critical = events.filter(e => e.priority === 'critical').length;
  const high = events.filter(e => e.priority === 'high').length;
  
  const totalImpact = events.reduce((sum, e) => sum + (e.financialImpact || 0), 0);
  const positiveImpact = events.filter(e => (e.financialImpact || 0) > 0).reduce((sum, e) => sum + (e.financialImpact || 0), 0);
  const negativeImpact = events.filter(e => (e.financialImpact || 0) < 0).reduce((sum, e) => sum + (e.financialImpact || 0), 0);
  
  return {
    total,
    pending,
    resolved,
    inProgress: events.filter(e => e.status === 'in_progress').length,
    critical,
    high,
    totalImpact,
    positiveImpact,
    negativeImpact,
  };
}
