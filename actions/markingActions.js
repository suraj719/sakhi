"use server";

import Markings from "../models/markings";
import dbConnect from "../utils/dbConnect";
import axios from "axios";

// Fetch all markings
export async function getMarkings() {
  await dbConnect();
  try {
    const markings = await Markings.find({});
    return { success: true, data: JSON.parse(JSON.stringify(markings)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch markings" };
  }
}

// Create a new marking
export async function createMarking({ comment, markType, location, userId }) {
  await dbConnect();
  try {
    const newMarking = new Markings({
      comment,
      markType,
      location,
      markedBy: userId,
      status: "pending", // All new markings start as pending
    });
    await newMarking.save();
    return { success: true, data: JSON.parse(JSON.stringify(newMarking)) };
  } catch (error) {
    return { success: false, error: "Failed to create marking" };
  }
}

// Fetch pending markings
export async function getPendingMarkings() {
  await dbConnect();
  try {
    const markings = await Markings.find({ status: "pending" })
      .populate("markedBy", "username email")
      .sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(markings)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch pending markings" };
  }
}

// Fetch approved markings (for map display)
export async function getApprovedMarkings() {
  await dbConnect();
  try {
    const markings = await Markings.find({ status: "approved" });
    return { success: true, data: JSON.parse(JSON.stringify(markings)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch approved markings" };
  }
}

// Update marking status (approve/reject)
export async function updateMarkingStatus(markingId, status, adminId) {
  await dbConnect();
  try {
    const marking = await Markings.findByIdAndUpdate(
      markingId,
      {
        status,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
      { new: true },
    );
    if (!marking) {
      return { success: false, error: "Marking not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(marking)) };
  } catch (error) {
    return { success: false, error: "Failed to update marking status" };
  }
}

// Generate AI summary for a marking
export async function generateAISummary(markingId, location, comment) {
  await dbConnect();
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "API key not configured" };
    }

    const prompt = `You are a safety analyst. A user has reported a location as potentially unsafe or dangerous.

Location: Latitude ${location.lat}, Longitude ${location.lng}
User Comment: "${comment}"

Please provide a brief summary (2-3 sentences) about:
1. Any known safety incidents or concerns at or near this location
2. General safety recommendations for this area

If you don't have specific information about this exact location, provide general safety advice based on the user's concern.`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
      },
    );

    const aiSummary =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate summary";

    // Update the marking with the AI summary
    const marking = await Markings.findByIdAndUpdate(
      markingId,
      { aiSummary },
      { new: true },
    );

    if (!marking) {
      return { success: false, error: "Marking not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(marking)) };
  } catch (error) {
    console.error("AI Summary Error:", error);
    return { success: false, error: "Failed to generate AI summary" };
  }
}
