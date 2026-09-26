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
      <div className="lg:col-span-6 bg-white border border-[#E5E2D9] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Executive Gateway Sign In</h1>
          <p className="text-xs sm:text-sm text-[#6B766F] mt-1">
            Enter your hospitality staff credentials or select a role profile to proceed.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-[#C95C5C]">
            <AlertCircle className="w-4 h-4 text-[#C95C5C] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1E293B]">Enterprise Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@mondayhotels.com"
                className="w-full bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl px-3.5 py-2.5 pl-10 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#285943] transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-[#6B766F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#1E293B]">Security Password</label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Contact your IT Administrator or Super Admin to reset credentials.");
                }}
                className="text-[11px] text-[#285943] hover:underline font-semibold"
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
                className="w-full bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#285943] transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-[#6B766F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B766F] hover:text-[#1E293B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full bg-[#285943] hover:bg-[#1E4D3B] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="bg-white border border-[#E5E2D9] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A15B]" />
                <span>Instant Demo Role Switcher</span>
              </h2>
              <p className="text-xs text-[#6B766F] mt-0.5">
                Click any enterprise role persona below to test authentication & RBAC route restrictions.
              </p>
            </div>
            <span className="text-[10px] uppercase font-extrabold bg-[#DDE9E1] text-[#1E4D3B] border border-[#A8C3B2] px-2 py-0.5 rounded-full">
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
                  className="bg-[#F7F4EC] border border-[#E5E2D9] hover:border-[#285943]/60 rounded-xl p-3.5 transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badge.badgeClass}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-[#1E293B] group-hover:text-[#285943] transition-colors">
                        {acc.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B766F]">{acc.description}</p>
                  </div>

                  <div className="p-2 bg-white border border-[#E5E2D9] group-hover:bg-[#285943] group-hover:text-white text-[#285943] rounded-lg transition-colors shrink-0">
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
    <div className="min-h-screen bg-[#F7F4EC] text-[#1E293B] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Brand Bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#285943] flex items-center justify-center text-white shadow-md font-bold">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#1E293B] block">MONDAY HOTELS</span>
            <span className="text-[10px] text-[#C9A15B] font-semibold tracking-wider uppercase">Enterprise CRM System</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B766F] bg-white border border-[#E5E2D9] rounded-lg px-3 py-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
          <span>SOC2 Type II Certified & RLS Protected</span>
        </div>
      </header>

      {/* Main Login Body wrapped in Suspense */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 max-w-6xl mx-auto w-full my-6">
        <Suspense fallback={<div className="text-[#6B766F] text-sm p-8">Loading Auth Portal...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[#6B766F] z-10 border-t border-[#E5E2D9] bg-white">
        © 2026 Monday Hotels Enterprise CRM • Powered by Supabase Auth & Role-Based Access Control
      </footer>
    </div>
  );
}
