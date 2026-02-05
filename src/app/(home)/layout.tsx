"use client";

import Navigation from "@/components/Navigation";

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-center">
      <Navigation />
      {children}
    </main>
  );
}
