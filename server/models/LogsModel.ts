import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  ip: { type: String, required: false, default: null },  // null을 기본값으로 처리
  userAgent: { type: String, required: false, default: null },  // null을 기본값으로 처리
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', LogSchema);
