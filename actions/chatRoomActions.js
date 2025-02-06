"use server";
import jwt from "jsonwebtoken";
import MessageRoom from "../models/messageRoom";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";

export async function fetchUserRooms(token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) throw new Error("Invalid token");

    const userId = decoded.user;
    const user = await User.findById(userId).populate("messageRooms");
    if (!user) throw new Error("User not found");

    const rooms = await MessageRoom.find({ _id: { $in: user.messageRooms } })
      .populate({
        path: "participants",
        select: "username",
      })
      .lean();

    const formattedRooms = rooms.map((room) => {
      const otherParticipant = room.participants.find(
        (participant) => participant._id.toString() !== userId
      );

      return {
        roomId: room._id.toString(), // Convert ObjectId to string
        otherParticipant: otherParticipant ? otherParticipant.username : null,
      };
    });

    return formattedRooms;
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return [];
  }
}

export async function fetchMessages(roomId) {
  try {
    await dbConnect();
    const room = await MessageRoom.findById(roomId)
      .populate("messages.sender", "username")
      .lean();

    if (!room) throw new Error("Room not found");

    return room.messages.map((msg) => ({
      sender: msg.sender._id.toString(), // Convert ObjectId to string
      username: msg.sender.username,
      message: msg.message,
      time: msg.time,
    }));
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
}

export async function sendMessage(roomId, message, token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) throw new Error("Invalid token");

    const user = await User.findById(decoded.user);
    if (!user) throw new Error("User not found");

    const room = await MessageRoom.findById(roomId);
    if (!room) throw new Error("Chat room not found");

    room.messages.push({
      sender: user._id.toString(), // Convert ObjectId to string
      message: message,
      time: new Date().toISOString(),
    });

    await room.save();
    return {
      message: "Message sent successfully",
      success: true,
    };
  } catch (err) {
    console.error("Error sending message:", err);
    return {
      message: "Error sending message",
      success: false,
    };
  }
}

export async function getRoomDetails(roomId) {
  try {
    await dbConnect();
    const room = await MessageRoom.findById(roomId)
      .populate("participants", "username")
      .lean();

    if (!room) throw new Error("Room not found");

    return {
      success: true,
      room: {
        roomId: room._id.toString(),
        participants: room.participants.map((p) => ({
          id: p._id.toString(),
          username: p.username,
        })),
        origin: room.origin.toString(),
      },
    };
  } catch (err) {
    console.error("Error fetching room details:", err);
    return { success: false, error: err.message };
  }
}
