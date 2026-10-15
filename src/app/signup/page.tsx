import Brand from "@/components/common/ui/Brand";
import Container from "@/components/common/ui/Container";
import SignUp from "./_components/SignUp";

export default function Page(){

    return(
        <main className="flex min-h-screen flex-col">
            <Container className="flex h-16 items-center border-b border-line">
                <Brand />
            </Container>
            <div className="flex flex-1 items-start justify-center px-4 py-12 sm:items-center">
                <SignUp />
            </div>
        </main>
    )
}
