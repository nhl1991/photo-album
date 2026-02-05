"use client";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { unauthorized } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const { user } = useAuth();
//   useEffect(() => {
//     if (!user) return unauthorized();
//   },[user]);
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
