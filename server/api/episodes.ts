import { defineEventHandler, readBody } from "h3";
import EpisodeModel from "../models/episodes";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const newEpisode = await EpisodeModel.create(body);
    return { success: true, data: newEpisode };
  } catch (error) {
    return { success: false, error };
  }
});
