import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  contentsName: { type: String, required: true },
  personality: { type: [String], required: true },
  mainImg: { type: String, required: true },
  date: { type: String, required: true },
  info: { type: String, required: false },
});

export default mongoose.model("Content", contentSchema);
