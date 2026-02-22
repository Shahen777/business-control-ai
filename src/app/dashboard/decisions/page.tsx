"use client";

import { useState, useEffect } from "react";
import { getAllDecisions, updateDecisionStatus } from "@/lib/mockDecisions";
import { Decision } from "@/types/decisions";
import { KpiCard } from "@/components/design-system/KpiCard";
import { DecisionCard } from "@/components/design-system/DecisionCard";
import { Toolbar, ToolbarTabs } from "@/components/design-system/Toolbar";
import { Button } from "@/components/Button";
import { PageLayout } from "@/components/design-system/PageLayout";
import { PageHeader } from "@/components/design-system/PageHeader";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filter, setFilter] = useState<"pending" | "accepted" | "all">("pending");

  useEffect(() => {
    setDecisions(getAllDecisions());
  }, []);

  const filteredDecisions = decisions.filter((d) => {
    if (filter === "pending") return d.status === "pending";
    if (filter === "accepted") return d.status === "accepted";
    return true;
  });

  const pendingCount = decisions.filter((d) => d.status === "pending").length;
  const acceptedCount = decisions.filter((d) => d.status === "accepted").length;
  const totalImpact = decisions
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + (d.impactRub || 0), 0);
  const criticalCount = decisions.filter(
    (d) => d.priority === "critical" && d.status === "pending"
  ).length;

  const handleAccept = (id: number) => {
    const updated = updateDecisionStatus(id, "accepted");
    if (updated) {
      setDecisions(getAllDecisions());
    }
  };

  const handleReject = (id: number) => {
    const updated = updateDecisionStatus(id, "rejected");
    if (updated) {
      setDecisions(getAllDecisions());
    }
  };

  return (
    <PageLayout>
      <div className="animate-fadeIn space-y-8">
        <PageHeader
          title="Решения ИИ"
          subtitle="Рекомендации от ИИ-агентов для вашего бизнеса"
          actions={
            <Button variant="primary">
              ⚡ Запросить анализ
            </Button>
          }
        />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="⏳"
          label="Ожидают решения"
          value={pendingCount.toString()}
          status="warning"
        />
        <KpiCard
          icon="✅"
          label="Принято"
          value={acceptedCount.toString()}
          status="success"
        />
        <KpiCard
          icon="💰"
          label="Потенциальный эффект"
          value={totalImpact > 0 ? `+${(totalImpact / 1000).toFixed(0)}к ₽` : "—"}
          status="neutral"
        />
        <KpiCard
          icon="🔴"
          label="Критичных"
          value={criticalCount.toString()}
          status={criticalCount > 0 ? "danger" : "neutral"}
        />
      </div>

      {/* Filters */}
      <Toolbar>
        <ToolbarTabs
          value={filter}
          onChange={(val) => setFilter(val as typeof filter)}
          tabs={[
            { value: "pending", label: `Ожидают (${pendingCount})` },
            { value: "accepted", label: `Принятые (${acceptedCount})` },
            { value: "all", label: "Все" },
          ]}
        />
      </Toolbar>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-zinc-800/30 border border-zinc-700/50">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-zinc-400 text-[14px]">
              {filter === "pending"
                ? "Нет ожидающих решений"
                : "Нет решений по выбранному фильтру"}
            </p>
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              id={decision.id}
              title={decision.title}
              description={decision.reason}
              priority={decision.priority}
              agent={decision.agent}
              impactRub={decision.impactRub}
              cost={decision.nextStep?.amount ? parseInt(decision.nextStep.amount) : undefined}
              effort={decision.nextStep?.effort}
              risks={decision.risks}
              timeline={decision.nextStep?.deadline}
              status={decision.status}
              onAccept={() => handleAccept(decision.id)}
              onReject={() => handleReject(decision.id)}
            />
          ))
        )}
      </div>
      </div>
    </PageLayout>
  );
}
