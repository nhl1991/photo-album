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
    <form className="flex flex-col gap-y-10 py-4" onSubmit={onSubmit}>
      <div className="flex flex-col justify-evenly items-center gap-y-8 px-4">
        <div className="flex flex-col text-sm font-bold">
          <label htmlFor="email">EMAIL</label>
          <input
            className="px-4 py-2 w-[200px] outline-0 border-slate-500 border-b-2 focus:border-b-sky-400"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
          />
        </div>
        <div className="flex flex-col text-sm font-bold">
          <label htmlFor="password">Password</label>
          <input
            className="px-4 py-2 w-[200px] outline-0 border-slate-500 border-b-2 focus:border-b-sky-400"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center col-span-full row-start-4">
        {isLoading ? (
          <ThreeDotsBounce className="w-12 h-8" />
        ) : (
          <input
            type="submit"
            className="w-24 uppercase rounded-xl cursor-pointer px-2 py-1 btn-hover"
            disabled={isLoading}
            value={"Sign In"}
          />
        )}
      </div>
    </form>
  );
}
