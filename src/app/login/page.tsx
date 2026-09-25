"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DEMO_ACCOUNTS, getRoleBadgeStyle } from "@/lib/auth/rbac";
import { UserRole } from "@/types/auth";
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Hotel
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { signInWithEmail, signInAsDemoRole, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await signInWithEmail(email, password);
    setSubmitting(false);

    if (res.success) {
      router.push(redirectPath);
    } else {
      setError(res.error || "Invalid credentials provided.");
    }
  };

  const handleDemoSelect = (role: UserRole) => {
    signInAsDemoRole(role);
    router.push(redirectPath);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
      {/* Left Column: Form Card */}
      <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Executive Gateway Sign In</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter your hospitality staff credentials or select a role profile to proceed.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Enterprise Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@mondayhotels.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Security Password</label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Contact your IT Administrator or Super Admin to reset credentials.");
                }}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to CRM Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Instant Demo Role Persona Switcher */}
      <div className="lg:col-span-6 space-y-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Instant Demo Role Switcher</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any enterprise role persona below to test authentication & RBAC route restrictions.
              </p>
            </div>
            <span className="text-[10px] uppercase font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              5 Roles Ready
            </span>
          </div>

          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const badge = getRoleBadgeStyle(acc.role);
              return (
                <div
                  key={acc.role}
                  onClick={() => handleDemoSelect(acc.role)}
                  className="bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/50 rounded-xl p-3.5 transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badge.badgeClass}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                        {acc.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{acc.description}</p>
                  </div>

                  <div className="p-2 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 rounded-lg transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-100 block">MONDAY HOTELS</span>
            <span className="text-[10px] text-amber-400/90 font-semibold tracking-wider uppercase">Enterprise CRM System</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SOC2 Type II Certified & RLS Protected</span>
        </div>
      </header>

      {/* Main Login Body wrapped in Suspense */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 max-w-6xl mx-auto w-full my-6">
        <Suspense fallback={<div className="text-slate-400 text-sm p-8">Loading Auth Portal...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10 border-t border-slate-900">
        © 2026 Monday Hotels Enterprise CRM • Powered by Supabase Auth & Role-Based Access Control
      </footer>
    </div>
  );
}
