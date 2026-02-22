"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; action: string }[];
}

const suggestedQuestions = [
  "Почему риск кассового разрыва?",
  "Какие задачи на сегодня?",
  "Покажи дебиторку",
  "Что делать с простоем техники?",
];

// Иконка AI
const AIIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

// Иконка закрытия
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Иконка отправки
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);  // Закрыт по умолчанию
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Привет! Я Control AI — ваш бизнес-ассистент. Могу помочь с анализом финансов, управлением задачами и принятием решений. Что вас интересует?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Фокус на input при открытии
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Симуляция ответа AI
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Симуляция ответа (в реальности здесь будет API вызов)
    setTimeout(() => {
      let response: Message;

      if (messageText.toLowerCase().includes("разрыв") || messageText.toLowerCase().includes("кассов")) {
        response = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Риск кассового разрыва возникает через 12 дней из-за просроченной дебиторки от ООО «СтройМир» (450 000 ₽, 14 дней просрочки) и запланированной выплаты зарплаты.\n\nРекомендую:",
          actions: [
            { label: "Отправить напоминание", action: "send_reminder" },
            { label: "Перенести платёж", action: "reschedule" },
            { label: "Создать задачу", action: "create_task" },
          ],
        };
      } else if (messageText.toLowerCase().includes("задач")) {
        response = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "На сегодня у вас 2 задачи:\n\n1. **Подписать договор** с ООО «Технопарк» (до 18:00)\n2. **Проверить отчёт** по проекту ЖК Солнечный\n\nТакже есть 1 просроченная задача по закупке материалов.",
          actions: [
            { label: "Открыть задачи", action: "open_tasks" },
          ],
        };
      } else if (messageText.toLowerCase().includes("дебитор")) {
        response = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Общая дебиторская задолженность: **890 000 ₽**\n\nПросрочено 3 платежа:\n• ООО «СтройМир» — 450 000 ₽ (14 дней)\n• ИП Петров — 120 000 ₽ (7 дней)\n• ООО «Логистик» — 85 000 ₽ (3 дня)",
          actions: [
            { label: "Отправить напоминания", action: "send_reminders" },
            { label: "Открыть финансы", action: "open_finance" },
          ],
        };
      } else if (messageText.toLowerCase().includes("простой") || messageText.toLowerCase().includes("техник")) {
        response = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Сейчас простаивает **Экскаватор №3** — потери 75 000 ₽/неделю.\n\nВарианты:\n• Сдать в субаренду (есть заявка от ООО «СтройПодряд»)\n• Перебросить на объект «ЖК Солнечный»",
          actions: [
            { label: "Оформить субаренду", action: "sublease" },
            { label: "Перебросить технику", action: "relocate" },
          ],
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Понял вас. Сейчас проанализирую данные и подготовлю рекомендации. Могу помочь с:\n\n• Анализом финансов и прогнозами\n• Управлением проектами и задачами\n• Контролем техники и активов\n• Работой с документами",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (action: string) => {
    // В реальности здесь будет навигация или действие
    console.log("Action:", action);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="ai-chat-button"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <AIIcon />
        <span className="hidden sm:inline">Control AI</span>
      </button>

      {/* Chat Overlay */}
      <div
        className={`ai-chat-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Chat Panel */}
      <div className={`ai-chat-panel ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-secondary)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center">
              <AIIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Control AI</h3>
              <p className="text-xs text-[var(--text-muted)]">Бизнес-ассистент</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[var(--accent-blue)] text-white"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Action buttons */}
                {message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action.action)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] text-[var(--accent-blue)] hover:bg-[var(--bg-elevated)] transition-colors border border-[var(--border-primary)]"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--bg-tertiary)] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-[12px] text-zinc-500 font-medium mb-3">Популярные вопросы:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium
                           bg-zinc-800/40 text-zinc-400 
                           hover:bg-zinc-800 hover:text-white 
                           border border-zinc-700/50 hover:border-zinc-600/70
                           transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[var(--border-secondary)]">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спросите что-нибудь..."
              className="flex-1 px-4 py-3 rounded-[10px] bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-3 rounded-[10px] bg-[var(--accent-blue)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-blue)]/90 transition-colors"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
