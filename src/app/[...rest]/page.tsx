import Link from "next/link";


export default function Page(){


    return(
        <>
        <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
            <p className="text-8xl">
                Invalid URL
            </p>
            <Link href={'/'}>GO BACK</Link>
        </div>
        </>
    )
}