'use client'
import { useRouter } from "next/navigation";
import { auth } from "../firebase"
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, onAuthStateChanged } from "firebase/auth";
import { Logout } from "../utils/firebase-utils";

export default function Navigation() {
    const router = useRouter();

    const [ user, setUser ] = useState<User|null>(null);
    const onLogout = async () => {
            await Logout();
            // await auth.signOut();
            setUser(null);
            router.push('/login');
        
    }

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

        return () => unsubscribe && unsubscribe();
    },[user])

    return (
        <div className="w-full flex gap-2 px-4 py-2 justify-end items-end">
            { user ? <div className="text-xl rounded-2xl bg-gray-500 px-4 py-1 flex items-center ">
                <p className="w-max mx-1 text-2xl">
                    {user ? user.displayName : "Anonymous"}님
                </p>
                <Link className="w-max mx-1" href={'/'}>
                    <svg className="w-8" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </Link>
                <Link className="w-max" href={'/account'}>
                    <svg className="w-8 mx-1" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </Link>

                <button id="logout" name="logout" className="rounded-2xl mx-1 hover:cursor-pointer " onClick={onLogout}>
                    <svg name="logout" className="w-8 mx-1" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </button>
            </div> : null
}
        </div>
    )
}