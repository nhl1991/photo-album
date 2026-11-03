"use client";
import { findPlacesByQuery } from "@/lib/client/maps/findPlacesByQuery";
import { GeocodeResults } from "@/types/Geocode";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function PlaceSearchInput({
  setQueryResults,
}: {
  setQueryResults: Dispatch<SetStateAction<GeocodeResults[] | null>>;
}) {
  const queryRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(false);
  // 같은 검색어라도 이전 요청의 응답이 최신 결과를 덮어쓰지 않도록 요청마다 식별자를 부여한다.
  const latestRequestId = useRef(0);
  const handleOnChange = useDebouncedCallback(async () => {
    if (!queryRef) return;
    if (!queryRef.current) return;

    const requestId = ++latestRequestId.current;
    const value = queryRef.current.value.trim();
    if (value.length < 2) {
      setQueryResults(null);
      setError(false);
      return;
    }
    try {
      const results = await findPlacesByQuery(value);
      if (requestId !== latestRequestId.current) return;
      if (results) setQueryResults(results);
      setError(false);
    } catch {
      if (requestId !== latestRequestId.current) return;
      setQueryResults(null);
      setError(true);
    }
  }, 300);

  return (
    <div className="flex flex-col items-center gap-2 px-5 py-5">
      <input
        type="text"
        className="field-input min-w-0 flex-1"
        aria-label="장소 검색"
        id="query"
        name="place query"
        placeholder="검색할 주소를 입력하세요."
        ref={queryRef}
        onChange={handleOnChange}
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          장소 검색 중 오류가 발생했습니다.
        </p>
      )}
    </div>
  );
}
