import { defineEventHandler } from "h3";
import MembersModel from "@/server/models/auth/RegisterModel";

export default defineEventHandler(async () => {
  try {
    const members = await MembersModel.find();
    return { success: true, data: members };
  } catch (error) {
    return { success: false, error };
  }
});
