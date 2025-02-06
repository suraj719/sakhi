"use server";
import Travel from "../models/travel";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import MessageRoom from "../models/messageRoom";
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
    const travels = await Travel.find()
      .populate("creator", "username")
      .populate("applications.applicant", "username")
      .lean();

    const formattedTravels = travels.map((travel) => ({
      ...travel,
      _id: travel._id.toString(),
      creator: {
        _id: travel.creator?._id.toString(),
        username: travel.creator?.username || "Unknown",
      },
      applications: travel.applications.map((app) => ({
        _id: app._id.toString(),
        applicant: {
          _id: app.applicant?._id.toString(),
          username: app.applicant?.username || "Unknown",
        },
        application: app.application,
        status: app.status,
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
    await dbConnect(); // Ensure DB connection

    const travel = await Travel.findById(travelId).populate(
      "applications.applicant"
    );
    if (!travel) throw new Error("Travel not found");

    const application = travel.applications.find(
      (app) => app._id.toString() === applicationId
    );
    if (!application) throw new Error("Application not found");

    application.set("status", "accepted");
    await travel.save();

    const messageRoom = await MessageRoom.create({
      participants: [travel.creator, application.applicant],
      origin: travel._id.toString(),
    });

    const creator = await User.findById(travel.creator);
    const applicant = await User.findById(application.applicant);

    if (!creator || !applicant) throw new Error("User not found");

    creator.set("messageRooms", [...creator.messageRooms, messageRoom._id]);
    applicant.set("messageRooms", [...applicant.messageRooms, messageRoom._id]);

    await creator.save();
    await applicant.save();

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
