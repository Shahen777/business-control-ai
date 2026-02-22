"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-white/[0.06]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
            <span>Control</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Возможности
            </Link>
            <Link href="#pricing" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Тарифы
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Войти
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 border-b border-white/[0.06]">
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block py-2 text-zinc-400" onClick={() => setMobileMenuOpen(false)}>
                Возможности
              </Link>
              <Link href="#pricing" className="block py-2 text-zinc-400" onClick={() => setMobileMenuOpen(false)}>
                Тарифы
              </Link>
              <Link
                href="/dashboard"
                className="block w-full text-center px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Войти
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-600/20 to-transparent rounded-full blur-3xl opacity-30" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Powered by AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Операционная система
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                вашего бизнеса
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              ИИ-агенты анализируют данные, прогнозируют риски и предлагают решения. Управляйте компанией из одного
              интерфейса.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-base transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-tranzinc-y-0.5"
              >
                Начать бесплатно
              </Link>
              <Link href="#features" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                Узнать больше
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "-40%", label: "Сокращение ФОТ", icon: "📉" },
                { value: "24/7", label: "Контроль бизнеса", icon: "🔄" },
                { value: "5 мин", label: "До первого отчёта", icon: "⚡" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/[0.06] p-6 sm:p-8 text-center group hover:border-white/[0.1] transition-all"
                >
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">ИИ-агенты работают за вас</h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">Каждый агент отвечает за свою область бизнеса</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: "🧠",
                  title: "Business AI",
                  desc: "Главный агент: анализирует данные, выявляет проблемы, формирует управленческие решения",
                  color: "from-indigo-500/15 to-purple-500/10",
                  border: "border-indigo-500/20",
                },
                {
                  icon: "💰",
                  title: "Finance AI",
                  desc: "Анализ ДДС, прогноз кассовых разрывов, контроль дебиторской и кредиторской задолженности",
                  color: "from-emerald-500/15 to-green-500/10",
                  border: "border-emerald-500/20",
                },
                {
                  icon: "⚙️",
                  title: "Operations AI",
                  desc: "Контроль загрузки техники, выявление простоев, оптимизация распределения ресурсов",
                  color: "from-orange-500/15 to-amber-500/10",
                  border: "border-orange-500/20",
                },
                {
                  icon: "📊",
                  title: "Центр решений",
                  desc: "Сводка управленческих выводов, приоритезация задач и контроль их исполнения",
                  color: "from-rose-500/15 to-pink-500/10",
                  border: "border-rose-500/20",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} p-7 sm:p-9 hover:scale-[1.01] transition-transform duration-300`}
                >
                  <div className="w-14 h-14 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-5 text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Выберите тариф</h2>
              <p className="text-zinc-400 text-lg">Начните бесплатно, масштабируйтесь по мере роста</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Старт */}
              <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.06] p-7 flex flex-col hover:border-white/[0.1] transition-all">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Старт</div>
                <div className="text-3xl font-bold text-white mb-1">Бесплатно</div>
                <div className="text-sm text-zinc-500 mb-7">Для знакомства</div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Базовая аналитика", "1 ИИ-агент", "Email-поддержка"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="text-emerald-400 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors">
                  Начать
                </button>
              </div>

              {/* Бизнес */}
              <div className="rounded-2xl bg-zinc-900/50 border border-indigo-500/30 p-7 flex flex-col relative hover:border-indigo-500/50 transition-all">
                <div className="absolute -top-3 left-1/2 -tranzinc-x-1/2 bg-indigo-600 px-3 py-1 rounded-full text-xs font-medium text-white">
                  ПОПУЛЯРНЫЙ
                </div>
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Бизнес</div>
                <div className="text-3xl font-bold text-white mb-1">9 900 ₽</div>
                <div className="text-sm text-zinc-500 mb-7">в месяц</div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Все ИИ-агенты", "Полная аналитика", "Приоритетная поддержка"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="text-emerald-400 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                  Попробовать 14 дней
                </button>
              </div>

              {/* Корпоративный */}
              <div className="rounded-2xl bg-zinc-900/50 border border-white/[0.06] p-7 flex flex-col hover:border-white/[0.1] transition-all">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Корпоративный</div>
                <div className="text-3xl font-bold text-white mb-1">По запросу</div>
                <div className="text-sm text-zinc-500 mb-7">Индивидуально</div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Интеграции", "API доступ", "Персональный менеджер"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                      <span className="text-emerald-400 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors">
                  Связаться
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-zinc-600 text-sm">© 2025 Business Control AI</div>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                Условия
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
