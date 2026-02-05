import React from "react"


export default function ButtonItem({ children }: {
    children: React.ReactNode;
}){


    return(

        <div className="w-72 shadow-sm hover:shadow-cyan-200 dark:hover:shadow-purple-800 rounded-2xl text-center py-2">
            {children}
        </div>
    )
}