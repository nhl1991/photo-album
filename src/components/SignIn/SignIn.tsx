"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { FirebaseAuthSignIn, printErrorMessage } from "@/utils/firebase-utils";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setError(""), []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      if (emailRef.current && passwordRef.current) {
        // const user = await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
        const user = await FirebaseAuthSignIn(
          emailRef.current.value,
          passwordRef.current.value
        );

        if (user) router.push("/");
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(printErrorMessage(e));
      }
    } finally {
      setIsLoading(false);

      // setError("");
    }
  };

  return (
    <div className="w-96 h-max  rounded-2xl p-4">
      <div className="w-full flex items-center justify-center py-2">
        <h1 className="text-[clamp(2rem,1.8rem+2vw,4rem)] font-bold">
          SIGN IN
        </h1>
      </div>
      <form
        className="w-full h-full grid grid-cols-1 grid-rows-4 gap-2"
        onSubmit={onSubmit}
      >
        <div className="items-center row-span-3 flex flex-col justify-evenly px-4">
          <input
            className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
          />
          <input
            className="w-5/6 outline-0 border-white border-b-2 focus:border-b-sky-400"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
        <div className="w-full h-full flex items-center justify-center col-span-full row-start-4">
          <input
            type="submit"
            className="w-24 uppercase rounded-xl bg-sky-400 hover:bg-sky-400/80 cursor-pointer px-2 py-1"
            disabled={isLoading}
            value={"Sign In"}
          />
        </div>
      </form>
      <div className="flex flex-col justify-center">
        <span className="p-2 text-center text-red-600">
          <p>{error.toUpperCase()}</p>
        </span>
        <Link className="w-full text-center hover:opacity-80" href="/signup">
          Create an account ?
        </Link>
      </div>
    </div>
  );
}
