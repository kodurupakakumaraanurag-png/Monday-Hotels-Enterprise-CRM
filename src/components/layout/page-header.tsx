import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E2D9] pb-5">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-[#6B766F] mb-1.5" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hover:text-[#285943] transition-colors font-medium">
              Monday CRM
            </Link>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-[#6B766F]" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-[#1E293B] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#1E293B] font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs sm:text-sm text-[#6B766F] mt-0.5">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
