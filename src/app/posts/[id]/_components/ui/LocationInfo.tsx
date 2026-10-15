import PlaceIcon from "@/components/icons/PlaceIcon";

export default function LocationInfo({ address }: { address: string }) {


    return (
        <>
            {address ? <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
                <PlaceIcon className="w-4 shrink-0" />
                <p className="truncate">
                    {address}</p></div> : null}
        </>
    )
}
