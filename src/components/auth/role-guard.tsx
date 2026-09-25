"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getRoleBadgeStyle, DEMO_ACCOUNTS } from "@/lib/auth/rbac";
import { ShieldAlert, Lock, ArrowLeft, RefreshCw, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading, canAccess, signInAsDemoRole } = useAuth();

  // Public paths exempt from auth enforcement
  const publicPaths = ["/login", "/auth/login", "/_next", "/favicon.ico"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 shadow-xl">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Verifying Enterprise Credentials & Role Permissions...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated -> Redirect to Login
  if (!isAuthenticated || !user) {
    if (typeof window !== "undefined") {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    return null;
  }

  // Check authorization for current pathname
  const isAuthorized = canAccess(pathname);

  if (!isAuthorized) {
    const roleBadge = getRoleBadgeStyle(role || "VIEWER");

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="max-w-xl w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
          {/* Header Icon */}
          <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>403 Access Denied • Authorization Required</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Restricted Route Violation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Your active security role <strong className="text-slate-200">({user.fullName})</strong> does not have authorization to view the module at <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono text-xs">{pathname}</code>.
            </p>
          </div>

          {/* User Role Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Current User Account</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">{user.fullName} ({user.email})</div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${roleBadge.badgeClass}`}>
              {roleBadge.label}
            </span>
          </div>

          {/* Quick Persona Switcher for Evaluation / Testing */}
          <div className="border-t border-slate-800/80 pt-4 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Switch Role for Development Inspection:
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => {
                    signInAsDemoRole(acc.role);
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                    acc.role === user.role
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  <div className="truncate font-semibold">{acc.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{acc.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-500/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Executive Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fully Authorized -> Render Children Page
  return <>{children}</>;
}
