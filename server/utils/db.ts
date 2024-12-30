import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb+srv://juneyoung6:1q2w3e4r!@cluster0.ewcqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;