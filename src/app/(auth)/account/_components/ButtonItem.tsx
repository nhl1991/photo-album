import React from "react"


export default function ButtonItem({ children }: {
    children: React.ReactNode;
}){


    return(

        <div className="w-72 hover:shadow-sm rounded-2xl text-center py-2">
            {children}
        </div>
    )
}