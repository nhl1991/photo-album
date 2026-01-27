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
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navigation() {
  // const router = useRouter();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>("");
  const { user, setUser } = useAuth();

  const onLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        await Logout();
        setUser(null);
        router.push('/home');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) setDisplayName(user.displayName);
  }, [user]);

  return (
    <nav
      className={`w-full flex items-center ${user ? "justify-center" : "justify-end"} h-16`}
    >
      <ul className="text-xl rounded-2xl  px-4 py-1 flex items-center ">
        {user ? (
          <>
            <li>
              <p className="w-max mx-1 text-2xl">
                {displayName ?? "Anonymous"}
              </p>
            </li>
            <li>
              <Link href={"/home"}>
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
          </>
        ) : (
          <li className="px-8">
            <Link
              href="/signin"
              className="px-3 py-1.5 rounded-2xl btn-hover font-bold"
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
