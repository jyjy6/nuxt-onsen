import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  contentsName: { type: String, required: true },
  personality: { type: [String], required: true },
  mainImg: { type: String, required: true },
});

export default mongoose.model("Content", contentSchema);
