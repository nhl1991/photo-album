"use client";
import { auth } from "@/lib/firebase";
import { AuthUser, AuthState } from "@/types/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [status, setStatus] = useState<"Authed"|"Pending"|"Guest">("Guest")
  const userAuth = auth;
  useEffect(() => {
    onAuthStateChanged(userAuth, (r) => {
      setStatus("Pending");
      if(userAuth.currentUser)
        setStatus("Authed");
      else
        setStatus("Guest")

      setUser(r)
    });
  }, [userAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, status }}>
      {children}
    </AuthContext.Provider>
  );
}
