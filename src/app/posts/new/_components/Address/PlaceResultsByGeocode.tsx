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
            <button className="inline-flex items-center gap-1.5 rounded-full border border-line-strong/60 px-3 py-1.5 text-left text-xs text-ink transition-colors hover:border-accent hover:bg-accent/10 md:text-sm cursor-pointer"
            onClick={()=>handleSelectAddress(d.place_id)}>
              <PlaceIcon className="w-4 h-4 shrink-0 text-muted" />
              {d.formatted_address}
            </button>
          </li>
        ))}
    </>
  );
}
