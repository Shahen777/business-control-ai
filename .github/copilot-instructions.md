<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Business Control AI - Инструкции для Copilot

## О проекте
Это SaaS-платформа управления бизнесом на базе ИИ-агентов (Business Control AI).
Платформа предназначена для предпринимателей малого и среднего бизнеса.

## Технологический стек
- **Frontend**: Next.js 15 с App Router, React 19, TypeScript
- **Стилизация**: Tailwind CSS
- **Архитектура**: Модульная, API-first
- **Контейнеризация**: Docker

## Структура проекта
```
src/
├── app/                    # Next.js App Router страницы
│   ├── dashboard/          # Личный кабинет
│   │   ├── finance/        # Финансовый модуль
│   │   ├── operations/     # Операционный модуль
│   │   ├── decisions/      # Центр решений ИИ
│   │   └── assets/         # Управление активами
│   └── api/                # API endpoints
├── components/             # Переиспользуемые компоненты
├── lib/                    # Утилиты и хелперы
├── services/               # Сервисы для работы с API
├── agents/                 # ИИ-агенты (Business AI, Finance AI, Operations AI)
├── types/                  # TypeScript типы
└── hooks/                  # React хуки
```

## ИИ-агенты
1. **Business AI** - главный агент, агрегирует данные, формирует решения
2. **Finance AI** - анализ ДДС, прогнозы, контроль дебиторки/кредиторки
3. **Operations AI** - контроль загрузки техники, выявление простоев

## Правила кодирования
- Использовать TypeScript строго типизированно
- Компоненты должны быть функциональными с хуками
- Следовать принципам чистой архитектуры
- Писать комментарии на русском языке для бизнес-логики
- Использовать семантические имена переменных

## Целевая аудитория
- Строительные компании
- Подрядчики
- Владельцы спецтехники
- 5-50 сотрудников, 5-30 активов
