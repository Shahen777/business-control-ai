"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChatMessage, MessageStatus } from "./types";
import { ConfirmBar } from "./ConfirmBar";
import { Task } from "@/types/tasks";

interface ChatMessageItemProps {
  message: ChatMessage;
  onConfirm?: (messageId: string) => void;
  onCancel?: (messageId: string) => void;
  isProcessing?: boolean;
}

/**
 * Компонент сообщения в чате
 */
export function ChatMessageItem({ 
  message, 
  onConfirm, 
  onCancel,
  isProcessing 
}: ChatMessageItemProps) {
  const router = useRouter();
  const isUser = message.role === "user";
  const isPending = message.status === "pending";
  const isExecuted = message.status === "executed";
  const isCancelled = message.status === "cancelled";
  
  // Форматирование времени
  const timeStr = message.timestamp.toLocaleTimeString("ru-RU", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
  
  // Навигация к объекту
  const handleNavigate = () => {
    if (message.actionResult?.navigateTo) {
      router.push(message.actionResult.navigateTo);
    }
  };
  
  // Рендеринг preview текста с markdown-подобным форматированием
  const renderPreviewText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Заголовок **text**
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        return (
          <div key={i} className="mb-1">
            {parts.map((part, j) => 
              j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
            )}
          </div>
        );
      }
      // Пункты списка
      if (line.startsWith("•")) {
        return <div key={i} className="ml-2 text-zinc-300">{line}</div>;
      }
      return <div key={i}>{line}</div>;
    });
  };
  
  // Рендеринг результата (созданного объекта)
  const renderResult = () => {
    if (!message.actionResult) return null;
    
    const { data, entityType } = message.actionResult;
    
    if (entityType === "task" && data && !Array.isArray(data)) {
      const task = data as Task;
      return (
        <div className="mt-3 p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400">✅</span>
            <span className="font-medium text-white">Задача создана</span>
          </div>
          <div className="text-sm text-zinc-300 space-y-1">
            <div>📝 {task.title}</div>
            <div>📅 Срок: {new Date(task.dueDate).toLocaleDateString("ru-RU")}</div>
            {task.assigneeName && task.assigneeName !== "Не назначен" && (
              <div>👤 {task.assigneeName}</div>
            )}
          </div>
          {message.actionResult.navigateTo && (
            <button
              onClick={handleNavigate}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Открыть задачу →
            </button>
          )}
        </div>
      );
    }
    
    if (entityType === "tasks" && Array.isArray(data)) {
      const tasks = data as Task[];
      if (tasks.length === 0) return null;
      
      return (
        <div className="mt-3 p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
          <div className="text-sm text-zinc-300 space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2">
                <span className={
                  task.status === "done" ? "text-green-400" : 
                  new Date(task.dueDate) < new Date() ? "text-red-400" : "text-amber-400"
                }>
                  {task.status === "done" ? "✅" : "⚠️"}
                </span>
                <span className="truncate">{task.title}</span>
              </div>
            ))}
            {tasks.length > 5 && (
              <div className="text-zinc-500 text-xs">... и ещё {tasks.length - 5}</div>
            )}
          </div>
          {message.actionResult.navigateTo && (
            <button
              onClick={handleNavigate}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Открыть все →
            </button>
          )}
        </div>
      );
    }
    
    if (entityType === "employee" && data && !Array.isArray(data)) {
      const emp = data as { name: string; role: string };
      return (
        <div className="mt-3 p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400">✅</span>
            <span className="font-medium text-white">Сотрудник добавлен</span>
          </div>
          <div className="text-sm text-zinc-300">
            👤 {emp.name}
          </div>
          {message.actionResult.navigateTo && (
            <button
              onClick={handleNavigate}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Открыть профиль →
            </button>
          )}
        </div>
      );
    }
    
    if (entityType === "decision" && data && !Array.isArray(data)) {
      const dec = data as { title: string; priority: string };
      return (
        <div className="mt-3 p-3 bg-zinc-700/50 rounded-lg border border-zinc-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400">✅</span>
            <span className="font-medium text-white">Решение создано</span>
          </div>
          <div className="text-sm text-zinc-300">
            🧠 {dec.title}
          </div>
          {message.actionResult.navigateTo && (
            <button
              onClick={handleNavigate}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Открыть решение →
            </button>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div 
        className={`
          max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3
          ${isUser 
            ? "bg-indigo-600 text-white rounded-br-md" 
            : "bg-zinc-700 text-zinc-200 rounded-bl-md"
          }
        `}
      >
        {/* Контент сообщения */}
        <div className="text-sm">
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <>
              {/* Preview от парсера */}
              {message.parsedCommand && isPending && (
                <div className="space-y-1">
                  {renderPreviewText(message.parsedCommand.previewText)}
                  
                  {/* Confidence indicator */}
                  {message.parsedCommand.confidence < 0.7 && (
                    <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                      ⚠️ Не уверен в интерпретации. Проверьте данные.
                    </div>
                  )}
                </div>
              )}
              
              {/* Обычное сообщение (текст результата или отмены) */}
              {!isPending && message.content && (
                <div>{renderPreviewText(message.content)}</div>
              )}

              {/* Контент от API (без парсера) */}
              {!message.parsedCommand && !message.actionResult && message.content && (
                <div>{renderPreviewText(message.content)}</div>
              )}

              {/* Кнопки действий от API */}
              {message.aiActions && message.aiActions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.aiActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (action.type === "navigate" && action.data?.url) {
                          router.push(action.data.url as string);
                        }
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-zinc-600 hover:bg-zinc-500 text-white transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Результат выполнения */}
              {isExecuted && renderResult()}
              
              {/* Кнопки подтверждения */}
              {isPending && onConfirm && onCancel && (
                <ConfirmBar
                  onConfirm={() => onConfirm(message.id)}
                  onCancel={() => onCancel(message.id)}
                  disabled={isProcessing}
                />
              )}
            </>
          )}
        </div>
        
        {/* Время */}
        <div className={`
          text-xs mt-1.5 
          ${isUser ? "text-indigo-200" : "text-zinc-500"}
          ${isCancelled ? "line-through" : ""}
        `}>
          {timeStr}
          {isCancelled && <span className="ml-2">отменено</span>}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageItem;
