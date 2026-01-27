"use client";
import { auth } from "@/lib/firebase";
import { AuthUser, AuthState } from "@/types/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const userAuth = auth;
  useEffect(() => {
    onAuthStateChanged(userAuth, (r) => setUser(r));
  }, [userAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
