import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mainImg: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Notice", noticeSchema);
