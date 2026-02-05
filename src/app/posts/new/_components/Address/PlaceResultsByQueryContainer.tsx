"use client"
import { useState } from "react";
import PlaceSearchInput from "./PlaceSearchInput";
import { QueryResults } from "@/types/Places";
import PlaceResultsByQuery from "./PlaceResultsByQuery";
export default function PlaceResultsByQueryContainer({ handleSelectAddress } : {
    handleSelectAddress: (place_id:string) => void
}){

    const [queryResults, setQueryResults] = useState<QueryResults[]|null>(null);


    return(
        <>
        <PlaceResultsByQuery queryResults={queryResults} handleSelectAddress={handleSelectAddress} />
        <PlaceSearchInput setQueryResults={setQueryResults} />
        </>
    )
}