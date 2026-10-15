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
    <div className="flex items-center gap-2 px-5 py-5">
      <input
        type="text"
        className="field-input min-w-0 flex-1"
        aria-label="Search places"
        id="query"
        name="place query"
        placeholder="Enter an address to search."
        ref={queryRef}
        onChange={handleOnChange}
      />
      <button
        onClick={handleOnClick}
        className="btn-secondary shrink-0"
      >
        SEARCH
      </button>
    </div>
  );
}
