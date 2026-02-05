"use client";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Avartar from "./Avartar";
import DisplayName from "./DisplayName";
import ButtonGroup from "./ButtonGroup";
import ButtonItem from "./ButtonItem";
import SignOut from "./SignOutButton";

export default function AccountContainer() {
  const { user } = useAuth();
  const router = useRouter();
    useEffect(()=>{
        if(!user) router.push('/signin')
    })
  return (
      <div className="flex flex-col gap-1 items-center justify-center rounded-xl shadow-sm shadow-cyan-200 py-8 my-10 px-4">
        <Avartar user={user} />
        <DisplayName />
        <ButtonGroup>
          <ButtonItem>
            <Link href={"/password"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">
                CHANGE PASSWORD
              </p>
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"/dashboard"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">
                MY DASHBOARD
              </p>
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"/favorite"}>
              <p className="rounded-2xl px-4 py-1 font-semibold">FAVORITE</p>
            </Link>
          </ButtonItem>
          <ButtonItem>
            <Link href={"/delete-account"}>
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
  );
}
