/**
 * Mock-данные для раздела Активы
 * Техника и Недвижимость с расходами и доходами
 */

import {
  Equipment,
  EquipmentExpense,
  EquipmentIncome,
  EquipmentMonthlySummary,
  Property,
  PropertyExpense,
  PropertyIncome,
  PropertyMonthlySummary,
} from "@/types/assets";

// ============================================
// ТЕХНИКА
// ============================================

const equipmentData: Equipment[] = [
  {
    id: "eq_1",
    name: "Экскаватор CAT 320",
    category: "excavator",
    brand: "Caterpillar",
    model: "320D",
    year: 2021,
    serialNumber: "CAT320D2021001",
    plateNumber: "А123ВС77",
    ownership: "leasing",
    status: "working",
    currentProjectId: "proj_1",
    currentProjectName: "ЖК Солнечный",
    hourlyRate: 3500,
    purchasePrice: 12000000,
    currentValue: 9500000,
    assignedEmployees: [
      { employeeId: "emp_1", employeeName: "Иванов Алексей", role: "operator", phone: "+7 (999) 111-22-33" },
      { employeeId: "emp_2", employeeName: "Петров Сергей", role: "backup", phone: "+7 (999) 222-33-44" },
    ],
    leasingContract: {
      id: "lease_1",
      contractNumber: "ЛД-2023/045",
      leasingCompany: "Сбербанк Лизинг",
      startDate: "2023-06-01",
      endDate: "2026-06-01",
      totalAmount: 10800000,
      monthlyPayment: 300000,
      buyoutAmount: 1200000,
      payments: [
        { month: "2025-01", amount: 300000, status: "paid", paidAt: "2025-01-05" },
        { month: "2025-02", amount: 300000, status: "pending" },
        { month: "2025-03", amount: 300000, status: "pending" },
        { month: "2025-04", amount: 300000, status: "pending" },
        { month: "2025-05", amount: 300000, status: "pending" },
        { month: "2025-06", amount: 300000, status: "pending" },
      ],
    },
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "eq_2",
    name: "Погрузчик Volvo L120",
    category: "loader",
    brand: "Volvo",
    model: "L120H",
    year: 2019,
    plateNumber: "В456СТ77",
    ownership: "own",
    status: "working",
    currentProjectId: "proj_2",
    currentProjectName: "Склад Логистик",
    hourlyRate: 2500,
    purchasePrice: 8500000,
    currentValue: 6200000,
    assignedEmployees: [
      { employeeId: "emp_3", employeeName: "Сидоров Михаил", role: "operator", phone: "+7 (999) 333-44-55" },
    ],
    createdAt: "2019-03-15T00:00:00Z",
  },
  {
    id: "eq_3",
    name: "Самосвал КАМАЗ 6520",
    category: "truck",
    brand: "КАМАЗ",
    model: "6520",
    year: 2022,
    plateNumber: "Е789МН77",
    ownership: "own",
    status: "idle",
    hourlyRate: 2000,
    purchasePrice: 5500000,
    currentValue: 4800000,
    assignedEmployees: [
      { employeeId: "emp_4", employeeName: "Козлов Андрей", role: "driver", phone: "+7 (999) 444-55-66" },
    ],
    createdAt: "2022-01-20T00:00:00Z",
  },
  {
    id: "eq_4",
    name: "Экскаватор-погрузчик JCB 3CX",
    category: "excavator",
    brand: "JCB",
    model: "3CX",
    year: 2020,
    plateNumber: "К012УФ77",
    ownership: "leasing",
    status: "maintenance",
    hourlyRate: 2200,
    purchasePrice: 6000000,
    currentValue: 4500000,
    assignedEmployees: [
      { employeeId: "emp_5", employeeName: "Морозов Дмитрий", role: "operator", phone: "+7 (999) 555-66-77" },
    ],
    leasingContract: {
      id: "lease_2",
      contractNumber: "ЛД-2024/012",
      leasingCompany: "ВТБ Лизинг",
      startDate: "2024-01-01",
      endDate: "2027-01-01",
      totalAmount: 5400000,
      monthlyPayment: 150000,
      buyoutAmount: 600000,
      payments: [
        { month: "2025-01", amount: 150000, status: "paid", paidAt: "2025-01-03" },
        { month: "2025-02", amount: 150000, status: "pending" },
        { month: "2025-03", amount: 150000, status: "pending" },
      ],
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "eq_5",
    name: "Автокран Liebherr LTM 1050",
    category: "crane",
    brand: "Liebherr",
    model: "LTM 1050-3.1",
    year: 2023,
    plateNumber: "М345ОП77",
    ownership: "rent",
    status: "working",
    currentProjectId: "proj_1",
    currentProjectName: "ЖК Солнечный",
    hourlyRate: 5000,
    assignedEmployees: [
      { employeeId: "emp_6", employeeName: "Николаев Виктор", role: "operator", phone: "+7 (999) 666-77-88" },
    ],
    rentContract: {
      id: "rent_1",
      contractNumber: "АР-2025/003",
      lessor: "КранСервис ООО",
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      monthlyRate: 450000,
      includesOperator: false,
      includesFuel: false,
    },
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "eq_6",
    name: "Бульдозер Komatsu D65",
    category: "bulldozer",
    brand: "Komatsu",
    model: "D65EX-18",
    year: 2018,
    plateNumber: "Р678СТ77",
    ownership: "own",
    status: "repair",
    hourlyRate: 3000,
    purchasePrice: 9000000,
    currentValue: 5500000,
    assignedEmployees: [
      { employeeId: "emp_7", employeeName: "Егоров Павел", role: "operator", phone: "+7 (999) 777-88-99" },
    ],
    createdAt: "2018-05-10T00:00:00Z",
  },
];

// Расходы по технике за январь 2025
const equipmentExpensesData: EquipmentExpense[] = [
  // CAT 320
  { id: "exp_1", equipmentId: "eq_1", type: "leasing", description: "Лизинговый платёж", amount: 300000, date: "2025-01-05", month: "2025-01" },
  { id: "exp_2", equipmentId: "eq_1", type: "fuel", description: "Дизельное топливо", amount: 85000, date: "2025-01-15", month: "2025-01" },
  { id: "exp_3", equipmentId: "eq_1", type: "salary", description: "Зарплата машиниста", amount: 95000, date: "2025-01-25", month: "2025-01" },
  { id: "exp_4", equipmentId: "eq_1", type: "parts", description: "Фильтры, масло", amount: 28000, date: "2025-01-10", month: "2025-01" },
  { id: "exp_5", equipmentId: "eq_1", type: "insurance", description: "КАСКО", amount: 15000, date: "2025-01-01", month: "2025-01" },
  
  // Volvo L120
  { id: "exp_6", equipmentId: "eq_2", type: "fuel", description: "Дизельное топливо", amount: 62000, date: "2025-01-18", month: "2025-01" },
  { id: "exp_7", equipmentId: "eq_2", type: "salary", description: "Зарплата оператора", amount: 80000, date: "2025-01-25", month: "2025-01" },
  { id: "exp_8", equipmentId: "eq_2", type: "maintenance", description: "Плановое ТО", amount: 45000, date: "2025-01-20", month: "2025-01" },
  
  // КАМАЗ
  { id: "exp_9", equipmentId: "eq_3", type: "salary", description: "Зарплата водителя", amount: 70000, date: "2025-01-25", month: "2025-01" },
  { id: "exp_10", equipmentId: "eq_3", type: "insurance", description: "ОСАГО + КАСКО", amount: 12000, date: "2025-01-01", month: "2025-01" },
  
  // JCB 3CX
  { id: "exp_11", equipmentId: "eq_4", type: "leasing", description: "Лизинговый платёж", amount: 150000, date: "2025-01-03", month: "2025-01" },
  { id: "exp_12", equipmentId: "eq_4", type: "salary", description: "Зарплата оператора", amount: 75000, date: "2025-01-25", month: "2025-01" },
  { id: "exp_13", equipmentId: "eq_4", type: "repair", description: "Ремонт гидравлики", amount: 120000, date: "2025-01-22", month: "2025-01" },
  
  // Liebherr (аренда)
  { id: "exp_14", equipmentId: "eq_5", type: "rent", description: "Аренда крана", amount: 450000, date: "2025-01-01", month: "2025-01" },
  { id: "exp_15", equipmentId: "eq_5", type: "fuel", description: "Дизельное топливо", amount: 95000, date: "2025-01-20", month: "2025-01" },
  { id: "exp_16", equipmentId: "eq_5", type: "salary", description: "Зарплата крановщика", amount: 110000, date: "2025-01-25", month: "2025-01" },
  
  // Komatsu
  { id: "exp_17", equipmentId: "eq_6", type: "repair", description: "Капитальный ремонт двигателя", amount: 380000, date: "2025-01-08", month: "2025-01" },
  { id: "exp_18", equipmentId: "eq_6", type: "salary", description: "Зарплата оператора", amount: 85000, date: "2025-01-25", month: "2025-01" },
];

// Доходы по технике за январь 2025
const equipmentIncomesData: EquipmentIncome[] = [
  // CAT 320 - 90 часов
  { id: "inc_1", equipmentId: "eq_1", projectName: "ЖК Солнечный", description: "Земляные работы", hours: 90, hourlyRate: 3500, amount: 315000, date: "2025-01-31", month: "2025-01" },
  
  // Volvo L120 - 110 часов
  { id: "inc_2", equipmentId: "eq_2", projectName: "Склад Логистик", description: "Погрузочные работы", hours: 110, hourlyRate: 2500, amount: 275000, date: "2025-01-31", month: "2025-01" },
  
  // КАМАЗ - простой, только 20 часов
  { id: "inc_3", equipmentId: "eq_3", projectName: "Разовый заказ", description: "Перевозка грунта", hours: 20, hourlyRate: 2000, amount: 40000, date: "2025-01-15", month: "2025-01" },
  
  // JCB - на ТО, только 45 часов
  { id: "inc_4", equipmentId: "eq_4", projectName: "ЖК Центральный", description: "Работы до поломки", hours: 45, hourlyRate: 2200, amount: 99000, date: "2025-01-20", month: "2025-01" },
  
  // Liebherr - 65 часов
  { id: "inc_5", equipmentId: "eq_5", projectName: "ЖК Солнечный", description: "Монтажные работы", hours: 65, hourlyRate: 5000, amount: 325000, date: "2025-01-31", month: "2025-01" },
  
  // Komatsu - в ремонте, 0
];

// ============================================
// НЕДВИЖИМОСТЬ
// ============================================

const propertyData: Property[] = [
  {
    id: "prop_1",
    name: "Главный офис",
    type: "office",
    ownership: "rent",
    address: "г. Москва, ул. Строителей, д. 15, офис 301",
    area: 120,
    purpose: "Административный офис",
    rentContract: {
      id: "prent_1",
      contractNumber: "АР-2022/001",
      lessor: "ООО «Бизнес Центр»",
      startDate: "2022-01-01",
      endDate: "2026-12-31",
      monthlyRate: 180000,
      depositAmount: 360000,
    },
    createdAt: "2022-01-01T00:00:00Z",
  },
  {
    id: "prop_2",
    name: "Производственная база",
    type: "base",
    ownership: "own",
    address: "МО, г. Подольск, ул. Промышленная, д. 5",
    area: 2500,
    purpose: "Стоянка и обслуживание техники",
    purchasePrice: 25000000,
    currentValue: 32000000,
    createdAt: "2018-06-15T00:00:00Z",
  },
  {
    id: "prop_3",
    name: "Склад материалов",
    type: "warehouse",
    ownership: "rent",
    address: "МО, г. Видное, ул. Складская, д. 8",
    area: 800,
    purpose: "Хранение материалов и оборудования",
    rentContract: {
      id: "prent_2",
      contractNumber: "АР-2023/015",
      lessor: "ИП Михайлов А.С.",
      startDate: "2023-07-01",
      endDate: "2025-06-30",
      monthlyRate: 120000,
    },
    createdAt: "2023-07-01T00:00:00Z",
  },
  {
    id: "prop_4",
    name: "Стоянка техники",
    type: "parking",
    ownership: "own",
    address: "МО, г. Подольск, ул. Промышленная, д. 5а",
    area: 1500,
    purpose: "Открытая стоянка для техники",
    purchasePrice: 8000000,
    currentValue: 10000000,
    createdAt: "2019-03-01T00:00:00Z",
  },
];

// Расходы по недвижимости
const propertyExpensesData: PropertyExpense[] = [
  // Офис
  { id: "pexp_1", propertyId: "prop_1", type: "rent", description: "Аренда офиса", amount: 180000, date: "2025-01-05", month: "2025-01", isRecurring: true },
  { id: "pexp_2", propertyId: "prop_1", type: "utilities", description: "Коммунальные услуги", amount: 15000, date: "2025-01-20", month: "2025-01", isRecurring: true },
  { id: "pexp_3", propertyId: "prop_1", type: "other", description: "Интернет, телефон", amount: 5000, date: "2025-01-15", month: "2025-01", isRecurring: true },
  
  // База
  { id: "pexp_4", propertyId: "prop_2", type: "utilities", description: "Электричество", amount: 45000, date: "2025-01-25", month: "2025-01", isRecurring: true },
  { id: "pexp_5", propertyId: "prop_2", type: "security", description: "Охрана", amount: 35000, date: "2025-01-01", month: "2025-01", isRecurring: true },
  { id: "pexp_6", propertyId: "prop_2", type: "maintenance", description: "Обслуживание территории", amount: 20000, date: "2025-01-10", month: "2025-01" },
  { id: "pexp_7", propertyId: "prop_2", type: "taxes", description: "Налог на имущество", amount: 25000, date: "2025-01-15", month: "2025-01" },
  
  // Склад
  { id: "pexp_8", propertyId: "prop_3", type: "rent", description: "Аренда склада", amount: 120000, date: "2025-01-05", month: "2025-01", isRecurring: true },
  { id: "pexp_9", propertyId: "prop_3", type: "utilities", description: "Коммунальные услуги", amount: 18000, date: "2025-01-20", month: "2025-01", isRecurring: true },
  
  // Стоянка
  { id: "pexp_10", propertyId: "prop_4", type: "utilities", description: "Электричество", amount: 8000, date: "2025-01-20", month: "2025-01", isRecurring: true },
  { id: "pexp_11", propertyId: "prop_4", type: "taxes", description: "Земельный налог", amount: 12000, date: "2025-01-15", month: "2025-01" },
];

// Доходы от недвижимости
const propertyIncomesData: PropertyIncome[] = [
  // База - субаренда части территории
  { id: "pinc_1", propertyId: "prop_2", type: "subrent", description: "Субаренда ангара", amount: 80000, date: "2025-01-05", month: "2025-01" },
  { id: "pinc_2", propertyId: "prop_2", type: "storage", description: "Хранение техники (сторонняя)", amount: 25000, date: "2025-01-10", month: "2025-01" },
];

// ============================================
// API ФУНКЦИИ
// ============================================

let equipmentCache = [...equipmentData];
let expensesCache = [...equipmentExpensesData];
let incomesCache = [...equipmentIncomesData];
let propertiesCache = [...propertyData];
let propertyExpensesCache = [...propertyExpensesData];
let propertyIncomesCache = [...propertyIncomesData];

// Техника
export function getAllEquipment(): Equipment[] {
  return [...equipmentCache];
}

export function getEquipmentById(id: string): Equipment | undefined {
  return equipmentCache.find(e => e.id === id);
}

export function getEquipmentByOwnership(ownership: Equipment['ownership']): Equipment[] {
  return equipmentCache.filter(e => e.ownership === ownership);
}

export function getEquipmentExpenses(equipmentId: string, month?: string): EquipmentExpense[] {
  return expensesCache.filter(e => 
    e.equipmentId === equipmentId && 
    (!month || e.month === month)
  );
}

export function getEquipmentIncomes(equipmentId: string, month?: string): EquipmentIncome[] {
  return incomesCache.filter(i => 
    i.equipmentId === equipmentId && 
    (!month || i.month === month)
  );
}

export function getEquipmentMonthlySummary(equipmentId: string, month: string): EquipmentMonthlySummary {
  const expenses = getEquipmentExpenses(equipmentId, month);
  const incomes = getEquipmentIncomes(equipmentId, month);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const hoursWorked = incomes.reduce((sum, i) => sum + (i.hours || 0), 0);
  
  // Предполагаем 22 рабочих дня * 8 часов = 176 часов макс
  const maxHours = 176;
  const utilization = Math.round((hoursWorked / maxHours) * 100);
  const daysIdle = Math.max(0, 22 - Math.ceil(hoursWorked / 8));
  
  return {
    equipmentId,
    month,
    totalIncome,
    totalExpenses,
    profit: totalIncome - totalExpenses,
    hoursWorked,
    workingHours: hoursWorked,
    daysIdle,
    utilization,
  };
}

export function getAllEquipmentSummary(month: string): EquipmentMonthlySummary[] {
  return equipmentCache.map(eq => getEquipmentMonthlySummary(eq.id, month));
}

// Недвижимость
export function getAllProperties(): Property[] {
  return [...propertiesCache];
}

export function getPropertyById(id: string): Property | undefined {
  return propertiesCache.find(p => p.id === id);
}

export function getPropertyExpenses(propertyId: string, month?: string): PropertyExpense[] {
  return propertyExpensesCache.filter(e => 
    e.propertyId === propertyId && 
    (!month || e.month === month)
  );
}

export function getPropertyIncomes(propertyId: string, month?: string): PropertyIncome[] {
  return propertyIncomesCache.filter(i => 
    i.propertyId === propertyId && 
    (!month || i.month === month)
  );
}

export function getPropertyMonthlySummary(propertyId: string, month: string): PropertyMonthlySummary {
  const expenses = getPropertyExpenses(propertyId, month);
  const incomes = getPropertyIncomes(propertyId, month);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  
  return {
    propertyId,
    month,
    totalIncome,
    totalExpenses,
    profit: totalIncome - totalExpenses,
  };
}

// Общая статистика
export function getAssetsTotals(month: string) {
  const equipment = getAllEquipment();
  const properties = getAllProperties();
  
  const equipmentSummaries = equipment.map(eq => getEquipmentMonthlySummary(eq.id, month));
  const propertySummaries = properties.map(p => getPropertyMonthlySummary(p.id, month));
  
  const equipmentTotalIncome = equipmentSummaries.reduce((sum, s) => sum + s.totalIncome, 0);
  const equipmentTotalExpenses = equipmentSummaries.reduce((sum, s) => sum + s.totalExpenses, 0);
  const propertyTotalIncome = propertySummaries.reduce((sum, s) => sum + s.totalIncome, 0);
  const propertyTotalExpenses = propertySummaries.reduce((sum, s) => sum + s.totalExpenses, 0);
  
  const workingCount = equipment.filter(e => e.status === 'working').length;
  const idleCount = equipment.filter(e => e.status === 'idle').length;
  
  return {
    equipment: {
      total: equipment.length,
      working: workingCount,
      idle: idleCount,
      maintenance: equipment.filter(e => e.status === 'maintenance').length,
      repair: equipment.filter(e => e.status === 'repair').length,
      income: equipmentTotalIncome,
      expenses: equipmentTotalExpenses,
      profit: equipmentTotalIncome - equipmentTotalExpenses,
      avgUtilization: Math.round(equipmentSummaries.reduce((sum, s) => sum + s.utilization, 0) / equipment.length),
    },
    property: {
      total: properties.length,
      own: properties.filter(p => p.ownership === 'own').length,
      rent: properties.filter(p => p.ownership === 'rent').length,
      income: propertyTotalIncome,
      expenses: propertyTotalExpenses,
      profit: propertyTotalIncome - propertyTotalExpenses,
    },
    total: {
      income: equipmentTotalIncome + propertyTotalIncome,
      expenses: equipmentTotalExpenses + propertyTotalExpenses,
      profit: (equipmentTotalIncome + propertyTotalIncome) - (equipmentTotalExpenses + propertyTotalExpenses),
    }
  };
}

// Топ активов
export function getTopProfitableEquipment(month: string, limit: number = 5): (Equipment & { summary: EquipmentMonthlySummary })[] {
  const equipment = getAllEquipment();
  const withSummary = equipment.map(eq => ({
    ...eq,
    summary: getEquipmentMonthlySummary(eq.id, month),
  }));
  
  return withSummary
    .sort((a, b) => b.summary.profit - a.summary.profit)
    .slice(0, limit);
}

export function getTopUnprofitableEquipment(month: string, limit: number = 5): (Equipment & { summary: EquipmentMonthlySummary })[] {
  const equipment = getAllEquipment();
  const withSummary = equipment.map(eq => ({
    ...eq,
    summary: getEquipmentMonthlySummary(eq.id, month),
  }));
  
  return withSummary
    .sort((a, b) => a.summary.profit - b.summary.profit)
    .slice(0, limit);
}
