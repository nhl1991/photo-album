"use client";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Container from "@/components/common/ui/Container";
import PageHeading from "@/components/common/ui/PageHeading";

export default function Page() {
  const password_current = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);

  const checkPassword = async (password: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) return false;

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {

      if (error instanceof FirebaseError) {
        console.log(error);
      }
      return false;
    }
  };

  const onCheckCurrentPassword = useDebouncedCallback(async () => {
    if (password_current.current instanceof HTMLInputElement) {
      const result = await checkPassword(password_current.current.value);
      setIsValid(result);
    }
  }, 300);

  return (
    <main className="min-h-screen pb-16">
      <Container>
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <PageHeading title="비밀번호 변경" />
        </div>
        <div className="card p-6 sm:p-8">
          {isValid ? (
            <NewPasswordForm />
          ) : (
            <div>
              <Message htmlFor="password_current">현재 비밀번호를 입력하세요.</Message>
              <div className="flex items-center gap-2">
                <input
                  className="field-input"
                  id="password_current"
                  type="password"
                  ref={password_current}
                  onChange={onCheckCurrentPassword}
                  autoComplete="false"
                />
                <svg
                  className={`w-7 shrink-0 ${
                    isValid ? "text-accent" : "text-line-strong"
                  }`}
                  stroke="currentColor"
                  data-slot="icon"
                  fill="none"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      </Container>
    </main>
  );
}

function NewPasswordForm() {
  const router = useRouter();
  const user = auth.currentUser;
  const password_new = useRef<HTMLInputElement>(null);
  const password_confirm = useRef<HTMLInputElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  const onChangePassword = () => {
    if (password_new.current && password_confirm.current) {
      if (password_new.current.value === password_confirm.current.value) {
        setIsComplete(true);
      } else {
        setIsComplete(false);
      }
    }
  };

  const onSubmit = async () => {
    if (!user) return;
    if (!password_confirm.current) return;

    try {
      await updatePassword(user, password_confirm.current.value);
      router.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) console.log(error);
    }
  };

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onSubmit}>
      <div>
      <Message htmlFor="password_new">새 비밀번호를 입력하세요.</Message>
      <input
        className="field-input"
        id="password_new"
        type="password"
        ref={password_new}
        placeholder="새로운 비밀번호를 입력하세요."
        onChange={onChangePassword}
        autoComplete="false"
      />
      </div>

      <div>
      <Message htmlFor="passowrd_confirm">새 비밀번호를 다시 한번 입력하세요.</Message>
      <input
        className="field-input"
        id="passowrd_confirm"
        type="password"
        ref={password_confirm}
        placeholder="한번 더 입력하세요."
        onChange={onChangePassword}
        autoComplete="false"
      />
      </div>

      <button
        type="submit"
        className={`btn-primary min-h-11 w-full ${
          isComplete ? "" : "opacity-50"
        }`}
      >
        비밀번호 변경
      </button>
    </form>
  );
}

function Message({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <>
      <label htmlFor={htmlFor} className="field-label">
        {children}
      </label>
    </>
  );
}
