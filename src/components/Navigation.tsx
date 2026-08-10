"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logout } from "../utils/firebase-utils";
import GridIcon from "./icons/GridIcon";
import DashboardIcon from "./icons/TimelineIcon";
import AccountIcon from "./icons/AccountIcon";
import LogoutIcon from "./icons/LogoutIcon";
import FavoriteIcon from "./icons/FavoriteIcon";
import UploadIcon from "./icons/UploadIcon";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/posts/new", label: "업로드", Icon: UploadIcon },
  { href: "/", label: "대시보드", Icon: GridIcon },
  { href: "/dashboard", label: "개인 대시보드", Icon: DashboardIcon },
  { href: "/favorite", label: "즐겨찾기", Icon: FavoriteIcon },
  { href: "/account", label: "설정", Icon: AccountIcon },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string | null>("");
  const { user, setUser, status } = useAuth();

  const onLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        await Logout();
        setUser(null);
        router.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetch("/api/auth/me", {
        method: "GET",
      });
    };
    init();

    if (user) setDisplayName(user.displayName);
  }, [user]);

  if (status === "Pending") return null;

  const isAuthed = status === "Authed" && !!user;
  const initial =
    status === "Authed" && user
      ? (displayName || user.displayName || "?").charAt(0).toUpperCase()
      : "?";

  return (
    <aside className="w-16 studio:w-[212px] shrink-0 bg-studio-panel border-r border-studio-line flex flex-col py-[22px] font-display text-studio-text">
      <div className="flex items-center gap-2 px-[22px] pb-[22px] mb-3.5 border-b border-studio-line font-semibold text-lg">
        <span className="w-2 h-2 rounded-full bg-studio-lime shrink-0" />
        <span className="hidden studio:inline">FRAME.</span>
      </div>

      <div className="flex items-center gap-2.5 px-[22px] pb-[18px] mb-2.5 border-b border-studio-line">
        <div className="w-[30px] h-[30px] rounded-full bg-studio-lime text-studio-bg flex items-center justify-center font-mono-ui text-xs font-semibold shrink-0">
          {initial}
        </div>
        <div className="hidden studio:block min-w-0">
          <p className="text-[13px] font-medium truncate">
            {status === "Authed" && user
              ? displayName || user.displayName || "Anonymous"
              : "Guest"}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] transition-colors focus-visible:bg-studio-panel-2 focus-visible:text-studio-text ${
                active
                  ? "bg-studio-panel-2 text-studio-lime"
                  : "text-studio-dim hover:bg-studio-panel-2 hover:text-studio-text"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden studio:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-2.5 px-3 border-t border-studio-line">
        {isAuthed ? (
          <button
            id="logout"
            name="logout"
            title="로그아웃"
            aria-label="로그아웃"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] text-studio-dim hover:bg-studio-panel-2 hover:text-studio-text focus-visible:bg-studio-panel-2 focus-visible:text-studio-text transition-colors cursor-pointer"
          >
            <LogoutIcon className="w-4 h-4 shrink-0" />
            <span className="hidden studio:inline">로그아웃</span>
          </button>
        ) : (
          <Link
            href="/signin"
            title="로그인"
            aria-label="로그인"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] text-studio-lime hover:bg-studio-panel-2 focus-visible:bg-studio-panel-2 transition-colors"
          >
            <LogoutIcon className="w-4 h-4 shrink-0 rotate-180" />
            <span className="hidden studio:inline">로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
