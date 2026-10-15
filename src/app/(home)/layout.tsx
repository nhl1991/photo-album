"use client";

import Navigation from "@/components/Navigation";

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pb-16">{children}</main>
    </>
  );
}
