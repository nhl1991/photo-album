import Link from "next/link";


export default function Page(){


    return(
        <>
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
            <div>
                <p className="font-serif text-[clamp(4rem,3rem+5vw,7rem)] leading-none tracking-tight text-ink">404</p>
                <p className="mt-4 text-muted">페이지를 찾을 수 없습니다</p>
            </div>
            <Link href={'/'} className="btn-secondary">홈으로</Link>
        </main>
        </>
    )
}
