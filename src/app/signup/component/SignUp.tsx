'use client'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ChangeEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import Link from "next/link";

export default function SignUp() {


    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("")
    const emailRef = useRef<HTMLInputElement | null>(null)
    
    const passwordRef = useRef<HTMLInputElement | null>(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || email === "" || password === "") return;

        try {
            setIsLoading(true);
            if (emailRef.current && passwordRef.current) {
                const credentials = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current?.value);
                await updateProfile(credentials.user, {
                    displayName: username
                });
            }
        } catch (e) {
            if (e instanceof FirebaseError)
                setError(e.message);
        } finally {
            setIsLoading(false);
            setEmail("");
            setUsername("");
            setPassword("");
        }

    }

    const onChange = useDebouncedCallback((event) => {
    if (event.target.name === "username") {
            setUsername(event.target.value);
        } else return;
    }, 200)


    return (
        <div className="w-96 h-64  rounded-2xl p-4">

            <form className="w-full h-full grid grid-cols-1 grid-rows-6 gap-2" onSubmit={onSubmit}>
                <div className="flex items-center justify-center col-span-full row-span-4 flex flex-col justify-evenly px-4">
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="email" type="email" name="email" placeholder="Email" ref={emailRef} />
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="password" type="password" name="password" placeholder="Password" ref={passwordRef} />
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" type="text" id="username" placeholder="Username" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} />
                </div>
                <div className="flex items-center justify-center col-span-full row-start-5">
                    <input type="submit" className="w-1/2 uppercase rounded-2xl bg-sky-400 hover:bg-sky-400/80 cursor-pointer p-2" value={isLoading ? "Logging in" : "sign in"} />
                </div>

                <div className="col-span-full row-start-6 flex flex-col justify-center">
            <Link className="w-full text-center my-2 bottom-0" href="/signin">Already have an account ?</Link>
                    <span>{error}</span>
                </div>
            </form>
            {/* <form onSubmit={onSubmit} className="w-full h-full row-span-5 grid grid-cols-3 grid-rows-6 items-center justify-items-center">
                <span className="flex items-center justify-center  col-span-full row-start-2 p-2"><label htmlFor="email" className=" w-26 px-2">EMAIL</label><input className="rounded-xl px-2 py-1 bg-gray-500" type="email" id="email" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} /></span>
                <span className="flex items-center justify-center  col-span-full row-start-3 p-2"><label htmlFor="password" className=" w-26 px-2">PASSWORD</label><input className="rounded-xl px-2 py-1 bg-gray-500" type="password" ref={passwordRef} id="password" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} /></span>
                <span className="flex items-center justify-center  col-span-full row-start-4 p-2"><label htmlFor="username" className=" w-26 px-2">USERNAME</label><input className="rounded-xl px-2 py-1 bg-gray-500" type="text" id="username" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} /></span>
                <input className="col-start-2 row-start-6 rounded-2xl bg-sky-400 text-xl p-2 hover:bg-sky-400/80" type="submit" value={isLoading ? "등록 중..." : "계정 생성"} />

                <span>{error}</span>
            </form> */}

        </div>
    )
}