"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import { AuthProvider } from "@/context/auth-context";
import { RoleGuard } from "@/components/auth/role-guard";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname.startsWith("/login");

  return (
    <AuthProvider>
      <RoleGuard>
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <div className="min-h-screen bg-[#F7F4EC] text-[#1E293B] flex flex-col font-sans selection:bg-[#C9A15B]/30 selection:text-[#1E293B]">
            {/* Sidebar Navigation */}
            <Sidebar
              isMobileOpen={isMobileOpen}
              onCloseMobile={() => setIsMobileOpen(false)}
            />

            {/* Main Container Area */}
            <div className="lg:pl-64 flex flex-col flex-1 min-h-screen transition-all">
              {/* Top Navbar */}
              <TopHeader
                isMobileOpen={isMobileOpen}
                onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
              />

              {/* Main Content Area */}
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
                {children}
              </main>
            </div>
          </div>
        )}
      </RoleGuard>
    </AuthProvider>
  );
}
