import { defineEventHandler, readBody } from "h3";
import BannerModel from "@/server/models/banners/BannerModel";

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (event.method === "GET") {
    try {
      // Get query parameters
      const query = getQuery(event);
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // 필터 조건 빌드
      const filter: any = {};

      // selected 필터링
      if (query.selected !== undefined) {
        filter.selected = query.selected === "true";
      }

      // bannerNumber 필터링
      if (query.bannerNumber !== undefined) {
        filter.bannerNumber = parseInt(query.bannerNumber as string);
      }

      // 필터 적용해서 조회
      const total = await BannerModel.countDocuments(filter);
      const banners = await BannerModel.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);

      return {
        status: 200,
        data: banners,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error fetching banners",
        error,
      };
    }
  }
});
