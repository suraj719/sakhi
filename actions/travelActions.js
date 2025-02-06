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

    travel.creator = user._id;
    await travel.save();

    return {
      success: true,
      travel: {
        ...travel.toObject(),
        _id: travel._id.toString(),
        creator: travel.creator.toString(),
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getTravels() {
  try {
    await dbConnect();
    const travels = await Travel.find().lean();

    const formattedTravels = travels.map((travel) => ({
      ...travel,
      _id: travel._id.toString(),
      creator: travel.creator?.toString(),
      applications: travel.applications.map((app) => ({
        ...app,
        applicant: app.applicant.toString(),
      })),
    }));

    return { success: true, travels: formattedTravels };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createApplication(travelId, message, token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    const travel = await Travel.findById(travelId);

    travel.applications.push({
      applicant: decoded.user,
      application: message,
    });

    await travel.save();

    return {
      success: true,
      message: "Application submitted! The creator will be notified.",
      travel: {
        ...travel.toObject(),
        _id: travel._id.toString(),
        creator: travel.creator.toString(),
        applications: travel.applications.map((app) => ({
          ...app,
          applicant: app.applicant.toString(),
        })),
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
export async function acceptApplication(travelId, applicationId) {
  try {
    await dbConnect();
    const travel = await Travel.findById(travelId);
    if (!travel) throw new Error("Travel not found");

    const application = travel.applications.find(
      (app) => app._id.toString() === applicationId
    );
    if (!application) throw new Error("Application not found");

    application.status = "accepted";
    await travel.save();

    return {
      success: true,
      message: "Application accepted!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function rejectApplication(travelId, applicationId) {
  try {
    await dbConnect();
    const travel = await Travel.findById(travelId);
    if (!travel) throw new Error("Travel not found");

    const application = travel.applications.find(
      (app) => app._id.toString() === applicationId
    );
    if (!application) throw new Error("Application not found");

    application.status = "rejected";
    await travel.save();

    return {
      success: true,
      message: "Application rejected!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
