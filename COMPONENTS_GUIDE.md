# 🎨 Дизайн-система компонентов - Шпаргалка

Быстрая справка по использованию компонентов дизайн-системы Business Control AI.

## Импорт

```tsx
// Импортировать все компоненты разом
import { 
  KpiCard, 
  StatusBadge, 
  StyledCard, 
  TimelineItem, 
  Toolbar, 
  ToolbarTabs, 
  ToolbarSelect, 
  ToolbarToggle,
  EquipmentCard,
  DecisionCard
} from "@/components/design-system";
```

---

## 1️⃣ KpiCard - Метрика карточка

**Для отображения ключевых показателей (KPI)**

### Базовое использование
```tsx
<KpiCard
  icon="💰"
  label="Выручка"
  value="245к ₽"
  status="success"
/>
```

### С дополнительной информацией
```tsx
<KpiCard
  icon="🏗️"
  label="Всего техники"
  value="12"
  secondary="3 на обслуживании"
  status="neutral"
/>
```

### Props
- `icon` (string) - Emoji иконка
- `label` (string) - Название метрики
- `value` (string) - Значение (цифра, процент, сумма)
- `secondary?` (string) - Дополнительная информация
- `status?` ("success" | "danger" | "warning" | "neutral") - Цветовой статус
  - success: зеленый (emerald-500)
  - danger: красный (red-500)
  - warning: оранжевый (amber-500)
  - neutral: стандартный (slate)

### Примеры статусов
```tsx
// Успех
<KpiCard icon="✅" label="Работает" value="8" status="success" />

// Опасность
<KpiCard icon="🔴" label="Критичные" value="2" status="danger" />

// Предупреждение
<KpiCard icon="⚠️" label="Простой" value="3" status="warning" />

// Нейтральный
<KpiCard icon="📊" label="Загрузка" value="75%" status="neutral" />
```

---

## 2️⃣ StatusBadge - Бейдж статуса

**Для отображения статусов (inline элементы)**

### Базовое использование
```tsx
<StatusBadge status="success">
  Работает
</StatusBadge>
```

### С размером
```tsx
<StatusBadge status="danger" size="md">
  Критичное
</StatusBadge>
```

### Props
- `status` ("success" | "danger" | "warning" | "info") - Тип статуса
  - success: зеленый (emerald)
  - danger: красный (red)
  - warning: оранжевый (amber)
  - info: синий (blue)
- `children` (string) - Текст статуса
- `size?` ("sm" | "md") - Размер (sm: 11px, md: 12px)

### Примеры
```tsx
<StatusBadge status="success" size="sm">✓ Принято</StatusBadge>
<StatusBadge status="danger">✗ Отклонено</StatusBadge>
<StatusBadge status="warning">⚠ Ожидание</StatusBadge>
<StatusBadge status="info">ℹ Информация</StatusBadge>
```

---

## 3️⃣ StyledCard - Базовая карточка

**Для создания универсальных карточек контента**

### Базовое использование
```tsx
<StyledCard>
  <h3>Заголовок</h3>
  <p>Содержание карточки</p>
</StyledCard>
```

### С вариантами
```tsx
{/* Поднятая карточка (для фокуса) */}
<StyledCard variant="elevated">
  Важный контент
</StyledCard>

{/* Только граница */}
<StyledCard variant="outlined">
  Простой контент
</StyledCard>
```

### С интерактивностью
```tsx
<StyledCard interactive>
  <Link href="/details">
    Кликабельная карточка
  </Link>
</StyledCard>
```

### Props
- `children` (React.ReactNode) - Содержание
- `variant?` ("default" | "elevated" | "outlined")
- `interactive?` (boolean) - Добавить hover эффект
- `className?` (string) - Дополнительные Tailwind классы

---

## 4️⃣ TimelineItem - Элемент временной линии

**Для отображения событий, истории**

### Базовое использование
```tsx
<TimelineItem
  icon="✅"
  title="Техника назначена"
  description="Экскаватор CAT 320D на проект"
/>
```

### С временем
```tsx
<TimelineItem
  icon="🔧"
  time="14:30"
  title="ТО выполнено"
  description="Плановое обслуживание завершено"
/>
```

### Props
- `icon` (string) - Emoji иконка
- `title` (string) - Заголовок события
- `time?` (string) - Время события (например "14:30" или "15 дек")
- `description?` (string) - Описание события

### Примеры
```tsx
<TimelineItem 
  icon="✅" 
  time="Вчера"
  title="Отчёт принят" 
  description="Finance AI одобрил отчёт проекта" 
/>

<TimelineItem
  icon="💰"
  title="Платёж получен"
  description="ООО СтройМир перевел 450к ₽"
/>

<TimelineItem
  icon="⏸️"
  title="Техника простаивает"
  description="Экскаватор №3 не загружен"
/>
```

---

## 5️⃣ Toolbar - Система фильтров

**Для организации фильтров, сортировки, переключателей**

### Структура
```tsx
<Toolbar>
  {/* Таб-фильтры */}
  <ToolbarTabs
    value={activeTab}
    onChange={setActiveTab}
    tabs={[
      { value: "all", label: "Все" },
      { value: "working", label: "Работает" },
    ]}
  />
  
  {/* Dropdown выбор */}
  <ToolbarSelect
    value={sortField}
    onChange={setSortField}
    options={[
      { value: "name", label: "По названию" },
      { value: "date", label: "По дате" },
    ]}
  />
  
  {/* Чекбокс-переключатель */}
  <ToolbarToggle
    checked={showArchived}
    onChange={setShowArchived}
    label="Показать архив"
  />
</Toolbar>
```

### ToolbarTabs Props
- `value` (string) - Активный таб
- `onChange` ((value: string) => void) - Callback при изменении
- `tabs` (TabItem[]) - Список табов { value, label }

### ToolbarSelect Props
- `value` (string) - Выбранное значение
- `onChange` ((value: string) => void) - Callback
- `options` ({ value, label }[]) - Список опций

### ToolbarToggle Props
- `checked` (boolean) - Состояние
- `onChange` ((checked: boolean) => void) - Callback
- `label` (string) - Текст лейбла

### Примеры
```tsx
// Фильтры техники
<Toolbar>
  <ToolbarTabs
    value={status}
    onChange={setStatus}
    tabs={[
      { value: "all", label: "Все" },
      { value: "working", label: "Работает" },
      { value: "idle", label: "Простой" },
      { value: "maintenance", label: "ТО" },
    ]}
  />
  <ToolbarSelect
    value={sortBy}
    onChange={setSortBy}
    options={[
      { value: "utilization", label: "По загрузке" },
      { value: "revenue", label: "По выручке" },
      { value: "hours", label: "По часам" },
    ]}
  />
</Toolbar>

// Фильтры решений
<Toolbar>
  <ToolbarTabs
    value={filter}
    onChange={setFilter}
    tabs={[
      { value: "pending", label: "Ожидают" },
      { value: "accepted", label: "Принятые" },
      { value: "all", label: "Все" },
    ]}
  />
</Toolbar>
```

---

## 6️⃣ EquipmentCard - Карточка техники

**Специализированная карточка для отображения техники в списках**

### Использование
```tsx
<EquipmentCard
  id={42}
  name="Экскаватор CAT 320D"
  status="working"
  utilizationPercent={75}
  location="Ул. Ленина, 42"
  operator="Иван Петров"
  hoursToday={8}
  hoursWeek={48}
  hoursMonth={160}
  revenueThisMonth={145000}
/>
```

### Props
- `id` (number) - ID техники
- `name` (string) - Название
- `status` ("working" | "idle" | "maintenance" | "transit")
  - working: зеленый (работает)
  - idle: оранжевый (простой)
  - maintenance: серый (обслуживание)
  - transit: синий (в пути)
- `utilizationPercent` (number) - Процент загрузки (0-100)
- `location` (string) - Местоположение/объект
- `operator` (string) - ФИО оператора
- `hoursToday` (number) - Часов сегодня
- `hoursWeek` (number) - Часов на неделю
- `hoursMonth` (number) - Часов на месяц
- `revenueThisMonth` (number) - Выручка (в рублях)

### Отображение
```
Экскаватор CAT 320D  [Работает]     75%
─────────────────────────────────────
📍 Ул. Ленина, 42
👤 Иван Петров
⏱ Сегодня: 8ч | 📅 Неделя: 48ч | 📆 Месяц: 160ч
💰 Выручка месяца:              145к ₽
```

---

## 7️⃣ DecisionCard - Карточка рекомендации ИИ

**Для отображения рекомендаций ИИ-агентов**

### Использование
```tsx
<DecisionCard
  id={1}
  title="Нанять дополнительного оператора"
  description="Техника загружена на 95%, нужны ресурсы"
  priority="high"
  agent="Operations AI"
  impactRub={150000}
  cost={50000}
  risks={["Задержка проекта", "Доп. расходы"]}
  timeline="1 неделя"
  status="pending"
  onAccept={() => console.log("Accepted")}
  onReject={() => console.log("Rejected")}
/>
```

### Props
- `id` (number) - ID решения
- `title` (string) - Название рекомендации
- `description` (string) - Описание
- `priority` ("critical" | "high" | "medium" | "low")
  - critical: 🔴 красный
  - high: 🟠 оранжевый
  - medium: 🔵 синий
  - low: ⚪ серый
- `agent` ("Finance AI" | "Operations AI" | "Business AI")
- `impactRub?` (number) - Ожидаемый финансовый эффект
- `cost?` (number) - Примерная стоимость
- `effort?` ("low" | "medium" | "high") - Сложность
- `risks?` (string[]) - Список рисков
- `timeline?` (string) - Рекомендуемый срок ("1 неделя", "3 дня" и т.д.)
- `status` ("pending" | "accepted" | "rejected")
- `onAccept?` (() => void) - Callback при принятии
- `onReject?` (() => void) - Callback при отклонении

### Отображение
```
[🔴 HIGH]  [Finance AI]              ✓ Принято
────────────────────────────────────────────
Нанять дополнительного оператора
Техника загружена на 95%, нужны ресурсы
────────────────────────────────────────────
Ожидаемый эффект  │  Примерная стоимость
+150к ₽          │  50к ₽
────────────────────────────────────────────
Риски:
• Задержка проекта  • Доп. расходы

⏱ 1 неделя
────────────────────────────────────────────
[✓ Принять]  [Отклонить]
```

---

## 🎨 Интеграция в страницу

### Полный пример (Equipment страница)
```tsx
import { 
  KpiCard, 
  Toolbar, 
  ToolbarTabs, 
  ToolbarSelect,
  EquipmentCard,
  TimelineItem
} from "@/components/design-system";

export default function EquipmentPage() {
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("utilization");

  return (
    <div className="space-y-6">
      {/* KPI в начале */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard icon="🏗️" label="Всего" value="12" status="neutral" />
        <KpiCard icon="✅" label="Работает" value="8" status="success" />
        <KpiCard icon="📊" label="Загрузка" value="75%" status="neutral" />
        <KpiCard icon="💰" label="Выручка" value="245к ₽" status="success" />
        <KpiCard icon="⏱" label="Часов" value="480" status="neutral" />
      </div>

      {/* Фильтры */}
      <Toolbar>
        <ToolbarTabs
          value={status}
          onChange={setStatus}
          tabs={[
            { value: "all", label: "Все" },
            { value: "working", label: "Работает" },
            { value: "idle", label: "Простой" },
            { value: "maintenance", label: "ТО" },
          ]}
        />
        <ToolbarSelect
          value={sort}
          onChange={setSort}
          options={[
            { value: "utilization", label: "По загрузке" },
            { value: "revenue", label: "По выручке" },
          ]}
        />
      </Toolbar>

      {/* Список техники */}
      <div className="grid grid-cols-3 gap-4">
        {equipment.map(eq => (
          <EquipmentCard
            key={eq.id}
            {...eq}
          />
        ))}
      </div>

      {/* События */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">События</h2>
        {events.map(evt => (
          <TimelineItem
            key={evt.id}
            {...evt}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 📐 Шпаргалка по шагам

### 1. Импортируйте нужные компоненты
```tsx
import { KpiCard, StatusBadge } from "@/components/design-system";
```

### 2. Используйте в JSX
```tsx
<KpiCard icon="💰" label="Выручка" value="245к ₽" status="success" />
```

### 3. Передайте нужные пропсы
- Смотрите документацию для каждого компонента выше

### 4. Стили применяются автоматически
- Нет необходимости добавлять классы Tailwind
- Все стили встроены в компоненты

### 5. Кастомизируйте при необходимости
- Используйте `className?` пропс для дополнительных стилей
- Переопределяйте через CSS если нужно

---

## ⚠️ Частые ошибки

❌ **Неправильно:**
```tsx
<KpiCard 
  icon="💰" 
  label="Выручка" 
  value={245000}  // ❌ Число, а не строка
  status="good"   // ❌ Неправильный статус
/>
```

✅ **Правильно:**
```tsx
<KpiCard 
  icon="💰" 
  label="Выручка" 
  value="245к ₽"  // ✅ Строка
  status="success"  // ✅ Правильный статус
/>
```

---

## 🚀 Готово к использованию!

Все компоненты полностью функциональны и протестированы.

Если нужны какие-то особые изменения - создавайте новые компоненты или расширяйте существующие!
