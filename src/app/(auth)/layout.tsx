"use client"
import { useAuth } from "@/hooks/useAuth"
import { unauthorized } from "next/navigation";


export default function AuthLayout({children} : {children:React.ReactNode}){

    const { user } = useAuth();
    if(!user) return unauthorized();
    return(
        <>
            {children}
        </>
    )
}