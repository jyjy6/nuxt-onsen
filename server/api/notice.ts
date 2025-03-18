import { defineEventHandler, readBody } from "h3";
import NoticeModel from "../models/notice";

// GET 요청: 모든 공지사항 가져오기
export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    try {
      const notices = await NoticeModel.find()
        .sort({ createdAt: -1 })
        .limit(20);
      return {
        status: 200,
        data: notices,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error fetching notices",
        error,
      };
    }
  }
  // 허용되지 않은 HTTP 메서드 처리
  return {
    status: 405,
    message: "Method Not Allowed",
  };
});
