/**
 * API endpoint для GPT интеграции
 * Обрабатывает сообщения чата и выполняет команды
 */

import { NextRequest, NextResponse } from "next/server";

// Типы для API
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIRequestBody {
  message: string;
  context?: {
    employees?: unknown[];
    tasks?: unknown[];
    contracts?: unknown[];
    decisions?: unknown[];
  };
  history?: ChatMessage[];
}

interface AIAction {
  type: string;
  label: string;
  data?: Record<string, unknown>;
}

interface AIResponse {
  message: string;
  preview?: {
    type: "task" | "contract" | "document" | "employee" | "decision";
    data: Record<string, unknown>;
  };
  actions?: AIAction[];
  needs_confirm?: boolean;
  intent?: string;
  entities?: Record<string, unknown>;
}

// Системный промпт для GPT
const SYSTEM_PROMPT = `Ты - Business AI ассистент для управления строительной компанией.
Твоя задача - помогать пользователю управлять задачами, сотрудниками, договорами и документами.

Ты можешь:
1. Создавать задачи (укажи название, исполнителя, срок, приоритет)
2. Искать информацию о сотрудниках, задачах, договорах
3. Анализировать договоры и извлекать условия
4. Генерировать документы (акты, счета, письма, доверенности)
5. Давать рекомендации по управлению бизнесом

Когда пользователь просит создать что-то, сначала уточни детали и покажи превью, затем спроси подтверждение.

Отвечай на русском языке, кратко и по делу.
Используй эмодзи для наглядности.
Форматируй ответы с использованием markdown.`;

// Fallback ответы без GPT
const fallbackResponses: Record<string, string> = {
  greeting: "👋 Привет! Я Business AI - твой помощник по управлению бизнесом. Чем могу помочь?\n\nМогу:\n- 📋 Создавать задачи\n- 📄 Работать с договорами\n- 📝 Генерировать документы\n- 👥 Искать информацию о сотрудниках",
  help: "🤖 Вот что я умею:\n\n**Задачи:**\n- `создай задачу [название]` - создать новую задачу\n- `покажи задачи` - список задач\n\n**Договоры:**\n- `покажи договоры` - список договоров\n- `анализируй договор [номер]` - извлечь условия\n\n**Документы:**\n- `создай акт` - сгенерировать акт\n- `создай счёт` - сгенерировать счёт\n\n**Сотрудники:**\n- `покажи сотрудников` - список команды\n- `кто свободен?` - доступные сотрудники",
  unknown: "🤔 Не совсем понял запрос. Попробуй переформулировать или напиши `помощь` для списка команд.",
};

// Определение интента из сообщения (fallback без GPT)
function detectIntent(message: string): { intent: string; entities: Record<string, unknown> } {
  const lower = message.toLowerCase();
  
  // Приветствия
  if (/^(привет|здравствуй|добрый|хай|hello|hi)/.test(lower)) {
    return { intent: "GREETING", entities: {} };
  }
  
  // Помощь
  if (/помощь|help|что умеешь|как работ/.test(lower)) {
    return { intent: "HELP", entities: {} };
  }
  
  // Создание задачи
  if (/созда(й|ть) задач|новая задача|добавь задачу/.test(lower)) {
    const titleMatch = message.match(/задач[у|у]\s+[«"]?([^»"]+)[»"]?/i);
    return { 
      intent: "CREATE_TASK", 
      entities: { 
        title: titleMatch ? titleMatch[1].trim() : undefined 
      } 
    };
  }
  
  // Показать задачи
  if (/покаж(и|ите) задач|список задач|мои задачи|все задачи/.test(lower)) {
    return { intent: "LIST_TASKS", entities: {} };
  }
  
  // Создание договора
  if (/созда(й|ть) договор|новый договор|добавь договор/.test(lower)) {
    return { intent: "CREATE_CONTRACT", entities: {} };
  }
  
  // Показать договоры
  if (/покаж(и|ите) договор|список договор|все договор/.test(lower)) {
    return { intent: "LIST_CONTRACTS", entities: {} };
  }
  
  // Анализ договора
  if (/анализ|извлеч(ь|и)|разбери|проверь договор/.test(lower)) {
    return { intent: "ANALYZE_CONTRACT", entities: {} };
  }
  
  // Создание документа
  if (/созда(й|ть)\s+(акт|счёт|счет|письмо|доверенность|документ)/.test(lower)) {
    const docType = lower.includes("акт") ? "act" 
      : lower.includes("счёт") || lower.includes("счет") ? "invoice"
      : lower.includes("письмо") ? "letter"
      : lower.includes("доверенность") ? "power_of_attorney"
      : "document";
    return { intent: "CREATE_DOCUMENT", entities: { docType } };
  }
  
  // Показать сотрудников
  if (/покаж(и|ите) сотрудник|команда|кто работает|список сотрудник/.test(lower)) {
    return { intent: "LIST_EMPLOYEES", entities: {} };
  }
  
  // Свободные сотрудники
  if (/кто свобод|доступн|не занят/.test(lower)) {
    return { intent: "AVAILABLE_EMPLOYEES", entities: {} };
  }
  
  // Статистика
  if (/статистик|сводка|дашборд|итоги|показатели/.test(lower)) {
    return { intent: "STATS", entities: {} };
  }
  
  return { intent: "UNKNOWN", entities: {} };
}

// Генерация ответа без GPT
function generateFallbackResponse(
  intent: string, 
  entities: Record<string, unknown>,
  context?: AIRequestBody["context"]
): AIResponse {
  switch (intent) {
    case "GREETING":
      return { message: fallbackResponses.greeting, intent };
      
    case "HELP":
      return { message: fallbackResponses.help, intent };
      
    case "CREATE_TASK":
      return {
        message: "📋 Создаю новую задачу. Укажите детали:",
        preview: {
          type: "task",
          data: {
            title: entities.title || "",
            priority: "medium",
            status: "new",
          },
        },
        actions: [
          { type: "confirm", label: "✅ Создать" },
          { type: "cancel", label: "❌ Отмена" },
        ],
        needs_confirm: true,
        intent,
        entities,
      };
      
    case "LIST_TASKS":
      const tasks = context?.tasks || [];
      const taskCount = Array.isArray(tasks) ? tasks.length : 0;
      return {
        message: `📋 **Задачи** (${taskCount})\n\nПерейдите в раздел [Задачи](/dashboard/tasks) для просмотра полного списка.`,
        actions: [
          { type: "navigate", label: "📋 Открыть задачи", data: { url: "/dashboard/tasks" } },
        ],
        intent,
      };
      
    case "CREATE_CONTRACT":
      return {
        message: "📄 Создаю новый договор. Укажите:\n- Название/предмет\n- Контрагент\n- Сумма (если известна)",
        preview: {
          type: "contract",
          data: {
            title: "",
            counterparty: "",
            status: "draft",
          },
        },
        needs_confirm: true,
        intent,
        entities,
      };
      
    case "LIST_CONTRACTS":
      const contracts = context?.contracts || [];
      const contractCount = Array.isArray(contracts) ? contracts.length : 0;
      return {
        message: `📄 **Договоры** (${contractCount})\n\nПерейдите в раздел [Юр отдел](/dashboard/legal) для работы с договорами.`,
        actions: [
          { type: "navigate", label: "📄 Открыть договоры", data: { url: "/dashboard/legal/contracts" } },
        ],
        intent,
      };
      
    case "ANALYZE_CONTRACT":
      return {
        message: "🔍 Для анализа договора загрузите файл в разделе [Договоры](/dashboard/legal/contracts).\n\nИИ извлечёт:\n- Стороны и предмет\n- Сроки и суммы\n- Этапы работ\n- Риски и штрафы",
        actions: [
          { type: "navigate", label: "📄 Открыть договоры", data: { url: "/dashboard/legal/contracts" } },
        ],
        intent,
      };
      
    case "CREATE_DOCUMENT":
      const docType = entities.docType as string || "document";
      const docTypeNames: Record<string, string> = {
        act: "Акт",
        invoice: "Счёт",
        letter: "Письмо",
        power_of_attorney: "Доверенность",
        document: "Документ",
      };
      return {
        message: `📝 Создаю ${docTypeNames[docType]}.\n\nПерейдите в раздел [Документы](/dashboard/legal/documents) для генерации.`,
        actions: [
          { type: "navigate", label: "📝 Создать документ", data: { url: "/dashboard/legal/documents" } },
        ],
        intent,
        entities,
      };
      
    case "LIST_EMPLOYEES":
      const employees = context?.employees || [];
      const empCount = Array.isArray(employees) ? employees.length : 0;
      return {
        message: `👥 **Команда** (${empCount} сотрудников)\n\nПерейдите в раздел [Команда](/dashboard/team) для управления.`,
        actions: [
          { type: "navigate", label: "👥 Открыть команду", data: { url: "/dashboard/team" } },
        ],
        intent,
      };
      
    case "AVAILABLE_EMPLOYEES":
      // В реальности здесь был бы фильтр по статусу
      return {
        message: "👥 Проверьте доступность сотрудников в разделе [Команда](/dashboard/team).\n\nСтатусы:\n- 🟢 Свободен\n- 🟡 Занят\n- 🔴 Перегружен",
        actions: [
          { type: "navigate", label: "👥 Проверить команду", data: { url: "/dashboard/team" } },
        ],
        intent,
      };
      
    case "STATS":
      return {
        message: "📊 **Сводка по бизнесу**\n\nПерейдите на [Главную](/dashboard) для просмотра всех показателей.",
        actions: [
          { type: "navigate", label: "📊 Открыть дашборд", data: { url: "/dashboard" } },
        ],
        intent,
      };
      
    default:
      return { 
        message: fallbackResponses.unknown, 
        intent: "UNKNOWN" 
      };
  }
}

// Вызов OpenAI API (если есть ключ)
async function callGPT(
  message: string, 
  context?: AIRequestBody["context"],
  history?: ChatMessage[]
): Promise<AIResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return null; // Используем fallback
  }
  
  try {
    // Формируем контекст для GPT
    const contextMessage = context ? `
Текущий контекст:
- Сотрудников: ${context.employees?.length || 0}
- Задач: ${context.tasks?.length || 0}
- Договоров: ${context.contracts?.length || 0}
- Решений: ${context.decisions?.length || 0}
` : "";

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT + contextMessage },
      ...(history || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("GPT API error:", response.status);
      return null;
    }

    const data = await response.json();
    const gptMessage = data.choices?.[0]?.message?.content || "";

    // Парсим ответ GPT для извлечения структурированных данных
    // В реальности GPT должен возвращать JSON с preview и actions
    return {
      message: gptMessage,
      intent: "GPT_RESPONSE",
    };
  } catch (error) {
    console.error("GPT call failed:", error);
    return null;
  }
}

// Основной обработчик
export async function POST(request: NextRequest) {
  try {
    const body: AIRequestBody = await request.json();
    const { message, context, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Пробуем GPT
    const gptResponse = await callGPT(message, context, history);
    
    if (gptResponse) {
      return NextResponse.json(gptResponse);
    }

    // Fallback без GPT
    const { intent, entities } = detectIntent(message);
    const fallbackResponse = generateFallbackResponse(intent, entities, context);

    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET для проверки статуса
export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  return NextResponse.json({
    status: "ok",
    gptEnabled: hasApiKey,
    model: hasApiKey ? "gpt-4o-mini" : "fallback",
  });
}
