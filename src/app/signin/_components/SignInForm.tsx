"use client";

import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import { useAuth } from "@/hooks/useAuth";
import { FirebaseAuthSignIn, printErrorMessage } from "@/utils/firebase-utils";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export default function SignInForm({
  setError,
}: {
  setError: Dispatch<SetStateAction<string>>;
}) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      if (emailRef.current && passwordRef.current) {
        const user = await FirebaseAuthSignIn(
          emailRef.current.value,
          passwordRef.current.value,
        );
        const tokenId = await user.getIdToken();
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenId}` },
        });

        if (response.ok && user) {
          setUser(user);
          router.push("/");
        }
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
    <form className="flex flex-col gap-y-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-5">
        <div>
          <label className="field-label" htmlFor="email">EMAIL</label>
          <input
            className="field-input"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            className="field-input"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
      </div>
      <div className="flex min-h-11 items-center justify-center">
        {isLoading ? (
          <span role="status" aria-label="Loading" className="text-accent">
            <ThreeDotsBounce className="w-12 h-8" />
          </span>
        ) : (
          <input
            type="submit"
            className="btn-primary min-h-11 w-full"
            disabled={isLoading}
            value={"Sign In"}
          />
        )}
      </div>
    </form>
  );
}
