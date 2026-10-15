"use client";

import { useState } from "react";
import Link from "next/link";
import SignUpHero from "./SignUpHero";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  const [error, setError] = useState("");

  return (
    <div className="w-full max-w-sm">
      <SignUpHero />
      <div className="card p-6 sm:p-8">
        <SignUpForm setError={setError} />
        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-center text-sm text-danger">
            {error.toUpperCase()}
          </p>
        ) : null}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link
          className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          href="/signin"
        >
          Already have an account ?
        </Link>
      </p>
    </div>
  );
}
