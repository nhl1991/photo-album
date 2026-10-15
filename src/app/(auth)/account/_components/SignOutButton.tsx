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
        alert("Failed to Sign Out. Try again.");
      }
    } catch (e) {
      console.log(e);
      alert("Failed to Sign Out. Try again.");
    }
  };

  return (
    <>
      <button
        className="flex min-h-14 w-full items-center px-5 text-left text-muted transition-colors hover:bg-canvas hover:text-ink cursor-pointer"
        onClick={onClickLogout}
      >
        LOGOUT
      </button>
    </>
  );
}
