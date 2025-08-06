import PlaceIcon from "@/components/icons/PlaceIcon";

export default function PostAddress({ address }: { address: string }) {


    return (
        <>
            {address ? <div className="w-full h-full flex items-center justify-start p-1 text-xs md:text-xl">
                <PlaceIcon className="w-8" />
                <p className="w-full text-left px-2 my-1 relative">
                    {address}</p></div> : null}
        </>
    )
}