import { authClient } from "@/shared/api/client";

export interface PlacePrediction {
  place_id: string;
  description: string;
  primary_text: string;
  secondary_text: string | null;
}

export interface PlaceAutocompleteResponse {
  predictions: PlacePrediction[];
}

export interface PlaceDetailsResponse {
  place_id: string;
  formatted_address: string;
  lat: number | null;
  lng: number | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

export const getPlaceAutocomplete = async (
  input: string,
  sessionToken?: string
): Promise<PlaceAutocompleteResponse> => {
  const response = await authClient.get("/api/v1/places/autocomplete", {
    params: {
      input,
      session_token: sessionToken,
    },
  });

  return response.data as PlaceAutocompleteResponse;
};

export const getPlaceDetails = async (
  placeId: string,
  sessionToken?: string
): Promise<PlaceDetailsResponse> => {
  const response = await authClient.get("/api/v1/places/details", {
    params: {
      place_id: placeId,
      session_token: sessionToken,
    },
  });

  return response.data as PlaceDetailsResponse;
};
