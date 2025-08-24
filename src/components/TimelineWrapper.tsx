
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    

    return (

        <div className="w-full h-full overflow-scroll justify-center ">
            <div className="m-4 grid grid-cols-[repeat(1,minmax(300px,450px))] md:grid-cols-[repeat(4,minmax(200px,300px))] 2xl:grid-cols-[repeat(6,minmax(300px,450px))] 4k:grid-cols-[repeat(8,minmax(300px,450px))] grid-rows-[repeat(2,minmax(300px,1fr))] md:grid-rows-[repeat(2,minmax(300px,1fr))] md:auto-rows-[minmax(300px,250px)] auto-rows-[minmax(300px,1fr)] md:gap-4 gap-y-4 ">
                {children}
            </div>
        </div>
    )
}