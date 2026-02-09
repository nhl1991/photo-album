"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpHero from "./SignUpHero";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  const [error, setError] = useState("");

  return (
    <>
      <SignUpHero />
      <div className="w-[360px] h-[480px]  rounded-xl p-4 shadow-md shadow-black relative flex flex-col items-center justify-center">
        <SignUpForm setError={setError} />
        <div className="flex flex-col justify-center">
          <span className="p-2 text-center text-red-600">
            {error.toUpperCase()}
          </span>
          <Link
            className="w-full text-center hover:text-blue-400"
            href="/signin"
          >
            Already have an account ?
          </Link>
        </div>
      </div>
    </>
  );
}
