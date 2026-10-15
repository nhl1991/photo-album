import { useAuth } from "@/hooks/useAuth";
import { Logout } from "@/utils/firebase-utils";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const { setUser } = useAuth();
  const onClickLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        await Logout();
        setUser(null);
        router.push("/signin");
      } else {
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      console.log(e);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <button
        className="flex min-h-14 w-full items-center px-5 text-left text-muted transition-colors hover:bg-canvas hover:text-ink cursor-pointer"
        onClick={onClickLogout}
      >
        로그아웃
      </button>
    </>
  );
}
