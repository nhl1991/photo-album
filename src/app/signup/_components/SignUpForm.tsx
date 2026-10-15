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
          <label className="field-label" htmlFor="password">PASSWORD</label>
          <input
            className="field-input"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="username">USERNAME</label>
          <input
            className="field-input"
            type="text"
            id="username"
            placeholder="Username"
            ref={displayNameRef}
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
            value={"Sign Up"}
          />
        )}
      </div>
    </form>
  );
}
