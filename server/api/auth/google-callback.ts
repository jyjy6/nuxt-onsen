// server/api/auth/google/callback.ts
import { defineEventHandler, readBody, getQuery, setCookie } from "h3";
import jwt from "jsonwebtoken";
import RegisterModel from "@/server/models/auth/RegisterModel";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { code } = query;

  if (!code) {
    return { success: false, message: "No authorization code provided" };
  }

  try {
    // Google로 코드 교환하여 액세스 토큰 받기
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code.toString(),
        client_id:
          "223494383653-in3rq3532hghjll1uclub5l57cq1hvt2.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uri: `https://ec2-43-203-220-238.ap-northeast-2.compute.amazonaws.com/api/auth/google-callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return { success: false, message: "Failed to get access token" };
    }

    // 사용자 정보 가져오기
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    if (!userData.email) {
      return { success: false, message: "Could not get user email" };
    }

    // 사용자 DB에서 확인 또는 생성
    let user = await RegisterModel.findOne({ email: userData.email });

    if (!user) {
      // 새 사용자 생성
      user = await RegisterModel.create({
        username: userData.email.split("@")[0] || `user-${Date.now()}`,
        name: userData.name || "",
        email: userData.email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        profileImage: userData.picture,
        role: "user",
        lastLogin: new Date(),
        loginAttempts: 0,
      });
    } else {
      // 기존 사용자 업데이트
      user.lastLogin = new Date();
      await user.save();
    }

    // JWT 액세스 토큰 발급
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_ACCESS_SECRET_KEY || "",
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    // JWT 리프레시 토큰 발급
    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_REFRESH_SECRET_KEY || "",
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // 리프레시 토큰은 HTTP 전용 쿠키에 저장
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30일
    });

    // 로그인에 필요한 사용자 정보
    const loginUserData = {
      userId: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      phone: user.phone,
      address: user.address,
      lastLogin: user.lastLogin,
      premiumUntil: user.premiumUntil,
    };

    // OAuth 완료 페이지로 리다이렉트 (성공 표시 및 창 닫기용)
    return sendRedirect(
      event,
      `/auth/oauth-success?accessToken=${encodeURIComponent(
        accessToken
      )}&userData=${encodeURIComponent(JSON.stringify(loginUserData))}`,
      302
    );
  } catch (error) {
    console.error("OAuth 처리 오류:", error);
    return { success: false, message: "Internal server error" };
  }
});
