
export default function ResultsWrapper({children} : {children: React.ReactNode}){

    return(
        <ul className="flex gap-x-2 flex-wrap gap-y-2 px-16">
            {children}
        </ul>
    )
}