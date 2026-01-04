import { Logout } from "@/utils/firebase-utils";

export default function SignOut() {
  const onClickLogout = async () => {
    await Logout();
    // router.push('/signin');
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
