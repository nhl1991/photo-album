"use client";
import { GeocodeResults } from "@/types/Geocode";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getGPS } from "@/utils/exif-utils";
import { useQuery } from "@tanstack/react-query";
import { GpsTags } from "exifreader";
import PlaceResultsByGeocode from "./PlaceResultsByGeocode";
import PlaceResultsByQueryContainer from "./PlaceResultsByQueryContainer";
import SelectedPlaceResult from "./SelectedPlaceResult";
import { QueryResults } from "@/types/Places";
import PlaceResultsByQuery from "./PlaceResultsByQuery";
import PlaceSearchInput from "./PlaceSearchInput";
import ResultsWrapper from "./ui/ResultsWrapper";
import LoadingSpinner from "@/components/common/LoadingSpinner";
/**
 * EXIF GPS READ
 * SUGGESTS PLACES
 * MANUAL SEARCHING PLACES
 * @param param0
 * @returns
 */
const fetchGeocode = async (gps: GpsTags | undefined) => {
  if (!gps) return;
  const response = await fetch("/api/geocode", {
    method: "POST",
    body: JSON.stringify({ gps }),
  });

  if (response.ok) return await response.json();
};

export default function AddressContainer({
  file,
  handleSelectPlaceId
}: {
  file: File;
  handleSelectPlaceId: (place_id:string) => void
}) {
  const [gps, setGps] = useState<GpsTags>();
  const [hasGps, setHasGps] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<QueryResults[] | null>(null);


  useEffect(() => {
    const init = async () => {
      const results = await getGPS(file);

      if (results) {
        setGps(results);
        setHasGps(true);
      } else setHasGps(false);
    };

    init();
  }, []);

  const { data, status } = useQuery({
    queryKey: ["geocode", gps?.Latitude, gps?.Longitude],
    queryFn: () => fetchGeocode(gps),
    enabled: hasGps,
  });
  

  if (hasGps) {
    if (status === "pending") return <LoadingSpinner />;
    if (status === "error") return <p>Error ...</p>;
    if (status === "success" && data) {
      const { results }: { results: GeocodeResults[] } = data;
      if (Array.isArray(results))
        return (
          <>

            <ResultsWrapper>
              <PlaceResultsByGeocode
                geocodeResults={results}
                handleSelectAddress={handleSelectPlaceId}
              />
              <PlaceResultsByQuery
                queryResults={queryResults}
                handleSelectAddress={handleSelectPlaceId}
              />
            </ResultsWrapper>
            <PlaceSearchInput setQueryResults={setQueryResults} />
          </>
        );
    }
  } else
    return (
      <>
        <PlaceSearchInput setQueryResults={setQueryResults} />
        <ResultsWrapper>
          <PlaceResultsByQuery
            queryResults={queryResults}
            handleSelectAddress={handleSelectPlaceId}
          />
        </ResultsWrapper>
      </>
    );
}
