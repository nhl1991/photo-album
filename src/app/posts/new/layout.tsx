import Container from "@/components/common/ui/Container";

export default function CreatePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pb-16">
      <Container>{children}</Container>
    </main>
  );
}
