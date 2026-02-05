import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { GOOGLE_API_KEY } from "./google-api-key";
type PlacePrediction = {
  text: { text: string},
  placeId: string
}
export const findPlacesByQuery = async (q: string) => {
  const { AutocompleteSuggestion } = await importLibrary("places");
  //@params > autocompleteRequest:  AutocompleteRequest / @return Promise<{suggestions:Array<AutocompleteSuggestion>}>
  const { suggestions } =
    await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: q,
      language: "en",
    });
  // fetchAutocompleteSuggestions<AutocompleteRequest> >>  https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data?hl=ko&_gl=1*jyyem7*_up*MQ..*_ga*MTM2NjQ2MDE2OC4xNzY5NjY2NDgx*_ga_SM8HXJ53K2*czE3Njk2NjY0ODEkbzEkZzAkdDE3Njk2NjY0ODEkajYwJGwwJGgw*_ga_NRWSTWS78N*czE3Njk2NjY0ODEkbzEkZzEkdDE3Njk2NjY2MTIkajYwJGwwJGgw#AutocompleteRequest
  if (!suggestions) return null;
  const results = suggestions.map((s) => {
    const { placeId, text } = s.placePrediction as PlacePrediction;

    return {
      place_id: placeId,
      formatted_address: text.text,
    };
  });

  return results;

  // placePrediction >> https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data?hl=ko&_gl=1*14ad17q*_up*MQ..*_ga*MTM2NjQ2MDE2OC4xNzY5NjY2NDgx*_ga_SM8HXJ53K2*czE3Njk2NjY0ODEkbzEkZzAkdDE3Njk2NjY3MDIkajYwJGwwJGgw*_ga_NRWSTWS78N*czE3Njk2NjY0ODEkbzEkZzEkdDE3Njk2NjY4NjkkajYwJGwwJGgw#PlacePrediction
};
