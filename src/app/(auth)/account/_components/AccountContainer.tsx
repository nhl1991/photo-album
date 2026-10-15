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
import PageHeading from "@/components/common/ui/PageHeading";

export default function AccountContainer() {
  const { user } = useAuth();
  const router = useRouter();
    useEffect(()=>{
        if(!user) router.push('/signin')
    })
  return (
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <PageHeading title="Account" description="Manage your profile and settings." />
        </div>
        <section className="card mb-6 flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
          <Avartar user={user} />
          <DisplayName />
        </section>
        <ButtonGroup>
          <ButtonItem>
            <Link href={"/password"}>
              <span>CHANGE PASSWORD</span>
              <Chevron />
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"/dashboard"}>
              <span>MY DASHBOARD</span>
              <Chevron />
            </Link>
          </ButtonItem>

          <ButtonItem>
            <Link href={"/favorite"}>
              <span>FAVORITE</span>
              <Chevron />
            </Link>
          </ButtonItem>
          <ButtonItem>
            <Link href={"/delete-account"}>
              <span>DELETE ACCOUNT</span>
              <Chevron />
            </Link>
          </ButtonItem>
          <ButtonItem>
            <SignOut />
          </ButtonItem>
        </ButtonGroup>
      </div>
  );
}

function Chevron() {
  return (
    <svg className="w-4 text-muted" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}
