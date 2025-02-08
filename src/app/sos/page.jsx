"use client";
import React, { useState, useEffect } from "react";
import { getUser } from "../../../actions/userActions";

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

      recorder.onstop = () => {
        if (chunks.length === 0) {
          alert("No video recorded. Please try again.");
          return;
        }

        const videoBlob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${user.username}_${Date.now()}_sos_video.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);

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
      setUser(res.user);
      if (!res.success) {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to fetch user details");
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
        <p className="text-4xl"> {isRecording ? "Stop" : "Start"}</p>
      </button>
    </div>
  );
};

export default SOSButton;
