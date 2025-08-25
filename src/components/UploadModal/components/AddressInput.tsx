import { Loader } from "@googlemaps/js-api-loader";
import {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";

export default function Address({
  defaultValue,
  setAddress,
}: {
  defaultValue: string;
  setAddress: Dispatch<SetStateAction<string>>;
}) {
  const apiOptions = {
    apiKey: "AIzaSyDFZ_1A_G4R6IjolqGwB39R2ub-7Q9sFU0",
  };

  const [data, setData] = useState<Array<string | undefined>>([]);
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loader = new Loader(apiOptions);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    // setQuery(e.currentTarget.value);
    getSuggestions(e.currentTarget.value);
  };

  const getSuggestions = async (placeQuery: string) => {
    if (placeQuery == "") {
      setData([]);
      return;
    }
    const { AutocompleteSuggestion } = await loader.importLibrary("places");
    //@params > autocompleteRequest:  AutocompleteRequest / @return Promise<{suggestions:Array<AutocompleteSuggestion>}>
    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: placeQuery,
      });

    //@ts-expect-error: Google Maps places library types missing
    const arr = suggestions.map((s) => s.placePrediction?.text?.text);

    setData(arr);
  };

  const onClick = (e: MouseEvent<HTMLParagraphElement>) => {
    //console.log(e.currentTarget.innerText)
    if (inputRef && inputRef.current) {
      inputRef.current.value = e.currentTarget.innerText;
      setAddress(e.currentTarget.innerText);
    }
    setData([]);
  };
  useEffect(() => {
    if (inputRef && inputRef.current) setQuery(defaultValue);
  }, [defaultValue]);
  return (
    <div className="w-full h-full relative flex flex-col">
      <label className="font-semibold self-start" htmlFor="address">
        Location
      </label>
      <input
        id="address"
        className="w-full h-full border-2 border-gray-400 rounded-2xl px-2 m-0 focus:border-sky-400 outline-0"
        ref={inputRef}
        defaultValue={defaultValue}
        type="text"
        name="google_geocoding"
        onChange={handleOnChange}
      />
      <div className="w-full">
        <div className="w-full h-max bg-gray-700 rounded-2xl m-0 absolute">
          {data
            ? data.map((item, index) => {
                return (
                  <p
                    className="px-2 py-1 hover:bg-slate-500 cursor-pointer"
                    key={index}
                    onClick={onClick}
                  >
                    {item}
                  </p>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
