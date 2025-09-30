import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  usernameOrEmail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true // This should be encrypted before saving
  },
  url: {
    type: String
  },
  notes: {
    type: String
  },
  category: {
    type: String,
    enum: ["social", "banking", "work", "other"],
    default: "other"
  }
}, { timestamps: true });

const Password = mongoose.model("Password", passwordSchema);
export default Password;
