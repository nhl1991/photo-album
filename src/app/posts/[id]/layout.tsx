"use client";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="w-full min-h-screen bg-studio-bg flex justify-center py-10">
        {children}
      </main>
  );
}
