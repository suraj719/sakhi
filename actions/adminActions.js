"use server";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Markings from "../models/markings";
import dbConnect from "../utils/dbConnect";

// Verify if user is admin
export async function verifyAdmin(token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) {
      return { success: false, error: "Invalid token" };
    }

    const user = await User.findById(decoded.user);
    console.log("Admin verification - User found:", user?.username);
    console.log("Admin verification - isAdmin value:", user?.isAdmin);
    console.log("Admin verification - isAdmin type:", typeof user?.isAdmin);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.isAdmin) {
      console.log("Admin check failed - isAdmin is:", user.isAdmin);
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("Admin verification error:", error);
    return { success: false, error: "Failed to verify admin" };
  }
}

// Get all markings with populated user data
export async function getAllMarkings(status = null) {
  try {
    await dbConnect();
    const query = status ? { status } : {};
    const markings = await Markings.find(query)
      .populate("markedBy", "username email phoneNo")
      .populate("verifiedBy", "username")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(markings)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch markings" };
  }
}

// Get marking statistics
export async function getMarkingStats() {
  try {
    await dbConnect();
    const pending = await Markings.countDocuments({ status: "pending" });
    const approved = await Markings.countDocuments({ status: "approved" });
    const rejected = await Markings.countDocuments({ status: "rejected" });

    return {
      success: true,
      data: {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch statistics" };
  }
}
