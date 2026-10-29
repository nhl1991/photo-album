import ThreeDotsBounce from "@/components/icons/ThreeDotsBounce";
import { useAuth } from "@/hooks/useAuth";
import { establishSession } from "@/lib/auth/establishSession";
import { auth } from "@/lib/firebase";
import { logOut, printErrorMessage } from "@/utils/firebase-utils";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useRef, useState } from "react";

const notifySignupSessionFailure = async () => {
  await logOut().catch(() => {});
  alert("가입은 완료됐지만 로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
};

export default function SignUpForm({
  setError,
}: {
  setError: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const { setUser } = useAuth();
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
      { ref: emailRef, message: "이메일을 입력해주세요." },
      { ref: passwordRef, message: "비밀번호를 입력해주세요." },
      { ref: displayNameRef, message: "사용자 이름을 입력해주세요." },
    ];

    for (const { ref, message } of requiredFields) {
      if (!ref.current?.value) {
        alert(message);
        return;
      }
    }
    let created = false;
    try {
      setIsLoading(true);

      // 1. Firebase 가입 + 표시 이름 설정
      const { user } = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value,
      );
      created = true;
      await updateProfile(user, { displayName: displayNameRef.current.value });

      // 2. 서버 세션 발급

      const result = await establishSession(user);

      if (result.ok) {
        setUser(user);
        router.push("/");
        return;
      }

      // 3. 세션 발급 실패: 클라이언트 로그아웃 후 안내
      await notifySignupSessionFailure();
      router.push("/signin");
      return;
    } catch (e) {
      if (created) {
        await notifySignupSessionFailure();
        router.push("/signin");
      } else if (e instanceof FirebaseError) setError(printErrorMessage(e));
      else setError("가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-col gap-y-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-5">
        <div>
          <label className="field-label" htmlFor="email">
            이메일
          </label>
          <input
            className="field-input"
            id="email"
            type="email"
            name="email"
            placeholder="이메일"
            ref={emailRef}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            비밀번호
          </label>
          <input
            className="field-input"
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호"
            ref={passwordRef}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="username">
            사용자 이름
          </label>
          <input
            className="field-input"
            type="text"
            id="username"
            placeholder="사용자 이름"
            ref={displayNameRef}
          />
        </div>
      </div>
      <div className="flex min-h-11 items-center justify-center">
        {isLoading ? (
          <span role="status" aria-label="가입 중" className="text-accent">
            <ThreeDotsBounce className="w-12 h-8" />
          </span>
        ) : (
          <input
            type="submit"
            className="btn-primary min-h-11 w-full"
            disabled={isLoading}
            value={"가입하기"}
          />
        )}
      </div>
    </form>
  );
}
