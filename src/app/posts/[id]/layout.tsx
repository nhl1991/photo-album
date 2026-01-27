"use client";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="w-screen min-h-screen flex items-center justify-center">
        {children}
      </main>
  );
}
