"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getRecentActivities,
  ActivityEntry,
  activityTypeConfig,
  entityTypeConfig,
} from "@/lib/mockActivity";

interface ActivityFeedProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

// Относительное время
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

// Получить URL для сущности
function getEntityUrl(activity: ActivityEntry): string | null {
  if (!activity.entityId) return null;

  switch (activity.entityType) {
    case "task":
      return `/dashboard/tasks?id=${activity.entityId}`;
    case "decision":
      return `/dashboard/decisions`;
    case "contract":
      return `/dashboard/legal/contracts/${activity.entityId}`;
    case "document":
      return `/dashboard/legal/documents`;
    case "employee":
      return `/dashboard/team`;
    default:
      return null;
  }
}

export function ActivityFeed({
  limit = 10,
  className = "",
  showHeader = true,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActivities(getRecentActivities(limit));
    setIsLoading(false);
  }, [limit]);

  if (isLoading) {
    return (
      <div
        className={`rounded-xl p-5 ${className}`}
        style={{
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: "#111113",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Активность</h2>
          <span className="text-xs text-zinc-500">
            {activities.length} событий
          </span>
        </div>
      )}

      <div className="space-y-1">
        {activities.map((activity, index) => {
          const typeCfg = activityTypeConfig[activity.type];
          const entityCfg = entityTypeConfig[activity.entityType];
          const url = getEntityUrl(activity);

          const content = (
            <div
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                url ? "hover:bg-white/5 cursor-pointer" : ""
              }`}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${typeCfg.color}20` }}
              >
                {typeCfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-zinc-500">
                    {activity.actor}
                  </span>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">
                    {timeAgo(activity.createdAt)}
                  </span>
                  {activity.entityTitle && (
                    <>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500 truncate">
                        {entityCfg.icon} {activity.entityTitle}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );

          return url ? (
            <Link key={activity.id} href={url}>
              {content}
            </Link>
          ) : (
            <div key={activity.id}>{content}</div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            <span className="text-2xl">📭</span>
            <p className="text-sm mt-2">Нет активности</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityFeed;
