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
import { GlobalSearchModal } from "./global-search-modal";

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileOpen: boolean;
}

export function TopHeader({ onToggleMobileSidebar, isMobileOpen }: TopHeaderProps) {
  const router = useRouter();
  const { user, role, signOut, signInAsDemoRole } = useAuth();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <header className="sticky top-0 z-30 h-16 bg-[#FFFEFA]/95 backdrop-blur-md border-b border-[#E5E2D9] px-4 lg:px-6 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile Toggle & Property Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] text-[#1E293B] hover:bg-[#DDE9E1] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5 text-[#285943]" /> : <Menu className="w-5 h-5 text-[#285943]" />}
        </button>

        <PropertySelector />
      </div>

      {/* Middle: Global Search Input Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="relative w-full text-left pl-9 pr-4 py-1.5 bg-[#F7F4EC] border border-[#E5E2D9] hover:border-[#285943]/40 rounded-lg text-xs text-[#6B766F] focus:outline-none transition-all flex items-center justify-between group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#285943] transition-colors" />
          <span className="truncate">Search leads, corporate, guests, reservations...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-[#E5E2D9] bg-white px-1.5 font-mono text-[10px] font-medium text-[#6B766F]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action, Notifications & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action */}
        <button
          type="button"
          onClick={() => router.push("/leads")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#285943] hover:bg-[#1E4D3B] text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>New Lead</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] text-[#1E293B] hover:bg-[#DDE9E1] transition-colors"
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4 text-[#285943]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A15B] text-[10px] font-bold text-[#1E293B]">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 z-40 bg-white border border-[#E5E2D9] rounded-xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9]">
                  <span className="text-xs font-semibold text-[#1E293B]">System Notifications</span>
                  <span className="text-[10px] text-[#285943] hover:underline cursor-pointer font-semibold">Mark all read</span>
                </div>
                <div className="divide-y divide-[#E5E2D9] text-xs py-1">
                  <div className="py-2.5">
                    <p className="text-[#1E293B] font-medium">VIP Reservation Confirmed</p>
                    <p className="text-[11px] text-[#6B766F]">Monday Grand Luxe • Suite 804</p>
                    <span className="text-[10px] text-[#6B766F]">2 mins ago</span>
                  </div>
                  <div className="py-2.5">
                    <p className="text-[#1E293B] font-medium">New Corporate Lead ($45k)</p>
                    <p className="text-[11px] text-[#6B766F]">Deloitte Annual Leadership Summit</p>
                    <span className="text-[10px] text-[#6B766F]">18 mins ago</span>
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
            className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] hover:bg-[#DDE9E1] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#285943] text-white font-bold text-xs flex items-center justify-center shadow-inner shrink-0">
              {user ? getInitials(user.fullName) : "EX"}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-[#1E293B] leading-tight">
                {user ? user.fullName : "Guest User"}
              </div>
              <div className="text-[10px] text-[#C9A15B] font-semibold leading-none flex items-center gap-1 mt-0.5">
                <span>{roleBadge.label}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B766F] hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-64 z-40 bg-white border border-[#E5E2D9] rounded-xl shadow-xl p-2 text-xs divide-y divide-[#E5E2D9] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 space-y-1">
                  <div className="font-semibold text-[#1E293B]">{user?.fullName}</div>
                  <div className="text-[#6B766F] text-[11px] truncate">{user?.email}</div>
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-bold ${roleBadge.badgeClass}`}>
                      <Shield className="w-3 h-3" /> {roleBadge.label}
                    </span>
                  </div>
                </div>

                {/* Switch Role Quick Test Options */}
                <div className="py-2 px-3 space-y-1.5">
                  <div className="text-[10px] font-bold text-[#6B766F] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C9A15B]" /> Switch Active Role Profile:
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
                            ? "bg-[#DDE9E1] text-[#1E4D3B] font-bold"
                            : "text-[#1E293B] hover:bg-[#F7F4EC]"
                        }`}
                      >
                        <span className="truncate">{acc.role}</span>
                        <span className="text-[9px] text-[#6B766F]">{acc.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-[#C95C5C] hover:bg-rose-50 rounded flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out of Enterprise CRM
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Command Palette Search Modal (Cmd+K / Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
}
