"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  getLocationUser,
  getWellWisherData,
  updateEmailWellWisher,
  updatePhnoWellWisher,
} from "../../../actions/userActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wellwisher, setWellwisher] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [eta, setEta] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const fetched = useRef(false);
  const mapsLibrary = useMapsLibrary("routes");
  const router = useRouter();

  async function fetchWellWisherData() {
    const token = localStorage.getItem("wellwisher");
    if (!token) {
      toast.message("please login to access this page");
      router.push("/wellwisherlogin");
    }

    setLoading(true);
    try {
      const res = await getWellWisherData(token);
      const passengerLocation = await getLocationUser(res.username);
      setLocation(passengerLocation.location);

      if (res.success) {
        setUser(res.username);
        setWellwisher(res.wellWisher);
        setEmail(res.wellWisher.email || "");
        setPhoneNo(res.wellWisher.phoneNo || "");
        setRecordings(res.sosRecordings || []);
        toast.message("Data fetched successfully.");

        // Get current location
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDistanceAndTime() {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [{ lat: userLocation.lat, lng: userLocation.lng }],
        destinations: [{ lat: location.lat, lng: location.lng }],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const result = response.rows[0].elements[0];
          setDistance(result.distance.text);
          setDuration(result.duration.text);

          const etaTime = new Date();
          etaTime.setSeconds(etaTime.getSeconds() + result.duration.value);
          setEta(etaTime.toLocaleTimeString());
        } else {
          console.error("Error fetching distance data:", status);
        }
      }
    );
  }
  async function handleEditEmail() {
    try {
      const res = await updateEmailWellWisher(email, wellwisher.passcode, user);
      if (res.success) {
        toast.success("Email updated successfully.");
        fetchWellWisherData();
        setEditEmail(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleEditPhoneNo() {
    try {
      const res = await updatePhnoWellWisher(
        phoneNo,
        wellwisher.passcode,
        user
      );
      if (res.success) {
        toast.success("Phone number updated successfully.");
        fetchWellWisherData();
        setEditPhone(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchWellWisherData();
  }, []);

  useEffect(() => {
    if (userLocation && location) {
      fetchDistanceAndTime();
    }
  }, [userLocation, location]);

  async function logoutApp() {
    try {
      localStorage.removeItem("wellwisher");
      router.push("/");
      toast.message("Logged out successfully");
    } catch (err) {
      toast.error("Error logging out");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 pb-24 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          {loading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* User Info Card */}
              <Card className="w-full md:w-[450px] shadow-lg border-t-4 border-t-[#dc2446] h-fit md:h-[600px] flex flex-col">
                <CardHeader className="bg-white">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {user || "Wellwisher Dashboard"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1 overflow-y-auto">
                  {wellwisher && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Wellwisher Details
                        </h2>
                        <div className="mt-2 space-y-1">
                          <p className="font-semibold text-lg">
                            {wellwisher.nickname}
                          </p>
                          <p className="text-sm text-gray-600 font-mono">
                            Passcode: {wellwisher.passcode}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-blue-600 font-bold uppercase">
                            Distance
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {distance || "--"}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-green-600 font-bold uppercase">
                            ETA
                          </p>
                          <p className="text-lg font-bold text-green-900">
                            {duration || "--"}
                          </p>
                        </div>
                      </div>

                      {eta && (
                        <div className="text-center text-sm text-gray-500">
                          Expected Arrival:{" "}
                          <span className="font-medium text-gray-900">
                            {eta}
                          </span>
                        </div>
                      )}

                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">
                            Email Address
                          </label>
                          {editEmail ? (
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-9"
                              />
                              <Button size="sm" onClick={handleEditEmail}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditEmail(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-1 group">
                              <span className="text-gray-900">
                                {email || "Not provided"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8"
                                onClick={() => setEditEmail(true)}
                              >
                                Edit
                              </Button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">
                            Phone Number
                          </label>
                          {editPhone ? (
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="text"
                                placeholder="Enter phone"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                className="h-9"
                              />
                              <Button size="sm" onClick={handleEditPhoneNo}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditPhone(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-1 group">
                              <span className="text-gray-900">
                                {phoneNo || "Not provided"}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8"
                                onClick={() => setEditPhone(true)}
                              >
                                Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={logoutApp}
                        variant="destructive"
                        className="w-full mt-4"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map Section */}
              <div className="w-full md:w-[550px] h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border-4 border-white">
                {location && (
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
                    <Map
                      style={{ width: "100%", height: "100%" }}
                      defaultCenter={{ lat: location.lat, lng: location.lng }}
                      defaultZoom={12}
                      gestureHandling={"greedy"}
                      disableDefaultUI={true}
                      mapId="b0d1b3c3c1a5b6d1"
                    >
                      <AdvancedMarker
                        title="User Location"
                        position={{ lat: location.lat, lng: location.lng }}
                      >
                        <Pin
                          background={"#dc2446"}
                          borderColor={"#b91c3a"}
                          glyphColor={"#ffffff"}
                        />
                      </AdvancedMarker>
                      {userLocation && (
                        <AdvancedMarker
                          title="Your Location"
                          position={{
                            lat: userLocation.lat,
                            lng: userLocation.lng,
                          }}
                        >
                          <Pin
                            background={"#fbbf24"}
                            borderColor={"#d97706"}
                            glyphColor={"#ffffff"}
                          />
                        </AdvancedMarker>
                      )}
                    </Map>
                  </APIProvider>
                )}
              </div>
            </>
          )}
        </div>

        {/* SOS Recordings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">SOS Recordings</h2>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {recordings?.length || 0} Recordings
            </span>
          </div>

          {recordings && recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((rec, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-gray-200"
                >
                  <CardHeader className="pb-3 bg-gray-50/50 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-semibold text-gray-900">
                          Recording #{index + 1}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {rec.createdAt
                            ? new Date(rec.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })
                            : "Unknown Date"}
                        </p>
                      </div>
                      {rec.location &&
                        (rec.location.lat !== 0 || rec.location.lng !== 0) && (
                          <a
                            href={`https://www.google.com/maps?q=${rec.location.lat},${rec.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            View location ↗
                          </a>
                        )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative bg-black aspect-video">
                      <video
                        src={rec.recordingUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <a
                        href={rec.recordingUrl}
                        download={`sos-recording-${index + 1}.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          Download Video
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">
                No SOS recordings available yet.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Recordings will appear here when the user triggers an SOS.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
