"use client";
import Link from "next/link";
import Avartar from "@/app/(auth)/account/_components/Avartar";

import { useAuth } from "@/hooks/useAuth";
import DisplayName from "./_components/DisplayName";
import ButtonGroup from "./_components/ButtonGroup";
import ButtonItem from "./_components/ButtonItem";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignOut from "./_components/SignOutButton";

export default function Page() {
  const { user, setUser } = useAuth();
  const router = useRouter();
    useEffect(()=>{
        if(!user) router.push('/signin')
    })
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="flex flex-col gap-1 items-center justify-center text-white border-2 rounded-2xl border-gray-500 py-12 px-4">
        <Avartar user={user} />
        <DisplayName user={user} />
        <ButtonGroup>
          <ButtonItem>
            <Link href={"account/password"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">
                CHANGE PASSWORD
              </p>
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"account/dashboard"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">
                MY DASHBOARD
              </p>
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"account/favorite"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">FAVORITE</p>
            </Link>
          </ButtonItem>
          <ButtonItem>
            <Link href={"account/delete-account"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">
                DELETE ACCOUNT
              </p>
            </Link>
          </ButtonItem>
          <ButtonItem>
            <SignOut />
          </ButtonItem>
        </ButtonGroup>
      </div>
    </div>
  );
}
