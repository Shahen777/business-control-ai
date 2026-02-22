// Типы для модуля Решений (AI Decisions)

export type DecisionStatus = "pending" | "in_progress" | "accepted" | "rejected" | "postponed";
export type DecisionPriority = "critical" | "high" | "medium" | "low";

export interface DecisionNextStep {
  text: string;
  amount: string;
  effort: "low" | "medium" | "high";
  deadline: string;
}

export interface DecisionAlternative {
  text: string;
  amount: string;
  effort: "low" | "medium" | "high";
}

export interface Decision {
  id: number;
  title: string;
  agent: string;
  priority: DecisionPriority;
  status: DecisionStatus;
  createdAt: string;
  acceptedAt?: string;
  reason: string;
  effect: string;
  risks: string[];
  nextStep: DecisionNextStep;
  alternatives: DecisionAlternative[];
  result?: string;
  department?: string;
  impactRub?: number;
}
