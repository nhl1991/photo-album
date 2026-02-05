"use client"
import { useState } from "react";
import PlaceSearchInput from "./PlaceSearchInput";

import PlaceResultsByQuery from "./PlaceResultsByQuery";
import { GeocodeResults } from "@/types/Geocode";
export default function PlaceResultsByQueryContainer({ handleSelectAddress } : {
    handleSelectAddress: (place_id:string) => void
}){

    const [queryResults, setQueryResults] = useState<GeocodeResults[]|null>(null);


    return(
        <>
        <PlaceResultsByQuery queryResults={queryResults} handleSelectAddress={handleSelectAddress} />
        <PlaceSearchInput setQueryResults={setQueryResults} />
        </>
    )
}