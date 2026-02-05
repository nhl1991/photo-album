import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { GOOGLE_API_KEY } from "./google-api-key";
import { QueryResults } from "@/types/Places";
export async function getPlaceDetail(query:QueryResults){

  console.log(query.placeId);
  const { Place } = await importLibrary("places")
  const place = new Place({id: query.placeId, requestedLanguage: 'en'});
  const result = await place.fetchFields({
  fields: [
    "displayName",
    "formattedAddress",
    "location",
    "geometry/viewport",
    "types",
  ],
});
  console.log(result.place.geometry.viewport)
    // const results = await place.displayName;
    // console.log(results);
}