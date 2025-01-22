import { defineEventHandler, getQuery } from "h3";
import ContentModel from "../../models/contents";

export default defineEventHandler(async (event) => {
  const query = getQuery(event); // 쿼리 파라미터 읽기

  try {
    console.log("Request Query:", query);
    const contents = await ContentModel.find({ date: query.date }); // date에 맞는 데이터 찾기
    return { success: true, data: contents }; // 찾은 데이터를 반환
  } catch (error) {
    return { success: false, error };
  }
});
