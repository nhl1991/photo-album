'use client'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ChangeEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { auth } from "../../app/firebase";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { printErrorMessage } from "@/utils/firebase-utils";
import { useRouter } from "next/navigation";

export default function SignUp() {


    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("")
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement | null>(null)

    const passwordRef = useRef<HTMLInputElement | null>(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || !emailRef.current || !passwordRef.current) { console.log(email, password, isLoading); return; };

        try {
            setIsLoading(true);
            
            if (emailRef.current && passwordRef.current) {

                await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current?.value).then(async (res)=>{
                    await updateProfile(res.user, {
                    displayName: username
                });
                });
                
                router.push('/');
            }
        } catch (e) {
            if (e instanceof FirebaseError)
                setError(printErrorMessage(e));
        } finally {
            setIsLoading(false);
            setEmail("");
            setUsername("");
            setPassword("");
        }

    }

    const onChange = useDebouncedCallback((event:ChangeEvent<HTMLInputElement>) => {

        if (event.target.id === "username") {
            setUsername(event.target.value);
        } else return;
    }, 200)


    return (
        <div className="w-96 h-64  rounded-2xl p-4">

            <form className="w-full h-full grid grid-cols-1 grid-rows-6 gap-2" onSubmit={onSubmit}>
                <div className="col-span-full row-span-4 flex flex-col items-center justify-evenly px-4">
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="email" type="email" name="email" placeholder="Email" ref={emailRef} />
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" id="password" type="password" name="password" placeholder="Password" ref={passwordRef} />
                    <input className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400" type="text" id="username" placeholder="Username" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)} />
                </div>
                <div className="flex items-center justify-center col-span-full row-start-5">
                    <input type="submit" className="w-1/2 uppercase rounded-2xl bg-sky-400 hover:bg-sky-400/80 cursor-pointer p-2" value={isLoading ? "Signing up" : "Sign Up"} />
                </div>
            </form>
            <div className="flex flex-col justify-center">
                <span className="text-center text-red-600"><p>{error.toUpperCase()}</p></span>
                <Link className="w-full text-center my-2 bottom-0" href="/signin">Already have an account ?</Link>
                
            </div>

        </div>
    )
}