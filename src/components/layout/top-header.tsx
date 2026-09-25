"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  X,
  Plus,
  User,
  LogOut,
  Shield,
  Sparkles,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { PropertySelector } from "./property-selector";
import { useAuth } from "@/context/auth-context";
import { getRoleBadgeStyle, DEMO_ACCOUNTS } from "@/lib/auth/rbac";
import { UserRole } from "@/types/auth";

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileOpen: boolean;
}

export function TopHeader({ onToggleMobileSidebar, isMobileOpen }: TopHeaderProps) {
  const router = useRouter();
  const { user, role, signOut, signInAsDemoRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleBadge = getRoleBadgeStyle(role || "VIEWER");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile Toggle & Property Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <PropertySelector />
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guests, corporate accounts, reservations, leads..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/40 transition-all"
          />
          <kbd className="hidden lg:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action, Notifications & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action */}
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 z-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                  <span className="text-[10px] text-amber-400 hover:underline cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-800/60 text-xs py-1">
                  <div className="py-2.5">
                    <p className="text-slate-200 font-medium">VIP Reservation Confirmed</p>
                    <p className="text-[11px] text-slate-400">Monday Grand Luxe • Suite 804</p>
                    <span className="text-[10px] text-slate-500">2 mins ago</span>
                  </div>
                  <div className="py-2.5">
                    <p className="text-slate-200 font-medium">New Corporate Lead ($45k)</p>
                    <p className="text-[11px] text-slate-400">Deloitte Annual Leadership Summit</p>
                    <span className="text-[10px] text-slate-500">18 mins ago</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center shadow-inner shrink-0">
              {user ? getInitials(user.fullName) : "EX"}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {user ? user.fullName : "Guest User"}
              </div>
              <div className="text-[10px] text-amber-400/90 font-semibold leading-none flex items-center gap-1 mt-0.5">
                <span>{roleBadge.label}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-64 z-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 text-xs divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 space-y-1">
                  <div className="font-semibold text-slate-100">{user?.fullName}</div>
                  <div className="text-slate-400 text-[11px] truncate">{user?.email}</div>
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-bold ${roleBadge.badgeClass}`}>
                      <Shield className="w-3 h-3" /> {roleBadge.label}
                    </span>
                  </div>
                </div>

                {/* Switch Role Quick Test Options */}
                <div className="py-2 px-3 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Switch Active Role Profile:
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.role}
                        onClick={() => {
                          signInAsDemoRole(acc.role);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                          role === acc.role
                            ? "bg-amber-500/20 text-amber-300 font-bold"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{acc.role}</span>
                        <span className="text-[9px] text-slate-500">{acc.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out of Enterprise CRM
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
