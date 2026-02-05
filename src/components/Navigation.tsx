"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logout } from "../utils/firebase-utils";
import TimelineIcon from "./icons/HomeIcon";
import DashboardIcon from "./icons/TimelineIcon";
import AccountIcon from "./icons/AccountIcon";
import LogoutIcon from "./icons/LogoutIcon";
import FavoriteIcon from "./icons/FavoriteIcon";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import UploadIcon from "./icons/UploadIcon";

export default function Navigation() {
  // const router = useRouter();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>("");
  const { user, setUser, status } = useAuth();
  const iconClassName = "w-12 hover:stroke-lime-400"
  const prefix = '/auth';
  const onLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        await Logout();
        setUser(null);
        router.push('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetch('/api/auth/me', {
        method:'GET'
      })
    }
    init();

    if (user) setDisplayName(user.displayName);
  }, [user]);

  return (
    <nav
      className={`w-full flex items-center justify-end`}
    >
      <ul className="text-xl rounded-2xl  px-4 py-1 flex items-center justify-center w-max h-16">
        {status==="Pending" ? <></>
         : status === 'Authed' && user ? (
          <>
            <li>
              <p className="w-max mx-1 text-2xl">
                {displayName ?? "Anonymous"}
              </p>
            </li>
            <li>
              <Link href={"/posts/new"}>
                <UploadIcon className={iconClassName} />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <TimelineIcon className={iconClassName} />
              </Link>
            </li>
            <li>
              <Link href={"/dashboard"}>
                <DashboardIcon className={iconClassName} />
              </Link>
            </li>
            <li>
              <Link href={"/favorite"}>
                <FavoriteIcon className={iconClassName} />
              </Link>
            </li>
            <li>
              <Link href={"/account"}>
                <AccountIcon className={iconClassName} />
              </Link>
            </li>
            <li>
              <button
                id="logout"
                name="logout"
                className="rounded-2xl mx-1 hover:cursor-pointer "
                onClick={onLogout}
              >
                <LogoutIcon className={iconClassName} />
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
