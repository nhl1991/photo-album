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
          <label htmlFor="password">PASSWORD</label>
          <input
            className="px-4 py-2 w-[200px] outline-0 border-slate-500 border-b-2 focus:border-b-sky-400"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
        <div className="flex flex-col text-sm font-bold">
          <label htmlFor="username">USERNAME</label>
          <input
            className="px-4 py-2 w-[200px] outline-0 border-slate-500 border-b-2 focus:border-b-sky-400"
            type="text"
            id="username"
            placeholder="Username"
            ref={displayNameRef}
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
