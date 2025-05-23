import { defineEventHandler, getCookie, setCookie } from "h3";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, "refreshToken");

    console.log("리프레시토큰:");
    console.log(refreshToken);
    if (!refreshToken) {
      return { success: false, message: "Refresh token is missing." };
    }

    // 리프레시 토큰 검증
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY as string
    ) as any;
    console.log(decoded);

    // 새 액세스 토큰 생성
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.JWT_ACCESS_SECRET_KEY as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    console.log("새 액세스토큰 생성됨.");

    return {
      success: true,
      accessToken,
      message: "리프레시 토큰있음",
    };
  } catch (error) {
    return { success: false, message: "Invalid or expired refresh token." };
  }
});
