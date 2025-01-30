import { defineEventHandler, readBody, setCookie } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RegisterModel from "../../models/auth/RegisterModel";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return { success: false, message: "Both email and password are required." };
  }

  try {
    // 사용자 조회
    const user = await RegisterModel.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid credentials." };
    }

    // 비밀번호 비교
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { success: false, message: "Invalid credentials." };
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET_KEY as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET_KEY as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // 리프레시 토큰을 HttpOnly 쿠키에 저장
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // 응답
    return {
      success: true,
      message: "Login successful.",
      accessToken,  // 액세스 토큰 클라이언트로 전송
      user: { userId: user._id, email: user.email, name: user.name },
    };
  } catch (error) {
    return { success: false, message: "Internal server error.", error };
  }
});
