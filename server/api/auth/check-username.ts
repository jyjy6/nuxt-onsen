import { defineEventHandler, readBody } from "h3";
import RegisterModel from "~/server/models/auth/RegisterModel";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { username } = body;

    if (!username) {
      return {
        success: false,
        message: "아이디가 제공되지 않았습니다",
        available: false,
      };
    }

    // 아이디 중복 검사
    const existingUser = await RegisterModel.findOne({ username });

    return {
      success: true,
      available: !existingUser,
      message: existingUser
        ? "이미 사용 중인 아이디입니다"
        : "사용 가능한 아이디입니다",
    };
  } catch (error) {
    console.error("아이디 중복 확인 에러:", error);
    return {
      success: false,
      message: "서버 오류가 발생했습니다",
      available: false,
    };
  }
});
