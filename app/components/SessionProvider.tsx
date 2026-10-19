"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SessionUser } from "@/app/data";
import { readUser, writeUser } from "@/app/lib/storage";

interface SessionContextValue {
  user: SessionUser | null;
  login: (user: SessionUser) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  // Se renderiza "sin sesión" hasta montar para evitar diferencias de hidratación.
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(readUser());
  }, []);

  const login = useCallback((u: SessionUser) => {
    setUser(u);
    writeUser(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
