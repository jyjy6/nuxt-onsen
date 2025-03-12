import { defineEventHandler, getQuery } from "h3";
import ContentModel from "../../models/contents";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    const filter: any = {};
    if (query.date) filter.date = query.date;
    if (query.contentsTag) filter.contentsTag = query.contentsTag;

    const contents = await ContentModel.find(filter);

    return { success: true, data: contents };
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
});
