import Container from "@/components/common/ui/Container";
import AccountContainer from "./_components/AccountContainer";

export default function Page() {
  return (
    <>
      <main className="min-h-screen pb-16">
        <Container>
          <AccountContainer />
        </Container>
      </main>
    </>
  );
}
