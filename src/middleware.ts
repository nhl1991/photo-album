import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";



export function middleware(request: NextRequest) {


    if(request.nextUrl.pathname === '/'){
        const url = new URL('/signin', request.url)

        if(auth){
            return NextResponse.redirect(url)
        }

    }
    
}