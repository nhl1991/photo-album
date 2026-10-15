import React from "react"


export default function ButtonItem({ children }: {
    children: React.ReactNode;
}){


    return(

        <li className="text-sm text-ink [&>a]:flex [&>a]:min-h-14 [&>a]:items-center [&>a]:justify-between [&>a]:px-5 [&>a]:transition-colors [&>a:hover]:bg-canvas">
            {children}
        </li>
    )
}
