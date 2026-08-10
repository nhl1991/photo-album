"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpHero from "./SignUpHero";
import SignUpForm from "./SignUpForm";
import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function SignUp() {
  const [error, setError] = useState("");

  return (
    <div className="w-screen min-h-screen flex max-[880px]:flex-col bg-studio-bg font-display">
      <AuthBrandPanel
        quote="첫 프레임을 "
        highlight="현상할 준비가 되셨나요?"
      />
      <div className="flex-1 flex items-center justify-center p-10 max-[880px]:p-6">
        <div className="w-full max-w-[360px]">
          <SignUpHero />
          <SignUpForm setError={setError} />
          {error ? (
            <p className="pt-2 text-center text-studio-red text-sm font-mono-ui">
              {error.toUpperCase()}
            </p>
          ) : null}
          <div className="text-center mt-6 text-sm text-studio-dim">
            이미 계정이 있으신가요?{" "}
            <Link
              className="text-studio-text border-b border-studio-lime-deep hover:text-studio-lime transition-colors focus-visible:text-studio-lime"
              href="/signin"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
