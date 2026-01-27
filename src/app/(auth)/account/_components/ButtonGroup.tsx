export default function ButtonGroup({ children } : { children : React.ReactNode}){


    return(
        
                <div className=" p-4 flex gap-2 flex-col">
                    {children}
                </div>
    )
}