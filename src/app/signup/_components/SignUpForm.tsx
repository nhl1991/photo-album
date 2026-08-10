import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import { auth } from "@/lib/firebase";
import { printErrorMessage } from "@/utils/firebase-utils";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export default function SignUpForm({
  setError,
}: {
  setError: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      isLoading ||
      !emailRef.current ||
      !passwordRef.current ||
      !displayNameRef.current
    )
      return;
    const requiredFields = [
      { ref: emailRef, message: "Please enter your email." },
      { ref: passwordRef, message: "Please enter your password." },
      { ref: displayNameRef, message: "Please enter your username." },
    ];

    for (const { ref, message } of requiredFields) {
      if (!ref.current?.value) {
        alert(message);
        return;
      }
    }

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value,
      ).then(async (res) => {
        await updateProfile(res.user, {
          displayName: displayNameRef.current?.value,
        });
      });

      router.push("/");
    } catch (e) {
      if (e instanceof FirebaseError) setError(printErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-5">
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
          <p className="font-mono-ui text-[10.5px] text-studio-dim mt-1.5">
            8자 이상, 영문+숫자 조합
          </p>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="font-mono-ui text-[11px] tracking-[0.08em] text-studio-dim mb-2"
          >
            USERNAME
          </label>
          <input
            className="w-full bg-transparent border-0 border-b border-studio-line text-studio-text text-[15px] pb-2.5 outline-none focus:border-b-studio-lime placeholder:text-studio-dim/60 transition-colors"
            type="text"
            id="username"
            placeholder="username"
            ref={displayNameRef}
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
            value={"Sign Up"}
          />
        )}
      </div>
    </form>
  );
}
