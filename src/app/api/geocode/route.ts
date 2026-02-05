import { GeocodeResponse } from "@/types/Geocode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { gps } = await req.json();

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps.Latitude},${gps.Longitude}&result_type=political&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`,
  );
  if (!response.ok)
    return NextResponse.json(
      { ok: false, error: "External API Error." },
      { status: 502 },
    );
  const { results } = await response.json();
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
        const {formatted_address , place_id} = r;
        return {formatted_address , place_id}})
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
