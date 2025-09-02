
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    
//className="m-4 grid grid-cols-[repeat(1,minmax(300px,450px))] md:grid-cols-[repeat(4,minmax(200px,300px))] 2xl:grid-cols-[repeat(6,minmax(300px,450px))] 4k:grid-cols-[repeat(8,minmax(300px,450px))] grid-rows-[repeat(2,minmax(300px,1fr))] md:grid-rows-[repeat(2,minmax(300px,1fr))] md:auto-rows-[minmax(300px,250px)] auto-rows-[minmax(300px,1fr)] md:gap-4 gap-y-4 "
    return (

        <main className="w-full h-full overflow-scroll justify-center ">
            <div className="m-4 grid grid-cols-1 md:grid-cols-5 grid-rows-10 md:grid-rows-[repeat(2,minmax(120px,320px))] md:auto-rows-[minmax(300px,1fr)] auto-rows-[minmax(300px,1fr)] md:gap-2 gap-y-4 bg-gray-700">
                {children}
            </div>
        </main>
    )
}