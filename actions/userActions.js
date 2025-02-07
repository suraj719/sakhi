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
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "7d" }
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

export async function loginUser({ type, slug, password }) {
  try {
    await dbConnect();
    let user;

    if (type === "email") {
      user = await User.findOne({ email: slug }).lean();
    } else if (type === "phoneNo") {
      user = await User.findOne({ phoneNo: slug }).lean();
    } else {
      user = await User.findOne({ username: slug }).lean();
    }

    if (!user) return { success: false, error: "User not found" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { success: false, error: "Invalid credentials" };

    const token = jwt.sign(
      { user: user._id.toString() },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "7d" }
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
    return { success: false, error: err.message };
  }
}

export async function getUser(token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.user).lean();

    if (!user) return { success: false, error: "User not found" };

    return {
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
