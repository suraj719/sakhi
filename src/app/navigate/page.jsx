"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  ControlPosition,
  MapControl,
  useMapsLibrary,
  useMap,
  Marker,
} from "@vis.gl/react-google-maps";
import { getUser, updateLocationUser } from "../../../actions/userActions";
import { toast } from "sonner";

export default function MapWithSearch() {
  const [user, setUser] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showUserMarker, setShowUserMarker] = useState(true);
  const directionsRendererRef = useRef(null);

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
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setMap(null);
          }
          onPlaceSelect(place);
          map.fitBounds(place.geometry.viewport);
          setShowUserMarker(false);
        }
      });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
      <div className="bg-white p-1 rounded-lg shadow-md border border-gray-300">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search destination..."
          className="p-2 text-xl w-80 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  function Directions({ origin, destination }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);

    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService());
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new routesLibrary.DirectionsRenderer({
          map,
        });
      }
    }, [routesLibrary, map]);

    useEffect(() => {
      if (
        !directionsService ||
        !directionsRendererRef.current ||
        !destination ||
        !origin
      )
        return;

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setMap(map);
            directionsRendererRef.current.setDirections(response);
          } else {
            console.error("Directions request failed due to ", status);
          }
        }
      );
    }, [directionsService, destination, origin, map]);

    return null;
  }
  const fetchUser = useCallback(async () => {
    const response = await getUser(localStorage.getItem("token"));
    if (response.success) {
      setUser(response.user);
    } else {
      toast.error(response.error);
    }
    return response.user;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userdata = await fetchUser();
      console.log(userdata);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            if (user)
              updateLocationUser(location.lat, location.lng, user?.username);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    };

    fetchData(); // Call the async function
  }, [fetchUser]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      <div className="relative w-screen h-screen flex items-center justify-center">
        {userLocation && (
          <>
            <div className="w-[90vw] h-[80vh] rounded-xl overflow-hidden shadow-lg border border-gray-300">
              <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={userLocation}
                defaultZoom={15}
                gestureHandling="greedy"
                disableDefaultUI={true}
              >
                {showUserMarker && <Marker position={userLocation} />}
                {selectedPlace && (
                  <Directions
                    origin={userLocation}
                    destination={selectedPlace.geometry.location}
                  />
                )}
              </Map>
            </div>
            <MapControl position={ControlPosition.TOP_RIGHT}>
              <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
            </MapControl>
          </>
        )}
      </div>
    </APIProvider>
  );
}
