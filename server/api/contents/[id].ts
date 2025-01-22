import { defineEventHandler, readBody } from "h3";
import ContentModel from "../../models/contents";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id; // URL에서 ID 추출

  if (!id) {
    return { success: false, error: "ID is required" };
  }

  // HTTP 메서드에 따라 분기 처리
  if (event.req.method === "GET") {
    // GET 요청: 콘텐츠 조회
    try {
      const content = await ContentModel.findById(id);
      if (!content) {
        throw new Error("Content not found");
      }
      return { success: true, data: content };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Unknown error occurred" };
    }
  } else if (event.req.method === "PUT") {
    // PUT 요청: 콘텐츠 수정
    try {
      const body = await readBody(event); // 요청 본문 데이터 읽기
      const updatedContent = await ContentModel.findByIdAndUpdate(id, body, {
        new: true, // 업데이트된 데이터 반환
        runValidators: true, // Mongoose 유효성 검사
      });

      if (!updatedContent) {
        throw new Error("Content not found");
      }

      return { success: true, data: updatedContent };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Unknown error occurred" };
    }
  } else {
    // 지원되지 않는 메서드
    return { success: false, error: "Method not allowed" };
  }
});
