"use client";
import { auth } from "@/lib/client/firebase";
import { AuthUser, AuthState, Profile } from "@/types/Auth";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

const toProfile = (u: User | null): Profile =>
  u ? { displayName: u.displayName, photoURL: u.photoURL } : null;

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(null);
  const [user, setUser] = useState<AuthUser>(null);
  const [status, setStatus] = useState<"Authed" | "Pending" | "Guest">("Guest");
  const userAuth = auth;
  useEffect(() => {
    onAuthStateChanged(userAuth, (r) => {
      setStatus("Pending");
      if (userAuth.currentUser) setStatus("Authed");
      else setStatus("Guest");

      setUser(r);
      setProfile(toProfile(r));
    });
  }, [userAuth]);
  const refreshProfile = () => setProfile(toProfile(auth.currentUser));
  const updateUserProfile = async (
    u: User,
    data: { displayName?: string; photoURL?: string },
  ) => {
    await updateProfile(u, data);
    refreshProfile();
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, status, profile, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
