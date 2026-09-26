"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "./navigation-config";
import { Sparkles, HelpCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { canAccess, role } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#18332B]/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFEFA] border-r border-[#E5E2D9] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 flex items-center border-b border-[#E5E2D9]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#285943] text-white font-black text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="text-sm font-bold text-[#18332B] tracking-tight leading-none group-hover:text-[#285943] transition-colors">
                MONDAY HOTELS
              </div>
              <div className="text-[10px] font-semibold text-[#C9A15B] tracking-widest uppercase mt-0.5">
                ENTERPRISE CRM
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationConfig.map((group, groupIdx) => {
            // Filter items user role has permission to access
            const permittedItems = group.items.filter((item) => canAccess(item.href));

            if (permittedItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-[#6B766F] uppercase tracking-wider">
                  {group.groupTitle}
                </div>
                <ul className="space-y-0.5 mt-1.5">
                  {permittedItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                            isActive
                              ? "bg-[#285943] text-white font-semibold shadow-sm"
                              : "text-[#18332B] hover:text-[#173F32] hover:bg-[#DDE9E1]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-colors ${
                                isActive ? "text-white" : "text-[#285943] group-hover:text-[#173F32]"
                              }`}
                            />
                            <span className="truncate">{item.title}</span>
                          </div>

                          {item.badge !== undefined && (
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                                isActive
                                  ? "bg-[#C9A15B] text-[#18332B]"
                                  : typeof item.badge === "number"
                                  ? "bg-[#DDE9E1] text-[#173F32]"
                                  : "bg-[#E9D7AE] text-[#18332B] border border-[#C9A15B]/30"
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
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E5E2D9] bg-[#F7F4EC]">
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E2D9] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#6B766F]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A15B]" />
              <span className="text-[11px]">Role: <strong className="text-[#18332B]">{role}</strong></span>
            </div>
            <button
              type="button"
              className="text-[#6B766F] hover:text-[#18332B] transition-colors p-1"
              title="RBAC Active Security Enforcement"
            >
              <Lock className="w-3.5 h-3.5 text-[#285943]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
