"use client";
import { useState, useEffect } from "react";
import {
  PhoneMissed,
  MicOff,
  Volume2,
  Phone,
  PhoneOff,
  MoreVertical,
  PhoneCall,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { IoKeypad } from "react-icons/io5";

export default function FakeCallScreen() {
  const [screen, setScreen] = useState("input"); // 'input', 'incoming', 'active'
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [timer, setTimer] = useState(0);
  const [playRingtone, { stop }] = useSound("/ringtone.mp3", {
    volume: 1,
    loop: false,
  });
  const [playCallConnected] = useSound("/call-connected.mp3", { volume: 0.5 });

  useEffect(() => {
    let ringtoneInterval;

    if (screen === "incoming") {
      const playWithDelay = () => {
        playRingtone();
        ringtoneInterval = setTimeout(playWithDelay, 28000);
      };

      playWithDelay();
    }

    return () => {
      clearTimeout(ringtoneInterval);
      stop();
    };
  }, [screen, playRingtone, stop]);

  useEffect(() => {
    let interval;
    if (screen === "active") {
      playCallConnected();
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [screen, playCallConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-black">
      {screen === "input" && (
        <motion.div
          className="w-[320px] h-[500px] bg-white rounded-xl shadow-lg flex flex-col items-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold">Enter Caller Details</h2>
          <input
            type="text"
            placeholder="Name"
            className="mt-4 p-2 border rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="mt-2 p-2 border rounded w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex gap-4 mt-4">
            <button
              className={`px-4 py-2 rounded ${
                gender === "Male" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => setGender("Male")}
            >
              Male
            </button>
            <button
              className={`px-4 py-2 rounded ${
                gender === "Female" ? "bg-pink-500 text-white" : "bg-gray-300"
              }`}
              onClick={() => setGender("Female")}
            >
              Female
            </button>
          </div>
          <button
            className="mt-6 bg-green-500 text-white px-6 py-2 rounded"
            onClick={() => setScreen("incoming")}
          >
            Create Call
          </button>
        </motion.div>
      )}

      {screen === "incoming" && (
        <motion.div
          className="w-[320px] h-[640px] bg-gray-900 text-white rounded-xl shadow-lg flex flex-col items-center justify-between relative p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <p className="text-lg font-semibold">Incoming Call</p>
            <p className="text-3xl font-bold mt-1">{name || "Suraj"}</p>
            <p className="text-md text-gray-400">{phone || "+91 9392130068"}</p>
          </div>
          <motion.div
            className="flex justify-around w-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <button
              onClick={() => setScreen("input")}
              className="flex flex-col items-center bg-red-600 p-4 rounded-full"
            >
              <PhoneOff size={32} />
            </button>
            <motion.button
              onClick={() => setScreen("active")}
              className="flex flex-col items-center bg-green-600 p-4 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <PhoneCall size={32} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {screen === "active" && (
        <motion.div
          className="w-[320px] h-[640px] bg-gray-900 text-white rounded-xl shadow-lg flex flex-col items-center justify-between p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <p className="text-lg font-semibold">On Call</p>
            <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto my-4 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mt-1">{name || "Suraj"}</p>
            <p className="text-md text-gray-400">{phone || "+91 9392130068"}</p>
            <p className="text-lg mt-2">{formatTime(timer)}</p>
          </div>

          {/* Control Buttons - Properly Aligned */}
          <div className="grid grid-cols-2 gap-6 w-full mt-4">
            <motion.button
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <MicOff size={32} />
              <p className="text-sm mt-1">Mute</p>
            </motion.button>

            <motion.button
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 size={32} />
              <p className="text-sm mt-1">Speaker</p>
            </motion.button>

            <motion.button
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <IoKeypad size={32} />
              <p className="text-sm mt-1">Keypad</p>
            </motion.button>

            <motion.button
              className="flex flex-col items-center"
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical size={32} />
              <p className="text-sm mt-1">Options</p>
            </motion.button>
          </div>

          {/* End Call Button */}
          <motion.button
            className="bg-red-600 p-4 rounded-full mt-4"
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen("input")}
          >
            <PhoneOff size={32} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
