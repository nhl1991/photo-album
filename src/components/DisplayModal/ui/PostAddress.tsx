
export default function PostAddress({ address }: { address: string }) {


    return (
        <>
            {address ? <div className="w-full h-full flex items-center justify-start p-1 text-xl">
                <svg className="w-6" data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className="w-max text-left px-2 my-1 relative">
                    {address}</p></div> : null}
        </>
    )
}