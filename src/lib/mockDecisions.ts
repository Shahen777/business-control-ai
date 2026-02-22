import { Decision, DecisionStatus } from "@/types/decisions";

// Кэш для хранения решений в памяти
let decisionsCache: Decision[] | null = null;
const STORAGE_KEY = 'bc_decisions';

// Начальные моковые данные
const initialDecisions: Decision[] = [
  {
    id: 1,
    title: "Оптимизация расходов на экскаватор CAT-320",
    agent: "Finance AI",
    priority: "high",
    status: "pending",
    createdAt: new Date().toISOString(),
    department: "Техника",
    impactRub: 120000,
    reason: "Обнаружен перерасход топлива на 15% выше нормы за последний месяц",
    effect: "Снижение ежемесячных расходов на ГСМ на 45 000 ₽",
    risks: ["Временный простой техники на диагностику (1 день)"],
    nextStep: {
        text: "Провести ТО топливной системы",
        amount: "15 000 ₽",
        effort: "medium",
        deadline: "3 дня"
    },
    alternatives: [
      {
          text: "Сменить поставщика топлива",
          amount: "0 ₽",
          effort: "high"
      },
      {
          text: "Установить датчик уровня топлива",
          amount: "25 000 ₽",
          effort: "medium"
      }
    ]
  },
  {
    id: 2,
    title: "Закупка материалов для объекта 'Северный'",
    agent: "Operations AI",
    priority: "critical",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // вчера
    department: "Снабжение",
    impactRub: 450000,
    reason: "Цены на арматуру выросли на 5%, прогнозируется дальнейший рост",
    effect: "Фиксация стоимости материалов, экономия до 50 000 ₽",
    risks: ["Нехватка оборотных средств", "Затоваривание склада"],
    nextStep: {
        text: "Согласовать срочную закупку партии 10т",
        amount: "450 000 ₽",
        effort: "low",
        deadline: "24 часа"
    },
    alternatives: [
        {
            text: "Ждать плановой закупки",
            amount: "500 000 ₽",
            effort: "low"
        }
    ]
  },
  {
    id: 3,
    title: "Наем дополнительной бригады монолитчиков",
    agent: "Business AI",
    priority: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    department: "Кадры",
    impactRub: 0,
    reason: "Отставание от графика на объекте 'ЖК Центральный' на 3 дня",
    effect: "Вход в график работ до конца недели",
    risks: ["Увеличение ФОТ", "Риск качества работ новой бригады"],
    nextStep: {
        text: "Разместить вакансию и связаться с подрядчиками",
        amount: "150 000 ₽",
        effort: "medium",
        deadline: "1 неделя"
    },
    alternatives: [
        {
            text: "Ввести сверхурочные для текущей бригады",
            amount: "80 000 ₽",
            effort: "medium"
        }
    ]
  }
];

// Инициализация данных (загрузка из localStorage или использование моков)
const initializeDecisions = (): Decision[] => {
  if (typeof window === 'undefined') return initialDecisions;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Простая валидация, чтобы убедиться, что это массив
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored decisions", e);
    }
  }
  
  // Если в хранилище пусто, сохраняем начальные данные
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDecisions));
  return initialDecisions;
};

export const getAllDecisions = (): Decision[] => {
  if (!decisionsCache) {
    decisionsCache = initializeDecisions();
  }
  return decisionsCache;
};

export const updateDecisionStatus = (id: number, status: DecisionStatus): Decision | null => {
  const decisions = getAllDecisions();
  const index = decisions.findIndex(d => d.id === id);
  
  if (index !== -1) {
    const updatedDecision = { 
      ...decisions[index], 
      status,
      acceptedAt: status === 'accepted' ? new Date().toISOString() : undefined
    };
    
    decisions[index] = updatedDecision;
    decisionsCache = [...decisions];
    
    // Сохраняем изменения
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisionsCache));
    }
    
    return updatedDecision;
  }
  
  return null;
};

// Функция для добавления нового решения (например, сгенерированного AI)
export const addDecision = (decision: Omit<Decision, "id" | "createdAt" | "status">): Decision => {
  const decisions = getAllDecisions();
  const maxId = decisions.reduce((max, d) => (d.id > max ? d.id : max), 0);
  
  const newDecision: Decision = {
    ...decision,
    id: maxId + 1,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  decisionsCache = [newDecision, ...decisions];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisionsCache));
  }
  
  return newDecision;
};
