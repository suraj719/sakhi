"use server";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Novu } from "@novu/api";

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

    const result = await sendSOSNotification(
      user.username,
      user.currentLocation.lat,
      user.currentLocation.lng,
      recordingUrl
    );

    return result;
  } catch (error) {
    console.error("Error saving SOS recording URL:", error);
    return { success: false, error: "Failed to save recording URL" };
  }
}

const novu = new Novu({
  secretKey: process.env.NEXT_PUBLIC_NOVU_SECRET_KEY,
});

export async function sendSOSNotification(username, lat, lng, recordingUrl) {
  try {
    const response = await novu.trigger({
      workflowId: "sakhi",
      to: {
        subscriberId: "6807cf2cfcff1051b4952aeb",
        phone: "+91 9392130068",
      },
      payload: {
        name: username,
        location: `https://maps.google.com/?q=${lat},${lng}`,
        recording: recordingUrl || "",
      },
    });

    return { success: true, response };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export async function sendInitialSMS(username, lat, lng) {
  try {
    const response = novu.trigger({
      workflowId: "sakhi-initial",
      to: {
        subscriberId: "6807cf2cfcff1051b4952aeb",
        phone: "+91 9392130068",
      },
      payload: {
        name: username,
        location: `https://maps.google.com/?q=${lat},${lng}`,
      },
    });
    return { success: true, response };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
