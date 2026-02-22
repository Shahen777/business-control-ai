// Типы для ИИ-агентов и центра решений

export type AgentType = 'business' | 'finance' | 'operations' | 'sales';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type AgentDecisionStatus = 'pending' | 'in_review' | 'completed' | 'rejected';
export type InsightType = 'warning' | 'alert' | 'insight' | 'success';

export interface AIInsight {
  id: string;
  type: InsightType;
  agent: AgentType;
  message: string;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: 'project' | 'asset' | 'transaction' | 'debtor';
}

export interface Recommendation {
  id: string;
  action: string;
  amount: number;
  probability: 'высокая' | 'средняя' | 'низкая' | 'гарантированная';
  effort: string;
  selected?: boolean;
}

export interface DecisionAnalysis {
  problem: string;
  cause: string;
  impact: string;
}

export interface AIDecision {
  id: string;
  title: string;
  agent: AgentType;
  priority: Priority;
  status: AgentDecisionStatus;
  createdAt: string;
  completedAt?: string;
  resolution?: string;
  analysis: DecisionAnalysis;
  recommendations: Recommendation[];
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  enabled: boolean;
  thresholds: Record<string, number>;
}
