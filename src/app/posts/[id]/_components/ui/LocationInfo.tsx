import PlaceIcon from "@/components/icons/PlaceIcon";

export default function LocationInfo({ address }: { address: string }) {


    return (
        <>
            {address ? <div className="w-max flex items-center p-1 text-xs md:text-xl">
                <PlaceIcon className="w-8" />
                <p className="text-left px-2 my-1 relative">
                    {address}</p></div> : null}
        </>
    )
}