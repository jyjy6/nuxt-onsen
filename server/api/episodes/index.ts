import { defineEventHandler, readBody, getQuery } from "h3";
import EpisodeModel from "../../models/episodes";
import { AxiosError } from "axios";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    //랜덤으로 1개의 Episode를 가져오는 함수
    try {
      const randomEpisode = await EpisodeModel.aggregate([
        { $sample: { size: 1 } },
      ]);
      return {
        success: true,
        data: randomEpisode.length ? randomEpisode[0] : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
});
