"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole, UserProfile, DemoAccount } from "@/types/auth";
import { DEMO_ACCOUNTS, canAccessRoute } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInAsDemoRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  canAccess: (pathname: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "monday_crm_user_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  // Load existing session on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // First check localStorage demo session
        const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedSession) {
          const parsedUser: UserProfile = JSON.parse(storedSession);
          setUser(parsedUser);
          setIsLoading(false);
          return;
        }

        // Check Supabase session if configured
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Fetch or construct profile
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || "user@mondayhotels.com",
            fullName: session.user.user_metadata?.full_name || "Enterprise User",
            role: (session.user.user_metadata?.role as UserRole) || "ADMIN",
            isActive: true,
          };
          setUser(userProfile);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
        } else {
          // Default initial fallback: Admin persona for seamless inspection
          const defaultAdmin = DEMO_ACCOUNTS.find((a) => a.role === "ADMIN");
          if (defaultAdmin) {
            const adminProfile: UserProfile = {
              id: "demo-admin-id",
              email: defaultAdmin.email,
              fullName: defaultAdmin.name,
              role: "ADMIN",
              propertyName: "Portfolio Global",
              isActive: true,
            };
            setUser(adminProfile);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminProfile));
          }
        }
      } catch (err) {
        console.warn("Auth initialization warning:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Supabase + Demo Email Sign In
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Check if email matches one of our demo personas
      const matchedDemo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (matchedDemo) {
        const demoProfile: UserProfile = {
          id: `demo-${matchedDemo.role.toLowerCase()}-id`,
          email: matchedDemo.email,
          fullName: matchedDemo.name,
          role: matchedDemo.role,
          propertyName: matchedDemo.role === "OPERATIONS_MANAGER" ? "Monday Beach Resort, Goa" : "Portfolio Global",
          isActive: true,
        };
        setUser(demoProfile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoProfile));
        setIsLoading(false);
        return { success: true };
      }

      // Try Supabase auth if non-demo credentials are provided
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || "Enterprise Executive",
          role: (data.user.user_metadata?.role as UserRole) || "ADMIN",
          isActive: true,
        };
        setUser(userProfile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: "Authentication failed. User not found." };
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message || "An unexpected error occurred during login." };
    }
  };

  // Instant 1-click Demo Role Switcher
  const signInAsDemoRole = (role: UserRole) => {
    const matched = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!matched) return;

    const demoProfile: UserProfile = {
      id: `demo-${role.toLowerCase()}-id`,
      email: matched.email,
      fullName: matched.name,
      role: matched.role,
      propertyName: role === "OPERATIONS_MANAGER" ? "Monday Beach Resort, Goa" : "Portfolio Global",
      isActive: true,
    };

    setUser(demoProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoProfile));
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore network signout errors
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
    }
  };

  // Authorization helper
  const canAccess = (pathname: string): boolean => {
    return canAccessRoute(user?.role, pathname);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        signInWithEmail,
        signInAsDemoRole,
        signOut,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
