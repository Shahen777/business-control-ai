/**
 * Типы для чата
 */

import { ParsedCommand } from "@/lib/commandParser";
import { ActionResult } from "@/lib/actions";

export type MessageRole = "user" | "assistant";
export type MessageStatus = "pending" | "confirmed" | "cancelled" | "executed";

// Действие ИИ
export interface AIAction {
  type: string;
  label: string;
  data?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  // Для сообщений ассистента с действиями
  parsedCommand?: ParsedCommand;
  actionResult?: ActionResult;
  status?: MessageStatus;
  // Действия от GPT API
  aiActions?: AIAction[];
}
