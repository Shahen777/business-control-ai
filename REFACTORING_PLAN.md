# 🎨 План комплексного рефакторинга UI Business Control AI

## ФАЗА 1: Дизайн-система (базис для всех остальных изменений)

### 1.1 Создать компоненты-примитивы
**Файлы для создания:**
- `/src/components/design-system/KpiCard.tsx` — карточка метрики (иконка, лейбл, значение, статус)
- `/src/components/design-system/StatusBadge.tsx` — бейджи для статусов (success/danger/warning/info)
- `/src/components/design-system/StyledCard.tsx` — универсальная карточка (12px radius, border, padding)
- `/src/components/design-system/Toolbar.tsx` — фильтры + сортировка + поиск в одном контейнере
- `/src/components/design-system/TimelineItem.tsx` — элемент временной линии с иконкой + время + текст

**Файлы для обновления:**
- `/src/components/Button.tsx` — унифицировать: Primary (blue, solid), Secondary (slate, border), Ghost (transparent)
- `/src/components/Badge.tsx` — пересделать для единого стиля
- `/src/app/globals.css` — обновить CSS переменные и scale типографики

### 1.2 CSS/Tailwind обновления
**globals.css:**
- Шрифт: Inter (уже в проекте), настроить шкалу
- Spacing: 4, 8, 12, 16, 20, 24, 32 (base 4px)
- Border-radius: card 12px, button 10px, pill 999px
- Colors: единая палитра slate + 1 синий акцент
- Убрать тяжелые тени, оставить border + 1 мягкая тень
- Tabular-nums для денежных значений

---

## ФАЗА 2: Глобальные улучшения

### 2.1 Layout + Navigation
**Файлы:**
- `/src/app/dashboard/layout.tsx` — обновить:
  - Сетка: max-w-[1280px], центрирование, одинаковые паддинги
  - Меню: сгруппировать пункты (Управление / Операции / Админ)
  - Активный пункт: фон + тонкая полоска слева
  - Иконки: унифицировать размеры/стиль
  
- `/src/app/dashboard/page.tsx` (главный дашборд) — уже рефакторен, проверить консистентность

### 2.2 Header + Search
**Файлы:**
- `/src/app/dashboard/layout.tsx` (header) — обновить:
  - Search: реальный input (не кнопка) с placeholder
  - Иконка 🔍 слева
  - Нормальные отступы
  - Focus state с border-color синий

---

## ФАЗА 3: Страница "Техника" (Operations → Equipment)

**Файл:** `/src/app/dashboard/operations/equipment/page.tsx`

### 3.1 KPI сверху
- 5 карточек через KpiCard компонент
- Одинаковая высота/ширина
- Иконка + лейбл (12px) + значение (28px bold) + тренд/пояснение (13px)

### 3.2 Блок простоя
- Отдельная card с warning/danger стилем
- Заголовок, описание, CTA "Разобраться →"

### 3.3 Toolbar (фильтры + сортировка)
- Tabs [Все / Работает / Простой / ТО]
- Select "Сортировка по..."
- Toggle "Порядок"
- Все в одной строке, аккуратно

### 3.4 Карточки техники
Переделать структуру:
```
┌─────────────────────────────────┐
│ Название      [Status Badge] 75% │ ← Header
│ ─────── Progress Bar ─────────── │
│ Объект: Ул. Ленина, 42           │ ← Meta
│ Оператор: Иван Петров           │
│ ⏱ Сегодня: 8ч | Неделя: 48ч | Месяц: 160ч │ ← Metrics (одна строка)
│ 💰 Выручка: 145,000 ₽ (пояснение тренд)    │
└─────────────────────────────────┘
```

### 3.5 Timeline событий
- Вместо лога: элементы с иконкой, временем, заголовком, вторичной строкой
- TimelineItem компонент

---

## ФАЗА 4: Страница "Решения AI" (Decisions)

**Файл:** `/src/app/dashboard/decisions/page.tsx`

### 4.1 KPI-карточки сверху
- Ожидают / Принято / Эффект / Критичных
- KpiCard компонент

### 4.2 Рекомендации (карточки)
Каждая рекомендация:
```
┌──────────────────────────────────────────────┐
│ [Severity Badge] [Agent Tag] [Status]        │ ← Top row
│ Заголовок рекомендации                       │ ← Bold title
│ Описание в 1-2 строки                        │
│ ────────────────────────────────────────────│
│ ✅ Ожидаемый эффект: +850,000 ₽  [Info box] │
│ 💰 Финансовое влияние: +450,000 ₽           │
│ ────────────────────────────────────────────│
│ Риски: • Задержка на неделю                 │
│        • Нужен апрув от финдира             │
│ ────────────────────────────────────────────│
│ ⏱ Рекомендуемый срок: 3 дня                │
│ 💵 Примерная стоимость: 15,000 ₽          │
│ ────────────────────────────────────────────│
│ [✓ Принять] [Ghost Отклонить] [Альтернативы ⋮]
└──────────────────────────────────────────────┘
```

### 4.3 Состояния
- Пусто (иконка + текст)
- Загрузка (skeleton cards)
- Данные (карточки как выше)

---

## ФАЗА 5: Control AI чат

**Файл:** `/src/components/AIChat.tsx`

- Приложить к общему стилю (радиусы, кнопки, шрифт)
- По умолчанию свернут (плавающая кнопка)
- При открытии: аккуратная панель
- Быстрые вопросы: pills в 2 ряда
- Сообщения: компактно, аккуратно

---

## РЕАЛИЗАЦИЯ (пошаговый список файлов/задач)

### ✅ ШАГ 1: Обновить глобальные стили + примитивы
- [ ] Обновить `/src/app/globals.css` (переменные, шкала, тени)
- [ ] Обновить `/src/components/Button.tsx` (Primary/Secondary/Ghost)
- [ ] Создать `/src/components/design-system/KpiCard.tsx`
- [ ] Создать `/src/components/design-system/StatusBadge.tsx`
- [ ] Создать `/src/components/design-system/StyledCard.tsx`
- [ ] Обновить `/src/components/Badge.tsx`

### ✅ ШАГ 2: Layout + Navigation
- [ ] Обновить `/src/app/dashboard/layout.tsx` (grid, menu grouping, header search)

### ✅ ШАГ 3: Equipment page
- [ ] Переделать `/src/app/dashboard/operations/equipment/page.tsx`
- [ ] Создать компоненты: KpiCard, EquipmentCard, Toolbar, TimelineItem

### ✅ ШАГ 4: Decisions page
- [ ] Переделать `/src/app/dashboard/decisions/page.tsx`
- [ ] Создать компоненты: DecisionCard, DecisionMetrics

### ✅ ШАГ 5: Control AI
- [ ] Обновить `/src/components/AIChat.tsx`

### ✅ ШАГ 6: Остальные страницы (если требуется)
- [ ] Проверить и унифицировать остальные разделы

---

## ДИЗАЙН-СИСТЕМА (справка)

### Типографика
- **Page Title**: 26–28px / font-bold / tracking-tight
- **Section Title**: 16–18px / font-semibold
- **Body**: 14–15px / font-normal
- **Caption**: 12–13px / font-normal / text-slate-500
- **Label (Meta)**: 12px / font-medium / uppercase / tracking-wide

### Отступы (base 4px)
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px

### Радиусы
- Card: 12px (rounded-xl)
- Button: 10px (custom)
- Pill/Badge: 999px (rounded-full)

### Цвета
- **Основной акцент**: blue-600 (#2563eb)
- **Success**: emerald-500 (#10b981)
- **Warning**: amber-500 (#f59e0b)
- **Danger**: red-500 (#ef4444)
- **Info**: blue-400 (#60a5fa)
- **Neutral**: slate-500 (#64748b)

### Тени
- Light: inset 0 1px 0 0 rgba(255,255,255,0.05)
- Card: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)
- Избегать тяжелых теней, предпочитать border

### Компоненты

#### Button
```tsx
<Button variant="primary">Сохранить</Button>      // blue solid
<Button variant="secondary">Отмена</Button>       // slate border
<Button variant="ghost">Больше</Button>           // transparent
```

#### Badge
```tsx
<StatusBadge status="success">Работает</StatusBadge>
<StatusBadge status="danger">Простой</StatusBadge>
<StatusBadge status="warning">ТО</StatusBadge>
```

#### KPI Card
```tsx
<KpiCard
  icon={<IconTruck />}
  label="Задействовано техники"
  value={42}
  secondary="↑ 2 от вчера"
/>
```

---

## ПРИОРИТЕТ ИЗМЕНЕНИЙ

1. **HIGH**: globals.css + примитивы (основа всего)
2. **HIGH**: Layout + Navigation (видно везде)
3. **HIGH**: Equipment page (основная рабочая область)
4. **HIGH**: Decisions page (часто используется)
5. **MEDIUM**: AIChat (видно, но менее критично)
6. **LOW**: Остальные страницы (по времени)

---

## ТЕХНИЧЕСКИЕ РЕКОМЕНДАЦИИ

1. **Компоненты в `/src/components/design-system/`** — все переиспользуемые элементы
2. **Коротко комментировать** — что и зачем, без лишних слов
3. **Не менять бизнес-логику** — только верстка/стили
4. **Тестировать на разных разрешениях** — особенно tablet/mobile
5. **Консистентность** — убедиться, что все элементы выглядят одинаково

---

## КРИТЕРИИ ГОТОВНОСТИ

✅ Все 9 требований пункта 1-5 реализованы
✅ Нет компилирующих ошибок
✅ Интерфейс выглядит премиально (как Stripe/Linear)
✅ Типографика четкая и иерархичная
✅ Единая система компонентов везде
✅ Пробелы между элементами логичные
✅ Кнопки унифицированы
✅ Цвета и тени консистентны

