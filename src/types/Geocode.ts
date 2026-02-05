export type GeocodeResponse = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
};

export interface GeocodeResults {
  formatted_address: string;
  place_id: string;
}

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type Geometry = {
  location: LatLng;
  location_type: "ROOFTOP" | "RANGE_INTERPOLATED" | "GEOMETRIC_CENTER" | "APPROXIMATE";
  viewport: Bounds;
  bounds?: Bounds;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Bounds = {
  northeast: LatLng;
  southwest: LatLng;
};
