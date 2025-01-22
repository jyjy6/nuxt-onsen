import { defineEventHandler } from "h3";
import ContentModel from "../../models/contents";

export default defineEventHandler(async () => {
  try {
    const contents = await ContentModel.find();
    return { success: true, data: contents };
  } catch (error) {
    return { success: false, error };
  }
});
