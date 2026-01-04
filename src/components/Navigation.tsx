"use client";
// import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { User } from "firebase/auth";
import { Logout } from "../utils/firebase-utils";
import TimelineIcon from "./icons/HomeIcon";
import DashboardIcon from "./icons/TimelineIcon";
import AccountIcon from "./icons/AccountIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { UnsubRefContext } from "./contexts/unsubscribeContext";
import { useDisplayNameStore } from "@/store/displayNameStore";
import { auth } from "@/lib/firebase";
import FavoriteIcon from "./icons/FavoriteIcon";

export default function Navigation() {
  // const router = useRouter();
  const unsubRef = useContext(UnsubRefContext);
  const { displayName } = useDisplayNameStore();
  const [user, setUser] = useState<User | null>(null);
  const onLogout = async () => {
    if (!unsubRef) return;

    unsubRef.current?.(); // 여기서 바로 해제 가능
    unsubRef.current = null;
    if (!unsubRef.current)
      await Logout().then(() => {
        setUser(null);
        // router.push("/signin");
      });
    // await auth.signOut();
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) return;
      else setUser(user);
    });
  });

  return (
    <nav className="w-full col-span-full flex gap-2 px-12 py-8 justify-end items-end">
      {user ? (
        <ul className="text-xl rounded-2xl bg-gray-500 px-4 py-1 flex items-center ">
          <li>
            <p className="w-max mx-1 text-2xl">{displayName ?? "Anonymous"}</p>
          </li>
          <li>
            <Link href={"/"}>
              <TimelineIcon className="w-8" />
            </Link>
          </li>
          <li>
            <Link href={"/dashboard"}>
              <DashboardIcon className="w-8" />
            </Link>
          </li>
          <li>
            <Link href={"/favorite"}>
              <FavoriteIcon className="w-8" />
            </Link>
          </li>
          <li>
            <Link href={"/account"}>
              <AccountIcon className="w-8" />
            </Link>
          </li>
          <li>
            <button
              id="logout"
              name="logout"
              className="rounded-2xl mx-1 hover:cursor-pointer "
              onClick={onLogout}
            >
              <LogoutIcon className="w-8" />
            </button>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link
              href="/signin"
              className="px-3 py-1.5 rounded-2xl bg-sky-400 hover:bg-sky-500 font-bold"
            >
              Sign In
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
