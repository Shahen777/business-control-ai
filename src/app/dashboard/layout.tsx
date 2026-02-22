"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AIChat } from "@/components/AIChat";

/* ────────────────────────────────────────────────────────────
   SVG-иконки (Heroicons outline, strokeWidth 1.5)
   ──────────────────────────────────────────────────────────── */
function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg className={`w-[18px] h-[18px] ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const paths = {
  grid: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  money: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  truck: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  folder: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  briefcase: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
  calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  clock: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  doc: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  sparkles: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z",
  chevron: "M19.5 8.25l-7.5 7.5-7.5-7.5",
  bars: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  close: "M6 18L18 6M6 6l12 12",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  left: "M15.75 19.5L8.25 12l7.5-7.5",
};

/* ────────────────────────────────────────────────────────────
   Меню
   ──────────────────────────────────────────────────────────── */
interface NavItem { name: string; href: string; icon: string }
interface NavSection { id: string; title: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    id: "manage",
    title: "Управление",
    items: [
      { name: "Обзор", href: "/dashboard", icon: "grid" },
      { name: "Финансы", href: "/dashboard/finance", icon: "money" },
      { name: "Активы", href: "/dashboard/assets/equipment", icon: "truck" },
      { name: "Проекты", href: "/dashboard/contractors/projects", icon: "folder" },
      { name: "Контрагенты", href: "/dashboard/contractors/list", icon: "briefcase" },
    ],
  },
  {
    id: "ops",
    title: "Операции",
    items: [
      { name: "Техника", href: "/dashboard/operations/equipment", icon: "truck" },
      { name: "Смены", href: "/dashboard/operations/shifts", icon: "calendar" },
      { name: "История", href: "/dashboard/operations/history", icon: "clock" },
      { name: "Задачи", href: "/dashboard/tasks", icon: "check" },
    ],
  },
  {
    id: "admin",
    title: "Администрирование",
    items: [
      { name: "Сотрудники", href: "/dashboard/employees", icon: "users" },
      { name: "Документы", href: "/dashboard/legal/contracts", icon: "doc" },
      { name: "Решения AI", href: "/dashboard/decisions", icon: "sparkles" },
      { name: "Настройки", href: "/dashboard/settings", icon: "cog" },
    ],
  },
];

const SW = 264; // ширина сайдбара

/* ────────────────────────────────────────────────────────────
   Layout
   ──────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [desk, setDesk] = useState(false);
  const [mini, setMini] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["manage", "ops"]));

  useEffect(() => {
    const fn = () => setDesk(window.innerWidth >= 1024);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => { if (desk) setOpen(false); }, [desk]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Открываем секцию с активным пунктом
  useEffect(() => {
    sections.forEach((s) => {
      if (s.items.some((i) => pathname === i.href || (i.href !== "/dashboard" && pathname.startsWith(i.href)))) {
        setExpanded((prev) => new Set(prev).add(s.id));
      }
    });
  }, [pathname]);

  const toggle = (id: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const pageName = () => {
    for (const s of sections) for (const i of s.items) if (isActive(i.href)) return i.name;
    return "Обзор";
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Мобильный оверлей */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col border-r border-white/[0.06] bg-zinc-900/95 backdrop-blur-xl transition-all duration-300
          ${open ? "tranzinc-x-0" : "-tranzinc-x-full"} lg:tranzinc-x-0`}
        style={{ width: mini ? 72 : SW }}
      >
        {/* Лого */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              B
            </div>
            {!mini && <span className="font-semibold text-white text-sm">Business Control</span>}
          </Link>
          <button className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800" onClick={() => setOpen(false)}>
            <Icon d={paths.close} />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((sec) => (
            <div key={sec.id}>
              {!mini && (
                <button
                  onClick={() => toggle(sec.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <span>{sec.title}</span>
                  <span className={`transition-transform duration-200 ${expanded.has(sec.id) ? "rotate-180" : ""}`}>
                    <Icon d={paths.chevron} className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}

              {(mini || expanded.has(sec.id)) && (
                <div className={`${mini ? "" : "mt-1"} space-y-0.5`}>
                  {sec.items.map((item) => {
                    const active = isActive(item.href);
                    const iconPath = paths[item.icon as keyof typeof paths];
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={mini ? item.name : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                          ${active
                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                          }
                          ${mini ? "justify-center px-0" : ""}
                        `}
                      >
                        <span className={`shrink-0 ${active ? "text-indigo-400" : "text-zinc-500"}`}>
                          <Icon d={iconPath} />
                        </span>
                        {!mini && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Профиль */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer ${mini ? "justify-center px-0" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              ИП
            </div>
            {!mini && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">ИП Иванов</p>
                <p className="text-xs text-zinc-500">Активен</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <div
        className="min-h-screen flex flex-col transition-[margin] duration-300"
        style={{ marginLeft: desk ? (mini ? 72 : SW) : 0 }}
      >
        {/* Хедер */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 -ml-1 rounded-md text-zinc-400 hover:bg-zinc-800" onClick={() => setOpen(true)}>
              <Icon d={paths.bars} />
            </button>
            <button
              onClick={() => setMini(!mini)}
              className="hidden lg:flex p-1.5 rounded-md text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              <span className={`transition-transform duration-200 ${mini ? "rotate-180" : ""}`}>
                <Icon d={paths.left} />
              </span>
            </button>
            <h1 className="text-sm font-semibold text-white">{pageName()}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-indigo-500/30 transition-colors">
              <Icon d={paths.search} className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Поиск..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-36 focus:w-52 transition-all"
              />
            </div>
            <button className="relative p-2 rounded-lg text-zinc-400 hover:bg-white/[0.04] transition-colors">
              <Icon d={paths.bell} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Контент страницы */}
        <main className="flex-1">{children}</main>

        {/* AI Chat */}
        <AIChat />
      </div>
    </div>
  );
}
