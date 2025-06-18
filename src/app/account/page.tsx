'use client'
import { useEffect, useState } from "react";
import { auth } from "../firebase"
import { User, onAuthStateChanged } from "firebase/auth";
import Avartar from "./ui/Avartar";
import DisplayName from "./ui/DisplayName";
import SignOut from "./ui/SignOutButton";

import ButtonContainer from "./ui/ButtonContainer";
import Link from "next/link";

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
                <div className=" p-4 flex gap-2 flex-col">
                    <ButtonContainer>
                        <Link href={'account/password'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">CHANGE PASSWORD</p></Link>
                    </ButtonContainer>

                    <ButtonContainer>
                        <Link href={'account/dashboard'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">MY DASHBOARD</p></Link>
                    </ButtonContainer>

                    <ButtonContainer>
                        <Link href={'account/favorite'}>
                            <p className="rounded-2xl px-4 py-1 font-semibold">FAVORITE</p></Link>
                    </ButtonContainer>
                    <ButtonContainer>
                        <SignOut />
                    </ButtonContainer>
                </div>
            </div>
        </div>
    )
}