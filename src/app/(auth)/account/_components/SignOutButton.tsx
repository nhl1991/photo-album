import { Logout } from "@/utils/firebase-utils";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  const onClickLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
    });
    if (response.ok) {
      await Logout();
      router.push("/signin");
    } else return alert("Failed to Sign Out. Try again.");
  };

  return (
    <>
      <button
        className="rounded-2xl px-4 py-1 font-semibold cursor-pointer"
        onClick={onClickLogout}
      >
        LOGOUT
      </button>
    </>
  );
}
