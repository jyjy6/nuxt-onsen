import { defineEventHandler, readBody } from "h3";
import ContentModel from "../models/contents";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    console.log("Request Body:", body);
    const newContent = await ContentModel.create(body);
    return { success: true, data: newContent };
  } catch (error) {
    return { success: false, error };
  }
});
