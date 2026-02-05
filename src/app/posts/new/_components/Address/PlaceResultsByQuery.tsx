import PlaceIcon from "@/components/icons/PlaceIcon";
import { GeocodeResults } from "@/types/Geocode";

export default function PlaceResultsByQuery({
  queryResults,
  handleSelectAddress,
}: {
  queryResults: GeocodeResults[] | null;
  handleSelectAddress: (place_id:string) => void
}) {

  return (
    <>
        {queryResults ? (<>
            {queryResults.map((q) => (
              <li className="" key={q.place_id}>
                <button className="flex items-center justify-center gap-x-1 px-3 py-1 rounded-xl btn-hover md:text-sm text-xs"
                onClick={()=>handleSelectAddress(q.place_id)}>
                  <PlaceIcon className="w-4 h-4" />
                  {q.formatted_address}
                </button>
              </li>
            ))}
        </>) : null}
    </>
  );
}
