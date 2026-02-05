import PlaceIcon from "@/components/icons/PlaceIcon";
import { GeocodeResults } from "@/types/Geocode";

export default function PlaceResultsByGeocode({
  geocodeResults,
  handleSelectAddress
}: {
  geocodeResults: GeocodeResults[];
  handleSelectAddress: (place_id:string) => void
}) {
  return (
    <>
        {geocodeResults.map((d) => (
          <li className="" key={d.place_id}>
            <button className="flex items-center justify-center gap-x-1 px-3 py-1 rounded-xl btn-hover md:text-sm text-xs"
            onClick={()=>handleSelectAddress(d.place_id)}>
              <PlaceIcon className="w-4 h-4" />
              {d.formatted_address}
            </button>
          </li>
        ))}
    </>
  );
}
