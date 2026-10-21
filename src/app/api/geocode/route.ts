import { requireUser } from "@/lib/auth/requireUser";
import { rateLimit } from "@/lib/ratelimit";
import { GeocodeResponse } from "@/types/Geocode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if(!auth.ok) return auth.response;
  const { decodedUid } = auth;

  try {
    // geocode 라우트: 세션 검증 직후
    const rl = await rateLimit(`geocode_${decodedUid}`, 30, 60_000);
    if (!rl.ok)
      return NextResponse.json(
        { ok: false, error: "Too many requests." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );

    const { gps } = await req.json();
    const lat = gps?.Latitude,
      lng = gps?.Longitude;
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      Math.abs(lat) > 90 ||
      Math.abs(lng) > 180
    )
      return NextResponse.json(
        { ok: false, error: "Invalid GPS coordinates." },
        { status: 400 },
      );

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=political&key=${process.env.GOOGLE_GEOCODING_API_KEY}`,
    );

    if (!response.ok)
      return NextResponse.json(
        { ok: false, error: "External API Error." },
        { status: 502 },
      );

    const data = await response.json();

    // 1. 정말로 결과가 없음 → 404
    if (data.status === "ZERO_RESULTS")
      return NextResponse.json(
        {
          ok: false,
          error: "Please try a different image or enter the address manually.",
        },
        { status: 404 },
      );

    // 2. 그 외 OK가 아닌 상태(REQUEST_DENIED, OVER_QUERY_LIMIT 등) → 로그 + 502
    if (data.status !== "OK") {
      console.error("[geocode]", data.status, data.error_message);
      return NextResponse.json(
        { ok: false, error: "External API Error." },
        { status: 502 },
      );
    }

    // 3. OK인데 결과가 비어 있음(방어용) → 404
    if (!Array.isArray(data.results) || data.results.length === 0)
      return NextResponse.json(
        {
          ok: false,
          error: "Please try a different image or enter the address manually.",
        },
        { status: 404 },
      );

    return NextResponse.json(
      {
        message: "OK",
        ok: true,
        results: data.results.map((r: GeocodeResponse) => {
          const { formatted_address, place_id } = r;
          return { formatted_address, place_id };
        }),
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error." },
      { status: 500 },
    );
  }
}

/**
 * {
    address_components: [ [Object] ],
    formatted_address: 'Japan',
    geometry: {
      bounds: [Object],
      location: [Object],
      location_type: 'APPROXIMATE',
      viewport: [Object]
    },
    place_id: 'ChIJLxl_1w9OZzQRRFJmfNR1QvU',
    types: [ 'country', 'political' ]
  }
    
 */
