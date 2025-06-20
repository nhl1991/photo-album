
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    

    return (

        <div className="w-full h-full overflow-scroll">
            <div className="m-4 grid grid-cols-2 md:grid-cols-4 grid-rows-2 auto-rows-[minmax(0,1fr)] gap-2 ">
                {children}
            </div>
        </div>
    )
}