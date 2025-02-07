"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  ControlPosition,
  MapControl,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

export default function MapWithSearch() {
  const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
    const map = useMap();
    const [placeAutocomplete, setPlaceAutocomplete] = useState();
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
      if (!places || !inputRef.current) return;

      const options = {
        fields: ["geometry", "name", "formatted_address"],
      };

      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
      if (!placeAutocomplete) return;

      placeAutocomplete.addListener("place_changed", () => {
        const place = placeAutocomplete.getPlace();
        if (place.geometry) {
          onPlaceSelect(place);
          map.fitBounds(place.geometry.viewport);
        }
      });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
      <div className="bg-white p-1 rounded-lg shadow-md border border-gray-300">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search a place..."
          className="p-2 w-80 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      <div className="relative w-screen h-screen flex items-center justify-center">
        <div className="w-[90vw] h-[80vh] rounded-xl overflow-hidden shadow-lg border border-gray-300">
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={5}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            {selectedPlace && (
              <Marker
                position={{
                  lat: selectedPlace.geometry.location.lat(),
                  lng: selectedPlace.geometry.location.lng(),
                }}
              />
            )}
          </Map>
        </div>
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
        </MapControl>
      </div>
    </APIProvider>
  );
}
