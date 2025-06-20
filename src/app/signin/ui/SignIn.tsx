'use client'
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from "react"
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import Link from "next/link";


export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            if (emailRef.current && passwordRef.current) {
                const user = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
                if (user)
                    router.push('/')
            }
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
                console.log(e.message);
            }
        } finally {
            setIsLoading(false);

            setError("");
        }
    }



    return (
        <div className="w-96 h-64  rounded-2xl p-4">
            <form className="w-full h-full grid grid-cols-1 grid-rows-6 gap-2" onSubmit={onSubmit}>
                <div className="items-center col-span-full row-span-4 flex flex-col justify-evenly px-4">
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="email" type="email" name="email" placeholder="Email" ref={emailRef} />
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="password" type="password" name="password" placeholder="Password" ref={passwordRef} />
                </div>
                <div className="flex items-center justify-center col-span-full row-start-5">
                    <input type="submit" className="w-1/2 uppercase rounded-2xl bg-sky-400 hover:bg-sky-400/80 cursor-pointer p-2" disabled={isLoading} value={isLoading ? "로그인 중" : "로그인"} />
                </div>

                <div className="col-span-full row-start-6 flex flex-col justify-center">
                    <Link className="w-full text-center hover:opacity-80" href="/signup">Create an account ?</Link>
                    <span>{error}</span>
                </div>
            </form>

        </div>
    )
}
