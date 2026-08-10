"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SignInForm from "./SignInForm";
import SignInHero from "./SignInHero";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function SignIn() {
  const [error, setError] = useState("");

  useEffect(() => setError(""), []);

  return (
    <div className="w-screen min-h-screen flex max-[880px]:flex-col bg-studio-bg font-display">
      <AuthBrandPanel
        quote="기록되지 않으면, "
        highlight="빛은 사라진다."
      />
      <div className="flex-1 flex items-center justify-center p-10 max-[880px]:p-6">
        <div className="w-full max-w-[360px]">
          <SignInHero />
          <SignInForm setError={setError} />
          {error ? (
            <p className="pt-2 text-center text-studio-red text-sm font-mono-ui">
              {error.toUpperCase()}
            </p>
          ) : null}
          <div className="text-center mt-6 text-sm text-studio-dim">
            계정이 없으신가요?{" "}
            <Link
              className="text-studio-text border-b border-studio-lime-deep hover:text-studio-lime transition-colors focus-visible:text-studio-lime"
              href="/signup"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
