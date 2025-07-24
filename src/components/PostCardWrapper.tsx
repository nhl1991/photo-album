

export default function PostCardWrapper({ children }: {
    children: React.ReactNode
}) {


    return (

        <div className="flex flex-col rounded-2xl items-center justify-center p-2" >
            {children}
        </div>
    )
}