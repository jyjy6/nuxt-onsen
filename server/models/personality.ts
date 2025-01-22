import mongoose from "mongoose";

const personalitySchema = new mongoose.Schema({
  _id: { type: String, required: false },
  personalityName: { type: String, required: true },
  mainImg: { type: String, required: true },
});

export default mongoose.model("Personality", personalitySchema);
