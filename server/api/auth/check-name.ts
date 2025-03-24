import { defineEventHandler, readBody } from "h3";
import RegisterModel from "~/server/models/auth/RegisterModel";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name } = body;

    if (!name) {
      return {
        success: false,
        message: "닉네임이 제공되지 않았습니다",
        available: false,
      };
    }

    // 닉네임 중복 검사
    const existingUser = await RegisterModel.findOne({ name });

    return {
      success: true,
      available: !existingUser,
      message: existingUser
        ? "이미 사용 중인 닉네임입니다"
        : "사용 가능한 닉네임입니다",
    };
  } catch (error) {
    console.error("닉네임 중복 확인 에러:", error);
    return {
      success: false,
      message: "서버 오류가 발생했습니다",
      available: false,
    };
  }
});
