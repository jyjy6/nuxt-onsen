import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  contentsCode: { type: String, required: true },
  episode: { type: String, required: true },
  contentsLink: { type: String, required: true },
  omake: { type: String },
  guest: { type: [String] },
  date: { type: String, required: true },
});

export default mongoose.model("Episode", episodeSchema);
