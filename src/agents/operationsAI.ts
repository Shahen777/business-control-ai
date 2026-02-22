/**
 * Operations AI - Операционный ИИ-агент
 * Контроль загрузки техники и проектов, выявление простоев,
 * анализ эффективности использования ресурсов, инициирование корректирующих действий
 */

import { AIInsight, Asset, Project, Recommendation } from '@/types';

export interface OperationsAIConfig {
  idleAssetDaysThreshold: number;       // После скольких дней простоя алертить
  minUtilizationThreshold: number;      // Минимальный % загрузки
  budgetOverrunThreshold: number;       // Процент превышения бюджета для алерта
  maintenanceWarningDays: number;       // За сколько дней предупреждать о ТО
}

const defaultConfig: OperationsAIConfig = {
  idleAssetDaysThreshold: 3,
  minUtilizationThreshold: 70,
  budgetOverrunThreshold: 15,
  maintenanceWarningDays: 7,
};

/**
 * Анализирует активы и возвращает инсайты о проблемах
 */
export function analyzeAssets(
  assets: Asset[],
  config: OperationsAIConfig = defaultConfig
): AIInsight[] {
  const insights: AIInsight[] = [];
  const today = new Date();

  for (const asset of assets) {
    // Проверка простоя
    if (asset.status === 'idle' && asset.idleDays && asset.idleDays >= config.idleAssetDaysThreshold) {
      const dailyLoss = asset.monthlyExpenses / 30;
      const totalLoss = dailyLoss * asset.idleDays;
      
      insights.push({
        id: `idle-${asset.id}`,
        type: 'alert',
        agent: 'operations',
        message: `${asset.name} простаивает ${asset.idleDays} дней. Потери: ${totalLoss.toLocaleString('ru-RU')} ₽`,
        createdAt: new Date().toISOString(),
        relatedEntityId: asset.id,
        relatedEntityType: 'asset',
      });
    }

    // Проверка низкой загрузки
    if (asset.status === 'working' && asset.utilizationRate < config.minUtilizationThreshold) {
      insights.push({
        id: `low-util-${asset.id}`,
        type: 'insight',
        agent: 'operations',
        message: `${asset.name} загружен только на ${asset.utilizationRate}%. Возможна оптимизация.`,
        createdAt: new Date().toISOString(),
        relatedEntityId: asset.id,
        relatedEntityType: 'asset',
      });
    }

    // Проверка предстоящего ТО
    if (asset.nextMaintenance) {
      const maintenanceDate = new Date(asset.nextMaintenance.split('.').reverse().join('-'));
      const daysDiff = Math.floor((maintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 0 && daysDiff <= config.maintenanceWarningDays) {
        insights.push({
          id: `maintenance-${asset.id}`,
          type: 'warning',
          agent: 'operations',
          message: `${asset.name}: плановое ТО через ${daysDiff} дней. Запланируйте простой.`,
          createdAt: new Date().toISOString(),
          relatedEntityId: asset.id,
          relatedEntityType: 'asset',
        });
      }
    }
  }

  return insights;
}

/**
 * Анализирует проекты и возвращает инсайты о проблемах
 */
export function analyzeProjects(
  projects: Project[],
  config: OperationsAIConfig = defaultConfig
): AIInsight[] {
  const insights: AIInsight[] = [];

  for (const project of projects) {
    // Проверка превышения бюджета
    const budgetUsedPercent = (project.spent / project.budget) * 100;
    const expectedUsedPercent = project.progress;
    
    if (budgetUsedPercent > expectedUsedPercent + config.budgetOverrunThreshold) {
      const overrun = project.spent - (project.budget * project.progress / 100);
      
      insights.push({
        id: `budget-overrun-${project.id}`,
        type: 'warning',
        agent: 'operations',
        message: `Проект "${project.name}" превышает бюджет на ${(budgetUsedPercent - expectedUsedPercent).toFixed(0)}%. Перерасход: ${overrun.toLocaleString('ru-RU')} ₽`,
        createdAt: new Date().toISOString(),
        relatedEntityId: project.id,
        relatedEntityType: 'project',
      });
    }

    // Проверка отставания от графика
    const today = new Date();
    const deadline = new Date(project.deadline.split('.').reverse().join('-'));
    const startDate = new Date(project.startDate.split('.').reverse().join('-'));
    
    const totalDays = (deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const expectedProgress = Math.min(100, (elapsedDays / totalDays) * 100);
    
    if (project.progress < expectedProgress - 15) {
      insights.push({
        id: `behind-schedule-${project.id}`,
        type: 'alert',
        agent: 'operations',
        message: `Проект "${project.name}" отстаёт от графика. Ожидаемый прогресс: ${expectedProgress.toFixed(0)}%, фактический: ${project.progress}%`,
        createdAt: new Date().toISOString(),
        relatedEntityId: project.id,
        relatedEntityType: 'project',
      });
    }
  }

  return insights;
}

/**
 * Генерирует рекомендации для простаивающего актива
 */
export function generateIdleAssetRecommendations(
  asset: Asset,
  activeProjects: Project[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const dailyRevenue = asset.monthlyRevenue / 30;

  // Рекомендация 1: Перебросить на другой проект
  const suitableProject = activeProjects.find(p => 
    p.status === 'active' && 
    p.assignedAssets.length < 3 // условие - проект может принять ещё технику
  );
  
  if (suitableProject) {
    recommendations.push({
      id: 'reassign-project',
      action: `Перебросить на проект "${suitableProject.name}"`,
      amount: dailyRevenue,
      probability: 'высокая',
      effort: 'логистика 1 день',
    });
  }

  // Рекомендация 2: Субаренда
  recommendations.push({
    id: 'sublease',
    action: 'Выставить на субаренду',
    amount: dailyRevenue * 0.7, // 70% от обычной выручки
    probability: 'средняя',
    effort: 'размещение объявления',
  });

  // Рекомендация 3: Провести ТО, если давно не было
  if (asset.nextMaintenance) {
    const maintenanceDate = new Date(asset.nextMaintenance.split('.').reverse().join('-'));
    const daysUntilMaintenance = Math.floor((maintenanceDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilMaintenance < 30) {
      recommendations.push({
        id: 'maintenance',
        action: 'Провести плановое ТО заранее',
        amount: -45000, // примерная стоимость ТО
        probability: 'гарантированная',
        effort: '2-3 дня в сервисе',
      });
    }
  }

  return recommendations;
}

/**
 * Рассчитывает общую эффективность использования активов
 */
export function calculateFleetEfficiency(assets: Asset[]): {
  averageUtilization: number;
  totalMonthlyProfit: number;
  idleLosses: number;
  recommendations: string[];
} {
  const workingAssets = assets.filter(a => a.status === 'working');
  const idleAssets = assets.filter(a => a.status === 'idle');

  const averageUtilization = workingAssets.length > 0
    ? workingAssets.reduce((sum, a) => sum + a.utilizationRate, 0) / workingAssets.length
    : 0;

  const totalMonthlyProfit = workingAssets.reduce(
    (sum, a) => sum + (a.monthlyRevenue - a.monthlyExpenses),
    0
  );

  const idleLosses = idleAssets.reduce(
    (sum, a) => sum + a.monthlyExpenses,
    0
  );

  const recommendations: string[] = [];

  if (averageUtilization < 70) {
    recommendations.push('Рассмотрите оптимизацию графика работы техники');
  }

  if (idleAssets.length > 0) {
    recommendations.push(`${idleAssets.length} единиц техники простаивают. Рассмотрите субаренду или продажу.`);
  }

  if (workingAssets.some(a => a.utilizationRate < 50)) {
    recommendations.push('Есть техника с критически низкой загрузкой — проверьте целесообразность её содержания');
  }

  return {
    averageUtilization,
    totalMonthlyProfit,
    idleLosses,
    recommendations,
  };
}

export default {
  analyzeAssets,
  analyzeProjects,
  generateIdleAssetRecommendations,
  calculateFleetEfficiency,
};
