import { defineEventHandler, getQuery } from "h3";
import EpisodeModel from "../../models/episodes";

export default defineEventHandler(async (event) => {
  try {
    const contentsCode = event.context.params?.id;

    if (contentsCode) {
      const episodeList = await EpisodeModel.find({ contentsCode });
      return { success: true, data: episodeList };
    } else {
      return { success: true, data: [] };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
