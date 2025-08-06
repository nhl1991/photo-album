
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    

    return (

        <div className="w-full h-full overflow-scroll ">
            <div className="m-4 grid grid-cols-[repeat(1,minmax(300px,450px))] md:grid-cols-[repeat(5,minmax(450px,1fr))]  grid-rows-[repeat(2,minmax(300px,1fr))] md:grid-rows-[repeat(2,minmax(300px,1fr))] md:auto-rows-[minmax(300px,250px)] auto-rows-[minmax(300px,1fr)] md:gap-4 gap-y-4 ">
                {children}
            </div>
        </div>
    )
}