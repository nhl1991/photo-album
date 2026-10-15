"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SignInForm from "./SignInForm";
import SignInHero from "./SignInHero";

export default function SignIn() {
  const [error, setError] = useState("");

  useEffect(() => setError(""), []);

  return (
    <div className="w-full max-w-sm">
      <SignInHero />
      <div className="card p-6 sm:p-8">
        <SignInForm setError={setError} />
        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-center text-sm text-danger">
            {error.toUpperCase()}
          </p>
        ) : null}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link
          className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          href="/signup"
        >
          Create an account ?
        </Link>
      </p>
    </div>
  );
}
