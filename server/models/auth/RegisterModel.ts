import mongoose from "mongoose";

const registerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    phone: { type: String },
    address: {
      country: String,
      mainAddress: String,
      subAddress: String,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "withdrawal"],
      default: "active",
    },
    role: { type: String, enum: ["user", "admin", "premium"], default: "user" },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    resetPasswordToken: { String },
    resetPasswordExpire: { Date },
  },
  { timestamps: true }
);

export default mongoose.model("Register", registerSchema);
