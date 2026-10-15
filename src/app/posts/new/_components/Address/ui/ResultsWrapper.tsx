
export default function ResultsWrapper({children} : {children: React.ReactNode}){

    return(
        <ul className="flex flex-wrap gap-2 px-5 pt-5 empty:hidden">
            {children}
        </ul>
    )
}