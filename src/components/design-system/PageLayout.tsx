import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageLayout — единый каркас страницы с центровкой и max-width
 */
export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`w-full px-4 sm:px-6 py-8 ${className}`}>
      <div className="mx-auto w-full max-w-[1280px] space-y-8">
        {children}
      </div>
    </div>
  );
}
