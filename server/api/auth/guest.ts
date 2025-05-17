import { defineEventHandler, readBody } from "h3";
import RegisterModel from "../../models/auth/RegisterModel"; // RegisterModel 경로 확인
import { AxiosError } from "axios";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {


  try {
    // 새 사용자 생성
    // 랜덤한 숫자 생성 (현재 시간을 기반으로)
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000000).toString();
    
    const newUser = await RegisterModel.create({
      username: `guest_${timestamp}_${randomNum}`,
      name: `Guest User ${randomNum}`,
      email: `guest_${timestamp}_${randomNum}@example.com`,
      password: `guest_${timestamp}_${randomNum}`,
      lastLogin: new Date(),
      role: "guest",
    });

    const accessToken = jwt.sign(
        { userId: newUser._id, username: newUser.username, role: newUser.role },
        process.env.JWT_ACCESS_SECRET_KEY || "",
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { userId: newUser._id, username: newUser.username, role: newUser.role },
        process.env.JWT_REFRESH_SECRET_KEY || "",
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    setCookie(event, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        domain:
        process.env.NODE_ENV === "production"
            ? process.env.AUTH_ORIGIN
            : "",
    });
    

    // 성공 응답 (보안 상 password는 반환하지 않음)
    return {
      success: true,
      message: "User save successfully.",
      accessToken,
      user: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("User save error:", error);
    return {
      success: false,
      message: "Internal server error.",
      error: (error as AxiosError).message,
    };
  }
});
