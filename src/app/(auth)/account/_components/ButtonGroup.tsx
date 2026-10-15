export default function ButtonGroup({ children } : { children : React.ReactNode}){


    return(
        <ul className="card divide-y divide-line overflow-hidden">
            {children}
        </ul>
    )
}
