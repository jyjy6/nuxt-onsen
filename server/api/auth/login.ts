// api/auth/login.ts
import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RegisterModel from "../../models/auth/RegisterModel";

export default defineEventHandler(async (event) => {
  // 요청 데이터 읽기
  const body = await readBody(event);
  const { email, password } = body;

  // 유효성 검사
  if (!email || !password) {
    return { success: false, message: "Both email and password are required." };
  }

  try {
    // 이메일로 사용자 찾기
    const user = await RegisterModel.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid credentials." };
    }

    // 비밀번호 비교
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { success: false, message: "Invalid credentials." };
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY as string, // 환경 변수로 JWT 비밀키를 관리해야 합니다.
      { expiresIn: "1h" } // 토큰 유효 기간 1시간
    );

    // 성공 응답
    return {
      success: true,
      message: "Login successful.",
      token,
      user: { userId: user._id, email: user.email, name: user.name },
    };
  } catch (error) {
    // 에러 응답
    return { success: false, message: "Internal server error.", error };
  }
});
