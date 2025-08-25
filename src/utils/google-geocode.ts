import { getGPS } from "./exif-utils";


export async function getAddressByGps(file:File){
    try {
    
                const gps = await getGPS(file);
                if (gps) {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${gps.Latitude},${gps.Longitude}&result_type=political&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`,
                    )
                    if(response.status != 200) return;

                    const  {results}  = await response.json();

                    if (results && results.length > 0) {
                        return results[0].formatted_address;
                    } else {
                        return "Address can't be found."
                    }
                } else {
                    return "Address can't be found.";
                }
            } catch (error) {
                console.error("EXIF Error:", error);
                return "EXIF 데이터를 처리하는 중 오류가 발생했습니다.";
            }
}