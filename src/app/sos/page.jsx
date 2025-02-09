"use client";
import React, { useState, useEffect } from "react";
import { getUser } from "../../../actions/userActions";
import {
  saveSOSRecording,
  sendInitialTwilioSMS,
} from "../../../actions/sosActions";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "sonner";

import { firebaseConfig } from "../../../utils/firebase";
import { useRouter } from "next/navigation";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

const SOSButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [user, setUser] = useState(null);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [stream, setStream] = useState(null);
  const router = useRouter();
  const startRecording = async () => {
    try {
      const res = await sendInitialTwilioSMS(
        user.username,
        user.currentLocation.lat,
        user.currentLocation.lng
      );
      if (res.success) {
        toast.success("Initial SOS SMS sent successfully");
      } else {
        toast.error(res.error);
      }

      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);

      const recorder = new MediaRecorder(userStream, {
        mimeType: "video/webm",
      });
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const saveRecording = async () => {
        if (chunks.length === 0) return;

        const videoBlob = new Blob(chunks, { type: "video/mp4" });
        const videoFile = new File([videoBlob], `sos_${Date.now()}.webm`);

        const filePath = `sos_videos/${
          user?.username
        }_${Date.now()}_sos_part.mp4`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.info(`Uploading segment: ${progress.toFixed(2)}%`);
          },
          (error) => {
            toast.error("Error uploading video segment: " + error.message);
          },
          async () => {
            const videoUrl = await getDownloadURL(storageRef);
            const res = await saveSOSRecording(
              localStorage.getItem("token"),
              videoUrl
            );

            if (res.success) {
              toast.success("SOS video segment uploaded successfully!");
            } else {
              toast.error(res.error);
            }
          }
        );

        chunks = [];
      };

      recorder.onstop = () => {
        clearInterval(recordingInterval);
        saveRecording();
      };

      recorder.start();

      // Upload every 20 seconds
      const interval = setInterval(() => {
        recorder.stop();
        saveRecording();
        recorder.start();
      }, 20000);

      setRecordingInterval(interval);
      setIsRecording(true);
      setMediaRecorder(recorder);
      toast.success("Recording started...");

      // Auto-stop after 5 minutes
      setTimeout(() => {
        stopRecording();
      }, 5 * 60 * 1000);
    } catch (error) {
      toast.error("Error accessing camera/microphone: " + error.message);
      console.error("Media access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      clearInterval(recordingInterval);
      setIsRecording(false);
      toast.success("Recording stopped.");
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  async function fetchUserInfo() {
    try {
      const res = await getUser(localStorage.getItem("token"));
      if (res.success) {
        setUser(res.user);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        className="w-[250px] h-[250px] bg-red-600 text-white font-bold text-xl rounded-full shadow-lg hover:bg-red-700 transition-all flex items-center justify-center"
        onClick={isRecording ? stopRecording : startRecording}
      >
        <p className="text-4xl">{isRecording ? "Stop" : "Start"}</p>
      </button>
    </div>
  );
};

export default SOSButton;
