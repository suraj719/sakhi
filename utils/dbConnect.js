import mongoose from "mongoose";
const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;
export default async function dbConnect() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected!");
  } catch (err) {
    console.log(err);
  }
}
