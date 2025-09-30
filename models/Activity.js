import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the User collection
    required: true,
  },
  action: {
    type: String,
    enum: ["added", "updated", "deleted", "login", "logout"], // optional, restrict values
    required: true,
  },
  target: {
    type: String, // e.g., "Gmail password", "Facebook account"
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
