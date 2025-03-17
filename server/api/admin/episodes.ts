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

  let body;
  if (method === "POST" || method === "PUT") {
    body = await readBody(event);
  }

  if (method === "POST") {
    try {
      const newEpisode = await EpisodeModel.create(body);
      return { success: true, data: newEpisode };
    } catch (error) {
      return { success: false, error: (error as AxiosError).message };
    }
  }

  if (method === "PUT") {
    try {
      let { _id, ...updateData } = body;
      if (!_id) {
        _id = new mongoose.Types.ObjectId();
      }
      const updatedEpisode = await EpisodeModel.findOneAndUpdate(
        { _id },
        { $set: updateData },
        { upsert: true, new: true } // upsert 적용 + 업데이트된 데이터 반환
      );
      return { success: true, data: updatedEpisode };
    } catch (error) {
      return { success: false, error: (error as AxiosError).message };
    }
  }
});
