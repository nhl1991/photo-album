"use client";

import { GeocodeResponse, GeocodeResults } from "@/types/Geocode";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";

const fetchGeocodeByPlaceId = async (place_id: string | null) => {
  const response = await fetch("/api/geocode/query", {
    method: "POST",
    body: JSON.stringify({ place_id }),
  });
  if (response.ok) {
    const { results } = await response.json();

    return results;
  }
};

export default function SelectedPlaceResult({
  place_id,
  setAddress,
}: {
  place_id: string | null;
  setAddress: Dispatch<SetStateAction<GeocodeResponse | null>>;
}) {
  const { data, status } = useQuery({
    queryKey: ["place", `${place_id}`],
    queryFn: () => fetchGeocodeByPlaceId(place_id),
    enabled: place_id ? true : false,
  });
  useEffect(() => {
  if (status === "success" && data) {
    console.log(data[0]);
    setAddress(data[0])
  } else if (status !== "pending") {
    setAddress(null)
  }
}, [status, data, setAddress])
  if (status === "error") return <p>에러..</p>;
  if (status === "success" && !data) return <p>주소 없음</p>;
  if (status === "success" && data) {
    const place = data[0];
    return (
      <>
          <p key={place.place_id} className="w-max flex items-center justify-center gap-x-1 px-3 py-1 rounded-xl bg-lime-500 text-white font-bold md:text-base text-xs">
            {place.formatted_address ?? "SEARCH THE PLACE"}
          </p>
      </>
    );
  }
}
