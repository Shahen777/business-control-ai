"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "./types";
import { ChatMessageItem } from "./ChatMessage";
import { CommandChips } from "./CommandChips";
import { parseCommand } from "@/lib/commandParser";
import { executeAction } from "@/lib/actions";
import { getAllTasks } from "@/lib/mockTasks";
import { getEmployees } from "@/lib/mockEmployees";
import { getAllContracts } from "@/lib/mockLegal";

interface ChatPanelProps {
  className?: string;
}

// Генератор ID для сообщений
let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg_${++messageIdCounter}_${Date.now()}`;
}

// Тип ответа от API
interface AIResponse {
  message: string;
  preview?: {
    type: "task" | "contract" | "document" | "employee" | "decision";
    data: Record<string, unknown>;
  };
  actions?: { type: string; label: string; data?: Record<string, unknown> }[];
  needs_confirm?: boolean;
  intent?: string;
  entities?: Record<string, unknown>;
}

/**
 * Главная панель ИИ-чата с GPT интеграцией
 */
export function ChatPanel({ className = "" }: ChatPanelProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Привет! Я ИИ-помощник Business Control.\n\nЯ могу помочь вам:\n• Создавать задачи и решения\n• Работать с договорами и документами\n• Показывать просроченные задачи\n• Назначать исполнителей\n\nПопробуйте команды из подсказок ниже!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [useApi, setUseApi] = useState(true); // Переключатель API/Локальный
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Вызов API
  const callAI = async (message: string): Promise<AIResponse | null> => {
    try {
      const context = {
        employees: getEmployees(),
        tasks: getAllTasks(),
        contracts: getAllContracts(),
      };

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        console.error("AI API error:", response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("AI API call failed:", error);
      return null;
    }
  };

  // Обработка действий из ответа ИИ
  const handleAIAction = (action: { type: string; data?: Record<string, unknown> }) => {
    if (action.type === "navigate" && action.data?.url) {
      router.push(action.data.url as string);
    }
  };
  
  // Отправка сообщения
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isProcessing) return;
    
    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Пробуем API если включён
    if (useApi) {
      const aiResponse = await callAI(text);
      
      if (aiResponse) {
        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: aiResponse.message,
          timestamp: new Date(),
          aiActions: aiResponse.actions,
          status: aiResponse.needs_confirm ? "pending" : undefined,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }
    }
    
    // Fallback на локальный парсер
    const parsed = parseCommand(text);
    
    // Создаём ответ ассистента
    const assistantMessage: ChatMessage = {
      id: generateMessageId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      parsedCommand: parsed,
      status: parsed.intent !== "UNKNOWN" ? "pending" : undefined,
    };
    
    // Если команда не распознана, показываем помощь
    if (parsed.intent === "UNKNOWN") {
      assistantMessage.content = parsed.previewText;
    }
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);
    
    // Фокус на input
    setTimeout(() => inputRef.current?.focus(), 100);
  };
  
  // Подтверждение действия
  const handleConfirm = async (messageId: string) => {
    setIsProcessing(true);
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    if (!message.parsedCommand) return;
    
    // Выполняем действие
    const result = await executeAction(message.parsedCommand);
    
    // Обновляем сообщение
    setMessages(prev => {
      const updated = [...prev];
      updated[messageIndex] = {
        ...message,
        status: "executed",
        content: result.message,
        actionResult: result,
      };
      return updated;
    });
    
    setIsProcessing(false);
  };
  
  // Отмена действия
  const handleCancel = (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    setMessages(prev => {
      const updated = [...prev];
      updated[messageIndex] = {
        ...updated[messageIndex],
        status: "cancelled",
        content: "❌ Действие отменено",
      };
      return updated;
    });
  };
  
  // Клик по подсказке
  const handleChipClick = (command: string) => {
    setInputValue(command);
    inputRef.current?.focus();
  };
  
  // Отправка по Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className={`flex flex-col h-full bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700 bg-zinc-800/80">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <div>
          <div className="font-medium text-white text-sm">ИИ-ассистент</div>
          <div className="text-xs text-zinc-400">Управление через чат</div>
        </div>
        {isProcessing && (
          <div className="ml-auto flex items-center gap-2 text-xs text-zinc-400">
            <div className="animate-spin w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full" />
            Обработка...
          </div>
        )}
      </div>
      
      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <ChatMessageItem
            key={message.id}
            message={message}
            onConfirm={message.status === "pending" ? handleConfirm : undefined}
            onCancel={message.status === "pending" ? handleCancel : undefined}
            isProcessing={isProcessing}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Быстрые подсказки */}
      <CommandChips onChipClick={handleChipClick} disabled={isProcessing} />
      
      {/* Поле ввода */}
      <div className="p-3 border-t border-zinc-700 bg-zinc-800/80">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите команду..."
            disabled={isProcessing}
            className="
              flex-1 px-4 py-2.5 
              bg-zinc-700 border border-zinc-600 rounded-xl
              text-white text-sm placeholder:text-zinc-500
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            className="
              px-4 py-2.5 rounded-xl font-medium text-sm
              bg-indigo-600 text-white
              hover:bg-indigo-500 active:scale-95
              disabled:bg-zinc-600 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:active:scale-100
              transition-all duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
