"use server";
import dbConnect from "../utils/dbConnect";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function addUser({ username, password, email, phoneNo }) {
  try {
    const validatedData = signupSchema.safeParse({
      username,
      password,
      email,
      phoneNo,
    });
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors.map((err) => err.message).join(", "),
      };
    }

    await dbConnect();

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      return {
        success: false,
        error: "User with this email or phone number already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNo,
    });

    const token = jwt.sign(
      { user: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
