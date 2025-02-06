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
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
