import { Geometry } from "@/types/Geocode";
import { getGPS } from "./exif-utils";

export async function getAddressByGps(file: File) {
  try {
    const gps = await getGPS(file);
    if (!gps)
      return { ok: false, error: "No GPS data available for this image." };
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps.Latitude},${gps.Longitude}&result_type=political&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`,
    );
    if (!response.ok) return { ok: false, error: "External API Error." };

    const { results } = await response.json();
    if (!results)
      return {
        ok: false,
        error: "Please try a different image or enter the address manually.",
      };

    return {
      ok: true,
      address: results.map(
        ({ formattedAddress }: { formattedAddress: string }) =>
          formattedAddress,
      ),
      gps: results.map(({geometry}: {geometry:Geometry}) => geometry),
    };
  } catch (error) {
    console.log("<-------------EXIF Error START----------------->");
    console.error(error);
    console.log("<-------------EXIF Error END----------------->");
    return { ok: false, error: "Internal Error." };
  }
}
