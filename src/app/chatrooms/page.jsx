"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserRooms,
  sendMessage,
  fetchMessages,
  getRoomDetails,
} from "../../../actions/chatRoomActions";
import { toast } from "sonner";
import { getUser } from "../../../actions/userActions";

const ChatRooms = () => {
  const [userRooms, setUserRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);

  async function fetchRooms() {
    try {
      const response = await fetchUserRooms(localStorage.getItem("token"));
      setUserRooms(response);
    } catch (error) {
      toast.error("Failed to fetch user rooms");
    }
  }

  async function fetchRoomMessages(roomId) {
    const response = await fetchMessages(roomId);
    setMessages(response);
  }

  async function handleSendMessage() {
    if (newMessage.trim() === "") return;
    try {
      const response = await sendMessage(
        selectedRoom,
        newMessage,
        localStorage.getItem("token")
      );
      if (response.success) {
        toast.success("Message sent successfully");
        setNewMessage("");
        fetchRoomMessages(selectedRoom);
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  }
  async function fetchUser() {
    const response = await getUser(localStorage.getItem("token"));
    setUser(response.user);
  }
  async function fetchRoomDetails() {
    try {
      const response = await getRoomDetails(selectedRoom);
      if (response.success) {
        setRoomDetails(response.room);
      }
    } catch (err) {
      toast.error("Failed to fetch room details");
    }
  }

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomMessages(selectedRoom);
      fetchRoomDetails();
      const interval = setInterval(() => fetchRoomMessages(selectedRoom), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRoom]);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Chat Rooms */}
      <div className="w-1/4 border-r p-4">
        <h2 className="text-lg font-bold">Chat Rooms</h2>
        <div className="space-y-2">
          {userRooms.map((room) => (
            <div
              key={room.roomId}
              className={`p-2 cursor-pointer border rounded-lg ${
                selectedRoom === room.roomId ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedRoom(room.roomId)}
            >
              {room.title} {room.participantCount}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Messages */}
      <div className="w-3/4 p-4 flex flex-col h-full">
        {selectedRoom ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-bold mb-4">Chat</h2>

            {roomDetails &&
              roomDetails.participants.map((participant) => (
                <div
                  key={participant.userId}
                  className="flex items-center mb-2"
                >
                  <p>{participant.username}</p>
                </div>
              ))}
            <div className="flex-1 overflow-y-auto border p-4">
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg max-w-xs ${
                      msg.sender === user._id
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-300 self-start"
                    }`}
                  >
                    <p>{msg.username}</p>
                    {msg.message}
                  </div>
                ))}
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a chat room to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatRooms;
