import mongoose from "mongoose";
const travelSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  modeOfTravel: {
    type: String,
    required: true,
  },
  requiredPeople: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  extraInfo: {
    type: String,
    required: false,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    enum: ["open", "closed"],
    default: "open",
  },
  applications: [
    {
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      application: {
        type: String,
        required: true,
      },
    },
  ],
});
const Travel = mongoose.models.Travel || mongoose.model("Travel", userSchema);
export default Travel;
