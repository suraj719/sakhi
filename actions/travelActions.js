"use server";
import Travel from "../models/travel";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
export async function createTravel(travelData, token) {
  try {
    await dbConnect();

    const travel = new Travel(travelData);
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.user);
    console.log(user);
    travel.creator = user._id;

    await travel.save();
    return { success: true, travel };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
