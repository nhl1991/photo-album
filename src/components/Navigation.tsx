"use client";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logout } from "../utils/firebase-utils";
import LogoutIcon from "./icons/LogoutIcon";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import UploadIcon from "./icons/UploadIcon";
import CloseIcon from "./icons/CloseIcon";
import Brand from "./common/ui/Brand";
import Container from "./common/ui/Container";

const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/favorite", label: "Favorites" },
  { href: "/account", label: "Account" },
];

export default function Navigation() {
  // const router = useRouter();
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string | null>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser, status } = useAuth();
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isAuthed = status === "Authed" && user;
  const linkClass = (href: string) =>
    `relative py-5 text-sm transition-colors hover:text-ink ${
      pathname === href
        ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-ink"
        : "text-muted"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <Container className="grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
        <Brand className="justify-self-start" />

        <nav aria-label="Main" className="hidden md:block">
          <Link
            href="/"
            className={linkClass("/")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Explore
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          {status === "Pending" ? (
            <span className="h-10 w-20" aria-hidden="true" />
          ) : isAuthed ? (
            <>
              <nav
                aria-label="Account"
                className="hidden items-center gap-6 lg:flex"
              >
                {accountLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={linkClass(href)}
                    aria-current={pathname === href ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <Link href={"/posts/new"} className="btn-primary ml-4 hidden min-h-9 px-4 lg:inline-flex">
                <UploadIcon className="w-4" />
                New post
              </Link>
              <span
                className="ml-2 hidden max-w-32 truncate text-sm text-muted xl:block"
                title={displayName ?? "Anonymous"}
              >
                {displayName ?? "Anonymous"}
              </span>
              <button
                id="logout"
                name="logout"
                className="icon-btn hidden lg:inline-flex"
                onClick={onLogout}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogoutIcon className="w-5" />
              </button>
              <button
                type="button"
                className="icon-btn text-ink lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {menuOpen ? (
                  <CloseIcon className="w-6" />
                ) : (
                  <svg className="w-6" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn-secondary min-h-9 px-4">
              Sign In
            </Link>
          )}
        </div>
      </Container>

      {isAuthed && menuOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-canvas lg:hidden"
        >
          <Container className="py-4">
            <p className="eyebrow pb-3">{displayName ?? "Anonymous"}</p>
            <ul className="flex flex-col">
              {[{ href: "/", label: "Explore" }, { href: "/posts/new", label: "New post" }, ...accountLinks].map(
                ({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex min-h-12 items-center border-b border-line text-base ${
                        pathname === href ? "text-ink" : "text-muted"
                      }`}
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <button
                  className="flex min-h-12 w-full items-center gap-2 text-base text-muted cursor-pointer"
                  onClick={onLogout}
                >
                  <LogoutIcon className="w-5" />
                  Sign out
                </button>
              </li>
            </ul>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
