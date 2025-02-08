import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  messageRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageRoom",
    },
  ],
  wellwishers: [
    {
      nickname: {
        type: String,
        required: true,
      },
      passcode: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        default: "",
      },
      phoneNo: {
        type: String,
        default: "",
      },
    },
  ],
  sosrecording: [
    {
      recordingUrl: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
