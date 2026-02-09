import { GeocodeResponse } from "@/types/Geocode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { place_id } = await req.json();

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`,
  );

  const { results } = await response.json();
  if (!response.ok)
    return NextResponse.json(
      { ok: false, error: "External API Error." },
      { status: 502 },
    );
  if (!results)
    return NextResponse.json(
      {
        ok: false,
        error: "Please try a different image or enter the address manually.",
      },
      { status: 404 },
    );

  return NextResponse.json(
    {
      ok: true,
      results: results.map((r:GeocodeResponse) => {
        const {formatted_address , geometry, place_id} = r;
        return {formatted_address , geometry, place_id}})
      ,
    },
    { status: 200 },
  );
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
