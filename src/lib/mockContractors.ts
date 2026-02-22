/**
 * Mock-данные для раздела Контрагенты и Объекты
 * Связи с техникой, сотрудниками и финансами
 */

import {
  Project,
  ProjectType,
  ProjectExpense,
  ProjectIncome,
  ProjectMonthlySummary,
  Contractor,
  ContractorType,
  ContractorSummary,
} from "@/types/contractors";

// ============================================
// КОНТРАГЕНТЫ
// ============================================

const contractorsData: Contractor[] = [
  {
    id: "contr_1",
    name: "ООО «СтройМир»",
    type: "customer",
    inn: "7701234567",
    kpp: "770101001",
    ogrn: "1177746012345",
    legalAddress: "г. Москва, ул. Строителей, д. 10, офис 501",
    actualAddress: "г. Москва, ул. Строителей, д. 10, офис 501",
    contacts: [
      { id: "cont_1", name: "Петров Иван Сергеевич", position: "Генеральный директор", phone: "+7 (495) 123-45-67", email: "petrov@stroymir.ru", isMain: true },
      { id: "cont_2", name: "Сидорова Мария Петровна", position: "Главный бухгалтер", phone: "+7 (495) 123-45-68", email: "sidorova@stroymir.ru", isMain: false },
    ],
    phone: "+7 (495) 123-45-67",
    email: "info@stroymir.ru",
    website: "stroymir.ru",
    bankDetails: {
      bankName: "ПАО Сбербанк",
      bik: "044525225",
      accountNumber: "40702810938000012345",
      correspondentAccount: "30101810400000000225",
    },
    reputation: "excellent",
    reputationNotes: "Надёжный партнёр, работаем 3 года",
    paymentDiscipline: "excellent",
    totalProjects: 3,
    activeProjects: 2,
    totalIncome: 18500000,
    totalReceivables: 890000,
    overdueReceivables: 0,
    averagePaymentDelay: 0,
    createdAt: "2022-03-15T00:00:00Z",
    lastActivityAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "contr_2",
    name: "ООО «ЛогистикГрупп»",
    type: "customer",
    inn: "5001234567",
    kpp: "500101001",
    legalAddress: "МО, г. Видное, ул. Промышленная, д. 5",
    contacts: [
      { id: "cont_3", name: "Козлов Андрей Викторович", position: "Директор", phone: "+7 (495) 987-65-43", email: "kozlov@logistik.ru", isMain: true },
    ],
    phone: "+7 (495) 987-65-43",
    email: "info@logistik.ru",
    reputation: "good",
    paymentDiscipline: "good",
    totalProjects: 1,
    activeProjects: 1,
    totalIncome: 2750000,
    totalReceivables: 275000,
    overdueReceivables: 0,
    averagePaymentDelay: 3,
    createdAt: "2024-06-01T00:00:00Z",
    lastActivityAt: "2025-01-08T00:00:00Z",
  },
  {
    id: "contr_3",
    name: "ИП Михайлов А.С.",
    type: "supplier",
    inn: "771234567890",
    legalAddress: "г. Москва, ул. Складская, д. 15",
    contacts: [
      { id: "cont_4", name: "Михайлов Алексей Сергеевич", position: "ИП", phone: "+7 (926) 111-22-33", email: "mihailov@mail.ru", isMain: true },
    ],
    phone: "+7 (926) 111-22-33",
    email: "mihailov@mail.ru",
    reputation: "good",
    paymentDiscipline: "good",
    totalProjects: 2,
    activeProjects: 2,
    totalIncome: 0,
    totalReceivables: 0,
    overdueReceivables: 0,
    averagePaymentDelay: 0,
    createdAt: "2023-01-10T00:00:00Z",
    lastActivityAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "contr_4",
    name: "ООО «ТехноСтрой»",
    type: "subcontractor",
    inn: "7702345678",
    kpp: "770201001",
    legalAddress: "г. Москва, ул. Промышленная, д. 25",
    contacts: [
      { id: "cont_5", name: "Николаев Дмитрий Павлович", position: "Директор", phone: "+7 (495) 555-44-33", email: "nikolaev@technostroy.ru", isMain: true },
    ],
    phone: "+7 (495) 555-44-33",
    email: "info@technostroy.ru",
    reputation: "neutral",
    reputationNotes: "Задерживает сроки, но качество хорошее",
    paymentDiscipline: "average",
    totalProjects: 1,
    activeProjects: 1,
    totalIncome: 0,
    totalReceivables: 0,
    overdueReceivables: 0,
    averagePaymentDelay: 0,
    createdAt: "2024-09-01T00:00:00Z",
    lastActivityAt: "2025-01-07T00:00:00Z",
  },
  {
    id: "contr_5",
    name: "ООО «ГлавСтрой»",
    type: "customer",
    inn: "7703456789",
    kpp: "770301001",
    legalAddress: "г. Москва, ул. Центральная, д. 100",
    contacts: [
      { id: "cont_6", name: "Иванов Сергей Петрович", position: "Зам. директора", phone: "+7 (495) 777-88-99", email: "ivanov@glavstroy.ru", isMain: true },
    ],
    phone: "+7 (495) 777-88-99",
    email: "info@glavstroy.ru",
    reputation: "problematic",
    reputationNotes: "Задерживает оплату, спорные акты",
    paymentDiscipline: "poor",
    totalProjects: 1,
    activeProjects: 0,
    totalIncome: 3200000,
    totalReceivables: 450000,
    overdueReceivables: 450000,
    averagePaymentDelay: 25,
    createdAt: "2024-01-15T00:00:00Z",
    lastActivityAt: "2024-12-20T00:00:00Z",
  },
];

// ============================================
// ОБЪЕКТЫ (ПРОЕКТЫ)
// ============================================

const projectsData: Project[] = [
  {
    id: "proj_1",
    name: "ЖК «Солнечный»",
    type: "construction",
    status: "active",
    contractorId: "contr_1",
    contractorName: "ООО «СтройМир»",
    address: "г. Москва, ул. Солнечная, д. 15",
    coordinates: { lat: 55.7558, lng: 37.6173 },
    startDate: "2024-09-10",
    plannedEndDate: "2025-04-30",
    contractAmount: 12000000,
    receivedAmount: 6300000,
    remainingAmount: 5700000,
    equipment: [
      { equipmentId: "eq_1", equipmentName: "Экскаватор CAT 320", assignedDate: "2024-09-15", hoursPlanned: 500, hoursWorked: 320, hourlyRate: 3500, income: 1120000 },
      { equipmentId: "eq_5", equipmentName: "Автокран Liebherr LTM 1050", assignedDate: "2024-11-01", hoursPlanned: 200, hoursWorked: 145, hourlyRate: 5000, income: 725000 },
    ],
    employees: [
      { employeeId: "emp_1", employeeName: "Иванов Алексей", role: "Машинист экскаватора", assignedDate: "2024-09-15", salaryPaid: 475000 },
      { employeeId: "emp_6", employeeName: "Николаев Виктор", role: "Крановщик", assignedDate: "2024-11-01", salaryPaid: 330000 },
      { employeeId: "emp_10", employeeName: "Смирнов Павел", role: "Прораб", assignedDate: "2024-09-10", salaryPaid: 540000 },
    ],
    documents: [
      { id: "doc_1", type: "contract", name: "Договор подряда №45/2024", date: "2024-09-01", amount: 12000000, status: "signed" },
      { id: "doc_2", type: "schedule", name: "ГПР ЖК Солнечный", date: "2024-09-05" },
      { id: "doc_3", type: "estimate", name: "Смета работ", date: "2024-09-01", amount: 10500000 },
      { id: "doc_4", type: "act", name: "Акт КС-2 №1", date: "2024-11-30", amount: 3200000, status: "paid" },
      { id: "doc_5", type: "act", name: "Акт КС-2 №2", date: "2024-12-31", amount: 3100000, status: "paid" },
      { id: "doc_6", type: "invoice", name: "Счёт №12 на оплату", date: "2025-01-10", amount: 2800000, status: "draft" },
    ],
    risks: [
      { id: "risk_1", type: "deadline", description: "Возможна задержка из-за погоды в феврале", severity: "medium", detectedAt: "2025-01-05" },
    ],
    totalIncome: 6300000,
    totalExpenses: 4870000,
    profit: 1430000,
    profitMargin: 22.7,
    estimatedExpenses: {
      salary: 2500000,
      equipment: 2000000,
      materials: 5000000,
      other: 1000000,
    },
    description: "Строительство жилого комплекса «Солнечный» — земляные работы, фундамент, каркас",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "proj_2",
    name: "Склад «Логистик»",
    type: "equipment_services",
    status: "active",
    contractorId: "contr_2",
    contractorName: "ООО «ЛогистикГрупп»",
    address: "МО, г. Видное, ул. Складская, д. 10",
    startDate: "2024-06-01",
    isHourlyBased: true,
    equipment: [
      { equipmentId: "eq_2", equipmentName: "Погрузчик Volvo L120", assignedDate: "2024-06-01", hoursWorked: 890, hourlyRate: 2500, income: 2225000 },
    ],
    employees: [
      { employeeId: "emp_3", employeeName: "Сидоров Михаил", role: "Оператор погрузчика", assignedDate: "2024-06-01", salaryPaid: 640000 },
    ],
    documents: [
      { id: "doc_7", type: "contract", name: "Договор услуг техники №12/2024", date: "2024-06-01", status: "signed" },
      { id: "doc_8", type: "act", name: "Акт выполненных работ декабрь", date: "2024-12-31", amount: 275000, status: "paid" },
    ],
    risks: [],
    totalIncome: 2750000,
    totalExpenses: 1890000,
    profit: 860000,
    profitMargin: 31.3,
    description: "Услуги погрузочной техники на складском комплексе",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-01-08T00:00:00Z",
  },
  {
    id: "proj_3",
    name: "ЖК «Центральный»",
    type: "construction",
    status: "active",
    contractorId: "contr_1",
    contractorName: "ООО «СтройМир»",
    address: "г. Москва, ул. Центральная, д. 50",
    startDate: "2024-11-01",
    plannedEndDate: "2025-08-31",
    contractAmount: 8500000,
    receivedAmount: 2550000,
    remainingAmount: 5950000,
    equipment: [
      { equipmentId: "eq_4", equipmentName: "Экскаватор-погрузчик JCB 3CX", assignedDate: "2024-11-01", hoursPlanned: 300, hoursWorked: 145, hourlyRate: 2200, income: 319000 },
    ],
    employees: [
      { employeeId: "emp_5", employeeName: "Морозов Дмитрий", role: "Оператор JCB", assignedDate: "2024-11-01", salaryPaid: 225000 },
    ],
    documents: [
      { id: "doc_9", type: "contract", name: "Договор подряда №78/2024", date: "2024-10-25", amount: 8500000, status: "signed" },
      { id: "doc_10", type: "act", name: "Акт КС-2 №1", date: "2024-12-31", amount: 2550000, status: "paid" },
    ],
    risks: [
      { id: "risk_2", type: "equipment_idle", description: "JCB на ТО, возможен простой", severity: "high", detectedAt: "2025-01-08" },
    ],
    totalIncome: 2550000,
    totalExpenses: 1680000,
    profit: 870000,
    profitMargin: 34.1,
    estimatedExpenses: {
      salary: 1500000,
      equipment: 1200000,
      materials: 4500000,
      other: 800000,
    },
    createdAt: "2024-10-25T00:00:00Z",
    updatedAt: "2025-01-08T00:00:00Z",
  },
  {
    id: "proj_4",
    name: "Торговый центр «Меридиан»",
    type: "construction",
    status: "completed",
    contractorId: "contr_5",
    contractorName: "ООО «ГлавСтрой»",
    address: "г. Москва, ул. Торговая, д. 25",
    startDate: "2024-03-01",
    plannedEndDate: "2024-10-31",
    actualEndDate: "2024-11-15",
    contractAmount: 4500000,
    receivedAmount: 4050000,
    remainingAmount: 450000,
    equipment: [
      { equipmentId: "eq_3", equipmentName: "Самосвал КАМАЗ 6520", assignedDate: "2024-03-01", unassignedDate: "2024-11-15", hoursWorked: 420, hourlyRate: 2000, income: 840000 },
    ],
    employees: [
      { employeeId: "emp_4", employeeName: "Козлов Андрей", role: "Водитель", assignedDate: "2024-03-01", unassignedDate: "2024-11-15", salaryPaid: 560000 },
    ],
    documents: [
      { id: "doc_11", type: "contract", name: "Договор подряда №15/2024", date: "2024-02-20", amount: 4500000, status: "signed" },
      { id: "doc_12", type: "act", name: "Итоговый акт КС-2", date: "2024-11-15", amount: 4500000, status: "signed" },
      { id: "doc_13", type: "invoice", name: "Счёт на остаток 450к", date: "2024-11-20", amount: 450000, status: "overdue" },
    ],
    risks: [
      { id: "risk_3", type: "payment_delay", description: "Заказчик задерживает оплату финального счёта на 25 дней", severity: "high", detectedAt: "2024-12-15" },
    ],
    totalIncome: 4050000,
    totalExpenses: 3200000,
    profit: 850000,
    profitMargin: 21.0,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "proj_5",
    name: "Разовые перевозки",
    type: "equipment_services",
    status: "active",
    contractorId: "contr_3",
    contractorName: "ИП Михайлов А.С.",
    address: "Разные адреса",
    startDate: "2025-01-01",
    isHourlyBased: true,
    equipment: [
      { equipmentId: "eq_3", equipmentName: "Самосвал КАМАЗ 6520", assignedDate: "2025-01-01", hoursWorked: 20, hourlyRate: 2000, income: 40000 },
    ],
    employees: [
      { employeeId: "emp_4", employeeName: "Козлов Андрей", role: "Водитель", assignedDate: "2025-01-01", salaryPaid: 70000 },
    ],
    documents: [],
    risks: [],
    totalIncome: 40000,
    totalExpenses: 82000,
    profit: -42000,
    profitMargin: -105,
    description: "Разовые заказы на перевозку грунта и материалов",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

// Расходы по объектам
const projectExpensesData: ProjectExpense[] = [
  // ЖК Солнечный - январь 2025
  { id: "pexp_1", projectId: "proj_1", category: "salary", description: "Зарплата прораба", amount: 90000, date: "2025-01-25", month: "2025-01", employeeId: "emp_10" },
  { id: "pexp_2", projectId: "proj_1", category: "salary", description: "Зарплата машиниста", amount: 95000, date: "2025-01-25", month: "2025-01", employeeId: "emp_1" },
  { id: "pexp_3", projectId: "proj_1", category: "salary", description: "Зарплата крановщика", amount: 110000, date: "2025-01-25", month: "2025-01", employeeId: "emp_6" },
  { id: "pexp_4", projectId: "proj_1", category: "equipment", description: "Лизинг CAT 320", amount: 300000, date: "2025-01-05", month: "2025-01", equipmentId: "eq_1" },
  { id: "pexp_5", projectId: "proj_1", category: "equipment", description: "Аренда крана", amount: 450000, date: "2025-01-01", month: "2025-01", equipmentId: "eq_5" },
  { id: "pexp_6", projectId: "proj_1", category: "fuel", description: "ГСМ техника", amount: 180000, date: "2025-01-15", month: "2025-01" },
  { id: "pexp_7", projectId: "proj_1", category: "materials", description: "Бетон, арматура", amount: 520000, date: "2025-01-20", month: "2025-01" },
  
  // Склад Логистик - январь 2025
  { id: "pexp_8", projectId: "proj_2", category: "salary", description: "Зарплата оператора", amount: 80000, date: "2025-01-25", month: "2025-01", employeeId: "emp_3" },
  { id: "pexp_9", projectId: "proj_2", category: "fuel", description: "ГСМ погрузчик", amount: 62000, date: "2025-01-18", month: "2025-01" },
  { id: "pexp_10", projectId: "proj_2", category: "equipment", description: "ТО погрузчика", amount: 45000, date: "2025-01-20", month: "2025-01", equipmentId: "eq_2" },
  
  // ЖК Центральный - январь 2025
  { id: "pexp_11", projectId: "proj_3", category: "salary", description: "Зарплата оператора JCB", amount: 75000, date: "2025-01-25", month: "2025-01", employeeId: "emp_5" },
  { id: "pexp_12", projectId: "proj_3", category: "equipment", description: "Лизинг JCB", amount: 150000, date: "2025-01-03", month: "2025-01", equipmentId: "eq_4" },
  { id: "pexp_13", projectId: "proj_3", category: "equipment", description: "Ремонт гидравлики JCB", amount: 120000, date: "2025-01-22", month: "2025-01", equipmentId: "eq_4" },
  
  // Разовые перевозки - январь 2025
  { id: "pexp_14", projectId: "proj_5", category: "salary", description: "Зарплата водителя", amount: 70000, date: "2025-01-25", month: "2025-01", employeeId: "emp_4" },
  { id: "pexp_15", projectId: "proj_5", category: "fuel", description: "ГСМ КАМАЗ", amount: 12000, date: "2025-01-15", month: "2025-01" },
];

// Доходы по объектам
const projectIncomesData: ProjectIncome[] = [
  // ЖК Солнечный
  { id: "pinc_1", projectId: "proj_1", type: "contract_payment", description: "Аванс по договору", amount: 3000000, date: "2024-09-15", month: "2024-09", documentId: "doc_1" },
  { id: "pinc_2", projectId: "proj_1", type: "contract_payment", description: "Оплата по акту КС-2 №1", amount: 3200000, date: "2024-12-10", month: "2024-12", documentId: "doc_4" },
  { id: "pinc_3", projectId: "proj_1", type: "contract_payment", description: "Оплата по акту КС-2 №2", amount: 3100000, date: "2025-01-05", month: "2025-01", documentId: "doc_5" },
  
  // Склад Логистик
  { id: "pinc_4", projectId: "proj_2", type: "hourly_payment", description: "Услуги погрузчика декабрь", amount: 275000, date: "2025-01-05", month: "2025-01" },
  
  // ЖК Центральный
  { id: "pinc_5", projectId: "proj_3", type: "contract_payment", description: "Аванс по договору", amount: 1275000, date: "2024-11-05", month: "2024-11" },
  { id: "pinc_6", projectId: "proj_3", type: "contract_payment", description: "Оплата по акту КС-2 №1", amount: 2550000, date: "2025-01-08", month: "2025-01", documentId: "doc_10" },
  
  // Разовые перевозки
  { id: "pinc_7", projectId: "proj_5", type: "hourly_payment", description: "Перевозка грунта", amount: 40000, date: "2025-01-15", month: "2025-01" },
];

// ============================================
// API ФУНКЦИИ
// ============================================

let contractorsCache = [...contractorsData];
let projectsCache = [...projectsData];
let projectExpensesCache = [...projectExpensesData];
let projectIncomesCache = [...projectIncomesData];

// === КОНТРАГЕНТЫ ===

export function getAllContractors(): Contractor[] {
  return [...contractorsCache];
}

export function getContractorById(id: string): Contractor | undefined {
  return contractorsCache.find(c => c.id === id);
}

export function getContractorsByType(type: ContractorType): Contractor[] {
  return contractorsCache.filter(c => c.type === type);
}

export function getContractorSummary(contractorId: string): ContractorSummary {
  const projects = projectsCache.filter(p => p.contractorId === contractorId);
  const contractor = contractorsCache.find(c => c.id === contractorId);
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalIncome = projects.reduce((sum, p) => sum + p.totalIncome, 0);
  const totalReceivables = projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);
  const overdueReceivables = contractor?.overdueReceivables || 0;
  const overdueDays = contractor?.averagePaymentDelay || 0;
  const avgProjectProfit = totalProjects > 0 ? projects.reduce((sum, p) => sum + p.profit, 0) / totalProjects : 0;
  
  return {
    contractorId,
    totalProjects,
    activeProjects,
    completedProjects,
    totalIncome,
    totalReceivables,
    overdueReceivables,
    overdueDays,
    avgProjectProfit,
  };
}

// === ОБЪЕКТЫ ===

export function getAllProjects(): Project[] {
  return [...projectsCache];
}

export function getProjectById(id: string): Project | undefined {
  return projectsCache.find(p => p.id === id);
}

export function getProjectsByType(type: ProjectType): Project[] {
  return projectsCache.filter(p => p.type === type);
}

export function getProjectsByContractor(contractorId: string): Project[] {
  return projectsCache.filter(p => p.contractorId === contractorId);
}

export function getActiveProjects(): Project[] {
  return projectsCache.filter(p => p.status === 'active');
}

export function getProjectExpenses(projectId: string, month?: string): ProjectExpense[] {
  return projectExpensesCache.filter(e => 
    e.projectId === projectId && 
    (!month || e.month === month)
  );
}

export function getProjectIncomes(projectId: string, month?: string): ProjectIncome[] {
  return projectIncomesCache.filter(i => 
    i.projectId === projectId && 
    (!month || i.month === month)
  );
}

export function getProjectMonthlySummary(projectId: string, month: string): ProjectMonthlySummary {
  const expenses = getProjectExpenses(projectId, month);
  const incomes = getProjectIncomes(projectId, month);
  const project = getProjectById(projectId);
  
  const expensesByCategory = {
    salary: expenses.filter(e => e.category === 'salary').reduce((sum, e) => sum + e.amount, 0),
    equipment: expenses.filter(e => e.category === 'equipment').reduce((sum, e) => sum + e.amount, 0),
    materials: expenses.filter(e => e.category === 'materials').reduce((sum, e) => sum + e.amount, 0),
    fuel: expenses.filter(e => e.category === 'fuel').reduce((sum, e) => sum + e.amount, 0),
    subcontract: expenses.filter(e => e.category === 'subcontract').reduce((sum, e) => sum + e.amount, 0),
    other: expenses.filter(e => e.category === 'other').reduce((sum, e) => sum + e.amount, 0),
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
  };
  
  const income = incomes.reduce((sum, i) => sum + i.amount, 0);
  const equipmentHours = project?.equipment.reduce((sum, e) => sum + e.hoursWorked, 0) || 0;
  
  return {
    projectId,
    month,
    income,
    expenses: expensesByCategory,
    profit: income - expensesByCategory.total,
    equipmentHours,
    equipmentUtilization: 0, // рассчитывается отдельно
  };
}

// === СВОДКИ ===

export function getProjectsTotals() {
  const projects = getAllProjects();
  const active = projects.filter(p => p.status === 'active');
  const construction = projects.filter(p => p.type === 'construction');
  const services = projects.filter(p => p.type === 'equipment_services');
  
  const totalIncome = projects.reduce((sum, p) => sum + p.totalIncome, 0);
  const totalExpenses = projects.reduce((sum, p) => sum + p.totalExpenses, 0);
  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);
  const totalReceivables = projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);
  
  return {
    total: projects.length,
    active: active.length,
    construction: construction.length,
    services: services.length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalIncome,
    totalExpenses,
    totalProfit,
    totalReceivables,
    avgProfitMargin: projects.length > 0 ? projects.reduce((sum, p) => sum + p.profitMargin, 0) / projects.length : 0,
  };
}

export function getContractorsTotals() {
  const contractors = getAllContractors();
  const customers = contractors.filter(c => c.type === 'customer');
  const suppliers = contractors.filter(c => c.type === 'supplier');
  const subcontractors = contractors.filter(c => c.type === 'subcontractor');
  
  const totalReceivables = customers.reduce((sum, c) => sum + c.totalReceivables, 0);
  const overdueReceivables = customers.reduce((sum, c) => sum + c.overdueReceivables, 0);
  const totalIncome = customers.reduce((sum, c) => sum + c.totalIncome, 0);
  
  return {
    total: contractors.length,
    customers: customers.length,
    suppliers: suppliers.length,
    subcontractors: subcontractors.length,
    totalReceivables,
    overdueReceivables,
    totalIncome,
    problematic: contractors.filter(c => c.reputation === 'problematic' || c.reputation === 'blacklisted').length,
  };
}

export function getProfitableProjects(limit: number = 5): Project[] {
  return [...projectsCache]
    .filter(p => p.status === 'active' || p.status === 'completed')
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit);
}

export function getUnprofitableProjects(limit: number = 5): Project[] {
  return [...projectsCache]
    .filter(p => p.status === 'active' || p.status === 'completed')
    .sort((a, b) => a.profit - b.profit)
    .slice(0, limit);
}

export function getProjectsWithRisks(): Project[] {
  return projectsCache.filter(p => 
    p.status === 'active' && 
    p.risks.some(r => !r.resolvedAt && (r.severity === 'high' || r.severity === 'critical'))
  );
}

export function getOverdueContractors(): Contractor[] {
  return contractorsCache.filter(c => c.overdueReceivables > 0);
}
