import React from "react"


export default function ButtonContainer({ children }: {
    children: React.ReactNode;
}){


    return(

        <div className="w-72 bg-gray-600 rounded-2xl text-center">
            {children}
        </div>
    )
}