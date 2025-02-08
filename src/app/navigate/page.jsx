"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  ControlPosition,
  MapControl,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { getUser, updateLocationUser } from "../../../actions/userActions";
import { getMarkings, createMarking } from "../../../actions/markingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function MapWithSearch() {
  const [user, setUser] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showUserMarker, setShowUserMarker] = useState(true);
  const [markings, setMarkings] = useState([]);
  const [selectedMark, setSelectedMark] = useState(null);
  const [markType, setMarkType] = useState(null);
  const [comment, setComment] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const directionsRendererRef = useRef(null);

  const fetchMarkings = useCallback(async () => {
    const response = await getMarkings();
    if (response.success) {
      setMarkings(response.data);
    } else {
      toast.error("Failed to fetch security markings");
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const response = await getUser(localStorage.getItem("token"));
    if (response.success) {
      setUser(response.user);
    } else {
      toast.error(response.error);
    }
    return response.user;
  }, []);

  const handleAddMarking = async () => {
    if (!userLocation || !user) {
      toast.error("User location or user data is missing");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment about this place");
      return;
    }

    const response = await createMarking({
      comment,
      markType,
      location: userLocation,
      userId: user._id,
    });

    if (response.success) {
      toast.success("Marking added successfully");
      fetchMarkings();
    } else {
      toast.error("Failed to add marking");
    }
    setOpenDialog(false);
    setComment("");
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMarkings();
      const userdata = await fetchUser();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            if (userdata) {
              updateLocationUser(
                location.lat,
                location.lng,
                userdata?.username
              );
            }
          },
          () => {
            toast.error("Failed to get user location");
          }
        );
      }
    };
    fetchData();
  }, [fetchUser, fetchMarkings]);

  return (
    <div className="justify-center w-full flex flex-col">
      <div className="ms-16 mb-4 flex justify-end gap-2">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setMarkType(1)}
              className="bg-yellow-500 text-white"
            >
              Mark place as unsafe
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button
              onClick={() => setMarkType(2)}
              className="bg-red-500 text-white"
            >
              Mark place as Danger
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Provide a Comment</DialogTitle>
            </DialogHeader>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Why are you marking this place?"
            />
            <DialogFooter>
              <Button onClick={handleAddMarking}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}
        libraries={["marker"]}
      >
        <div className="flex items-center justify-center">
          {userLocation && (
            <div className="w-[90vw] h-[80vh] rounded-xl overflow-hidden shadow-lg border border-gray-300">
              <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={userLocation}
                defaultZoom={15}
                gestureHandling="greedy"
                mapId="b0d1b3c3c1a5b6d1"
              >
                {showUserMarker && (
                  <AdvancedMarker
                    title="Current Location"
                    position={userLocation}
                  />
                )}
                {markings.map((mark) => (
                  <AdvancedMarker
                    key={mark._id}
                    position={mark.location}
                    onClick={() => setSelectedMark(mark)}
                    title="Marked Location"
                  >
                    <Pin
                      background={mark.markType === 1 ? "#f6e05e" : "#f56565"}
                      borderColor={mark.markType === 1 ? "#f6e05e" : "#f56565"}
                      glyphColor="#0f677a"
                    />
                  </AdvancedMarker>
                ))}
                {selectedMark && (
                  <InfoWindow
                    position={selectedMark.location}
                    maxWidth={200}
                    onCloseClick={() => setSelectedMark(null)}
                  >
                    <div>
                      <p>
                        <span className="font-bold">Reason:</span>{" "}
                        {selectedMark.comment}
                      </p>
                      <p>
                        <span className="font-bold">Marked Date:</span>{" "}
                        {new Date(selectedMark.createdAt).toUTCString()}
                      </p>
                      <p>
                        <span className="font-bold">Remark:</span>{" "}
                        {selectedMark.markType === 1
                          ? "Not advised to go"
                          : "Danger zone"}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </div>
          )}
        </div>
      </APIProvider>
    </div>
  );
}
