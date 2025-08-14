'use client'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { User, onAuthStateChanged } from "firebase/auth";
import { Logout } from "../utils/firebase-utils";
import { auth } from "@/app/firebase";
import TimelineIcon from "./icons/HomeIcon";
import DashboardIcon from "./icons/TimelineIcon";
import AccounIcon from "./icons/AccounIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { UnsubRefContext } from "./contexts/unsubscribeContext";

export default function Navigation() {
    const router = useRouter();
    const unsubRef = useContext(UnsubRefContext);
    const [user, setUser] = useState<User | null>(null);
    const onLogout = async () => {
        if (!unsubRef) return;

        unsubRef.current?.();      // 여기서 바로 해제 가능
        unsubRef.current = null;
        if (!unsubRef.current)
            await Logout().then(() => {
                setUser(null);
                router.push('/signin');

            });
        // await auth.signOut();

    }

    useEffect(() => {

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        return onAuthStateChanged(auth, (user: User | null) => {
            setUser(user);
        });
    }, [setUser])

    return (
        <div className="w-full col-span-full flex gap-2 px-4 py-2 justify-end items-end">
            {user ? <div className="text-xl rounded-2xl bg-gray-500 px-4 py-1 flex items-center ">
                <p className="w-max mx-1 text-2xl">
                    {user ? user.displayName : "Anonymous"}님
                </p>
                <Link className="w-max mx-1" href={'/'}>
                    <TimelineIcon className="w-8" />
                </Link>
                <Link className="w-max mx-1" href={'/account/dashboard'}>
                    <DashboardIcon className="w-8" />
                </Link>
                <Link className="w-max" href={'/account'}>
                    <AccounIcon className="w-8" />
                </Link>

                <button id="logout" name="logout" className="rounded-2xl mx-1 hover:cursor-pointer " onClick={onLogout}>
                    <LogoutIcon className="w-8" />
                </button>
            </div> : null
            }
        </div>
    )
}