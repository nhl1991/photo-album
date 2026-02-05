"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignInForm from "./SignInForm";
import SignInHero from "./SignInHero";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => setError(""), []);


  return (
    <>
    <SignInHero />
    <div className="w-[360px] h-[360px]  rounded-xl p-4 shadow-md shadow-black relative flex flex-col items-center justify-center">
      
      <SignInForm setError={setError} />
      <div className="flex flex-col justify-center">
        <span className="p-2 text-center text-red-600">
          <p>{error.toUpperCase()}</p>
        </span>
        <Link className="w-full text-center hover:text-blue-400" href="/signup">
          Create an account ?
        </Link>
      </div>
    </div>
    </>
  );
}
