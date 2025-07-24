
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    

    return (

        <div className="w-full h-full overflow-scroll ">
            <div className="m-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 grid-rows-[repeat(2,minmax(100px,1fr))] auto-rows-[minmax(200px,300px)] gap-2 ">
                {children}
            </div>
        </div>
    )
}