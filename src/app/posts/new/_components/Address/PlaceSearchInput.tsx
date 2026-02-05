"use client";
import { findPlacesByQuery } from "@/lib/findPlacesByQuery";
import { GeocodeResults } from "@/types/Geocode";

import { Dispatch, SetStateAction, useRef } from "react";

export default function PlaceSearchInput({
  setQueryResults,
}: {
  setQueryResults: Dispatch<SetStateAction<GeocodeResults[] | null>>;
}) {
  const queryRef = useRef<HTMLInputElement>(null);

  const handleOnClick = async () => {
    if (!queryRef) return;
    if (!queryRef.current) return;

    await fetch("/api/geocode/query", {
      method: "POST",
      body: JSON.stringify({ place_id: "ChIJg-NbxYfmAGARSKvGWN74GMo" }),
    });
  };

  const handleOnChange = async () => {
    if (!queryRef) return;
    if (!queryRef.current) return;
    const { value } = queryRef.current;
    if (value === "") {
      setQueryResults(null);
      return;
    }
    const results = await findPlacesByQuery(value);
    if (results) setQueryResults(results);
  };

  return (
    <div className="flex items-center justify-center py-8 gap-x-4">
      <input
        type="text"
        className="w-72 border-b-2 border-gray-500 focus:border-sky-400"
        id="query"
        name="place query"
        placeholder="Enter an address to search."
        ref={queryRef}
        onChange={handleOnChange}
      />
      <button
        onClick={handleOnClick}
        className="px-3 py-1 rounded-xl btn-hover"
      >
        SEARCH
      </button>
    </div>
  );
}
