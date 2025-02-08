"use client";
import React, { useState, useEffect } from "react";
import { getUser } from "../../../actions/userActions";
import { saveSOSRecording } from "../../../actions/sosActions";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration
import { firebaseConfig } from "../../../utils/firebase";

// Initialize Firebase only if not already initialized
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

const SOSButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [user, setUser] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        if (chunks.length === 0) {
          alert("No video recorded. Please try again.");
          return;
        }

        const videoBlob = new Blob(chunks, { type: "video/webm" });
        const videoFile = new File([videoBlob], "sos_video.webm");

        // Upload to Firebase Storage
        const filePath = `sos_videos/${
          user.username
        }_${Date.now()}_sos_video.webm`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            alert("Error uploading video to Firebase: " + error.message);
          },
          async () => {
            const videoUrl = await getDownloadURL(storageRef);

            // Save video URL to database
            const res = await saveSOSRecording(
              localStorage.getItem("token"),
              videoUrl
            );

            if (res.success) {
              alert("SOS video uploaded and saved successfully!");
            } else {
              alert("Failed to save recording URL");
            }
          }
        );
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);

      // Stop recording after 5 minutes
      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      }, 5 * 60 * 1000);
    } catch (error) {
      alert("Error accessing camera/microphone: " + error.message);
      console.error("Media access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  async function fetchUserInfo() {
    try {
      const res = await getUser(localStorage.getItem("token"));
      if (res.success) {
        setUser(res.user);
      } else {
        alert(res.error);
      }
    } catch (err) {
      alert("Failed to fetch user details");
    }
  }

  useEffect(() => {
    fetchUserInfo();
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
