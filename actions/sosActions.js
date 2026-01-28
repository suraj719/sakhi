"use server";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { Novu } from "@novu/api";

export async function saveSOSRecording(token, recordingUrl, location) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);

    const user = await User.findById(decoded.user);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.sosrecording.push({
      recordingUrl,
      createdAt: new Date(),
      location: location || { lat: 0, lng: 0 },
    });
    await user.save();

    const result = await sendSOSNotification(user, recordingUrl);

    return result;
  } catch (error) {
    console.error("Error saving SOS recording URL:", error);
    return { success: false, error: "Failed to save recording URL" };
  }
}

const novu = new Novu({
  secretKey: process.env.NEXT_PUBLIC_NOVU_SECRET_KEY,
});

export async function sendSOSNotification(user, recordingUrl) {
  const { username, currentLocation, wellwishers = [] } = user;

  for (const wellwisher of wellwishers) {
    if (
      wellwisher.phoneNo &&
      /^\+\d{1,4}\s\d{6,15}$/.test(wellwisher.phoneNo)
    ) {
      const payload = {
        name: username,
        location: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`,
        recording: recordingUrl || "",
      };
      await sendMessage(
        user._id.toString() + wellwisher.nickname,
        wellwisher.phoneNo,
        payload,
      );
    }
  }

  return { success: true };
}

export async function sendInitialSMS(user) {
  const { username, currentLocation, wellwishers = [] } = user;
  for (const wellwisher of wellwishers) {
    if (
      wellwisher.phoneNo &&
      /^\+\d{1,4}\s\d{6,15}$/.test(wellwisher.phoneNo)
    ) {
      const payload = {
        name: username,
        location: `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`,
      };
      await sendMessage(
        user._id.toString() + wellwisher.nickname,
        wellwisher.phoneNo,
        payload,
      );
    }
  }

  return { success: true };
}

export async function sendMessage(subscriberId, phone, payload) {
  try {
    const response = novu.trigger({
      workflowId: payload.recording ? "sakhi" : "sakhi-initial",
      to: {
        subscriberId,
        // email:user.email,
        phone,
      },
      payload,
    });
    return { success: true, response };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
