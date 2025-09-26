'use client'
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import Avartar from "@/components/account/ui/Avartar";
import DisplayName from "@/components/account/ui/DisplayName";
import SignOut from "@/components/account/ui/SignOutButton";
import ButtonItem from "@/components/account/ui/ButtonItem";
import ButtonGroup from "@/components/account/ui/ButtonGroup";

export default function Page() {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                setUser(user);
                // ...
            } else {
                // User is signed out
                // ...
            }
        });

        return () => unsubscribe();
    }, [])

    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <div className="flex flex-col gap-1 items-center justify-center text-white border-2 rounded-2xl border-gray-500 py-12 px-4">

                <Avartar user={user} />
                <DisplayName user={user} />
                <ButtonGroup>
                    <ButtonItem>
                        <Link href={'account/password'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">CHANGE PASSWORD</p></Link>
                    </ButtonItem>

                    <ButtonItem>
                        <Link href={'account/dashboard'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">MY DASHBOARD</p></Link>
                    </ButtonItem>

                    <ButtonItem>
                        <Link href={'account/favorite'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">FAVORITE</p></Link>
                    </ButtonItem>
                    <ButtonItem>
                        <Link href={'account/delete-account'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">DELETE ACCOUNT</p></Link>
                    </ButtonItem>
                    <ButtonItem>
                        <SignOut />
                    </ButtonItem>
                </ButtonGroup>
            </div>
        </div>
    )
}