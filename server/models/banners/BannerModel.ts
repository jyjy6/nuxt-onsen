import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mainImg: { type: String, required: true },
  bannerPopup: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
  bannerNumber: { type: Number, required: true },
  selected: { type: Boolean, default: false },
});

export default mongoose.model("Banner", bannerSchema);
