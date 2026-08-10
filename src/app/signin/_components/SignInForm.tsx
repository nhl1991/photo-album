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
    <form className="flex flex-col" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-mono-ui text-[11px] tracking-[0.08em] text-studio-dim mb-2"
          >
            EMAIL
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-studio-line text-studio-text text-[15px] pb-2.5 outline-none focus:border-b-studio-lime placeholder:text-studio-dim/60 transition-colors"
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            ref={emailRef}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-mono-ui text-[11px] tracking-[0.08em] text-studio-dim mb-2"
          >
            PASSWORD
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-studio-line text-studio-text text-[15px] pb-2.5 outline-none focus:border-b-studio-lime placeholder:text-studio-dim/60 transition-colors"
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            ref={passwordRef}
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-8">
        {isLoading ? (
          <ThreeDotsBounce className="w-12 h-8" />
        ) : (
          <input
            type="submit"
            className="w-full uppercase tracking-wide rounded-md cursor-pointer py-3.5 bg-studio-lime text-studio-bg font-semibold text-sm hover:bg-[#d7ec89] hover:-translate-y-px focus-visible:bg-[#d7ec89] transition-all"
            disabled={isLoading}
            value={"Sign In"}
          />
        )}
      </div>
    </form>
  );
}
