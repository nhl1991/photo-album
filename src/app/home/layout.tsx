"use client"
import { queryClient } from "@/providers/QueryProvider";
import { QueryClientProvider } from "@tanstack/react-query";

export default function TimelineLayout({children}:{children:React.ReactNode}){

    return(
        <QueryClientProvider client={queryClient}>
            <main className="w-screen min-h-screen flex flex-col items-center justify-center">
            {children}
            </main>
        </QueryClientProvider>
    )
}