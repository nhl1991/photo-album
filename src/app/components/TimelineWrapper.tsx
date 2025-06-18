
export default function TimelineWrapper({ children }: {
    children: React.ReactNode
}) {
    

    return (

        <div className="w-full h-full">
            <div className="m-4 grid grid-cols-4 grid-rows-5 gap-2">
                {children}
            </div>
        </div>
    )
}