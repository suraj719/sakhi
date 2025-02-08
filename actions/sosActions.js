"use server";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import User from "../models/user";
export async function saveSOSRecording(token, recordingUrl) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);

    const user = await User.findById(decoded.user);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.sosrecording.push({ recordingUrl });
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Error saving SOS recording URL:", error);
    return { success: false, error: "Failed to save recording URL" };
  }
}
