// ── Auth context ──────────────────────────────────────────────────
// Full auth state: sign up, log in, log out, current user.
//
// Today this is backed by localStorage — a "users" collection stores
// accounts created through the sign-up form, and the current session
// is held in a "session" key. No real network calls.
//
// When you connect Supabase Auth, replace the internals:
//   • signUp  → supabase.auth.signUp()
//   • login   → supabase.auth.signInWithPassword()
//   • logout  → supabase.auth.signOut()
//   • Add onAuthStateChange in the useEffect to hydrate `user`
//   • Store extended profile (name, role, avatarInitials) in a
//     `profiles` table and query it on login / session restore.
//
// Everything that *consumes* useAuth() elsewhere stays the same.

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthUser } from "../data/types";

// ── Public types ──────────────────────────────────────────────────

export type Role = "donor" | "recipient" | "admin" | null;

export interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: Role;                // convenience — derived from user.role
  isLoading: boolean;        // true while restoring session on mount
  signUp: (email: string, password: string, name: string, role: "donor" | "recipient" | "admin") => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  /** @deprecated — kept for backward compat with old role-picker */
  setRole: (role: Role) => void;
}

// ── Helpers (localStorage mock) ───────────────────────────────────

const USERS_KEY = "foosha:auth_users";
const SESSION_KEY = "foosha:auth_session";

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string; // just the raw password for mock — never do this in prod!
  name: string;
  role: "donor" | "recipient" | "admin";
  avatarInitials: string;
  createdAt: string;
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(stored: StoredUser): AuthUser {
  return {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    role: stored.role,
    avatarInitials: stored.avatarInitials,
    createdAt: stored.createdAt,
  };
}

function makeInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Context ───────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (sessionJson) {
      try {
        const stored = JSON.parse(sessionJson) as AuthUser;
        setUser(stored);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist session whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const signUp = useCallback(
    async (email: string, password: string, name: string, role: "donor" | "recipient" | "admin"): Promise<AuthResult> => {
      // Simulate a tiny network delay
      await new Promise((r) => setTimeout(r, 400));

      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
      }

      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase().trim(),
        passwordHash: password, // mock — Supabase handles real hashing
        name: name.trim(),
        role,
        avatarInitials: makeInitials(name),
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);
      setUser(toAuthUser(newUser));
      return { success: true, message: "Account created!" };
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      await new Promise((r) => setTimeout(r, 400));

      const users = getUsers();
      const match = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === password,
      );

      if (!match) {
        return { success: false, message: "Invalid email or password." };
      }

      setUser(toAuthUser(match));
      return { success: true, message: "Welcome back!" };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    // Also clear the legacy role key used by the old mock
    localStorage.removeItem("foosha:role");
  }, []);

  // Backward-compat: the old role-picker called setRole directly.
  // This creates a minimal fake user so existing code doesn't break.
  const setRole = useCallback((newRole: Role) => {
    if (!newRole) {
      logout();
      return;
    }
    const fakeUser: AuthUser = {
      id: `legacy-${newRole}`,
      email: `${newRole}@foosha.local`,
      name: newRole === "donor" ? "Basak Sari-Sari Store"
        : newRole === "recipient" ? "P. Ramos household"
        : "City Admin",
      role: newRole,
      avatarInitials: newRole === "donor" ? "BS" : newRole === "recipient" ? "PR" : "CA",
      createdAt: new Date().toISOString(),
    };
    setUser(fakeUser);
  }, [logout]);

  const role: Role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signUp, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
