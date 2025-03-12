import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  contentsCode: { type: String, required: true },
  episode: { type: String, required: true },
  mainImg: { type: String, required: false },
  episodeName: { type: String, required: true },
  contentsLink: { type: String, required: true },
  omake: { type: String, required: false },
  guest: { type: String, required: false },
  date: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }, // 현재 시간을 기본값으로 설정
});

export default mongoose.model("Episode", episodeSchema);
