import { defineEventHandler } from "h3";
import Log from "../../models/LogsModel";

export default defineEventHandler(async () => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { success: false, message: "Failed to fetch logs" };
  }
});
