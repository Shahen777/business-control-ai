/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирует число как валюту в рублях
 */
export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} млн ₽`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(0)} тыс ₽`;
    }
  }
  return amount.toLocaleString('ru-RU') + ' ₽';
}

/**
 * Форматирует дату в русском формате
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Форматирует дату с временем
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Рассчитывает количество дней между датами
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Форматирует процент
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Определяет цвет для процента (для индикаторов загрузки и т.д.)
 */
export function getPercentColor(
  value: number,
  thresholds: { warning: number; danger: number } = { warning: 70, danger: 40 }
): 'green' | 'yellow' | 'red' {
  if (value >= thresholds.warning) return 'green';
  if (value >= thresholds.danger) return 'yellow';
  return 'red';
}

/**
 * Генерирует уникальный ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Склонение слов в зависимости от числа
 * pluralize(5, ['день', 'дня', 'дней']) => '5 дней'
 */
export function pluralize(count: number, words: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const index = count % 100 > 4 && count % 100 < 20
    ? 2
    : cases[Math.min(count % 10, 5)];
  return `${count} ${words[index]}`;
}

/**
 * Парсит строку даты в формате DD.MM.YYYY
 */
export function parseRuDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Форматирует дату в формат DD.MM.YYYY
 */
export function toRuDateString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
