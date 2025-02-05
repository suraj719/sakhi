"use server";
import dbConnect from "../utils/dbConnect";
import User from "../models/user";

export async function addUser({ username, password, email }) {
  try {
    await dbConnect();

    const user = await User.create({ username, password, email });
    await user.save();

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
export async function getUser() {
  try {
    const users = await User.find({});
    if (!users)
      return {
        success: false,
        error: "No users found",
      };
    return {
      users: users.map((user) => ({
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      })),
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
}
