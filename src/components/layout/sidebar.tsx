"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "./navigation-config";
import { Sparkles, HelpCircle } from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 flex items-center border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                MONDAY HOTELS
              </div>
              <div className="text-[10px] font-semibold text-amber-500/90 tracking-widest uppercase mt-0.5">
                ENTERPRISE CRM
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationConfig.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400/80 uppercase tracking-wider">
                {group.groupTitle}
              </div>
              <ul className="space-y-0.5 mt-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                          isActive
                            ? "bg-amber-500/15 text-amber-300 font-semibold shadow-inner border-l-2 border-amber-400"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                            }`}
                          />
                          <span className="truncate">{item.title}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                              isActive
                                ? "bg-amber-400 text-slate-950"
                                : typeof item.badge === "number"
                                ? "bg-slate-800 text-slate-300"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">v2.4.0 • Enterprise</span>
            </div>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Documentation & Support"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
