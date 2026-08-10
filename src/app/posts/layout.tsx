import Navigation from "@/components/Navigation";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen flex bg-studio-bg text-studio-text font-display">
      <Navigation />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
