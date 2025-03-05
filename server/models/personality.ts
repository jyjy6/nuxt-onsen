import mongoose from "mongoose";

const personalitySchema = new mongoose.Schema({
  personalityName: { type: String, required: true },
  mainImg: { type: String, required: true },
});

export default mongoose.model("Personality", personalitySchema);
