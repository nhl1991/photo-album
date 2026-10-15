import Link from "next/link";


export default function Page(){


    return(
        <>
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
            <p className="font-serif text-[clamp(3rem,2rem+5vw,6rem)] leading-none tracking-tight text-ink">
                Invalid URL
            </p>
            <Link href={'/'} className="btn-secondary">GO BACK</Link>
        </main>
        </>
    )
}
