import { defineEventHandler, readBody, setCookie } from "h3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import RegisterModel from "../../models/auth/RegisterModel";
import dotenv from "dotenv";

dotenv.config();

interface LoginBody {
  username: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginBody>(event);

    if (!body.username || !body.password) {
      return { success: false, message: "이메일과 비밀번호가 필요합니다." };
    }

    const user = await RegisterModel.findOne({ username: body.username });

    if (!user) {
      event.node.res.statusCode = 401;
      return { success: false, message: "인증 실패" };
    }

    try {
      const isValid = await bcrypt.compare(
        String(body.password),
        String(user.password)
      );

      if (!isValid) {
        event.node.res.statusCode = 401;
        return { success: false, message: "인증 실패" };
      }
    } catch (bcryptError) {
      console.error("비밀번호 검증 에러:", bcryptError);
      return { success: false, message: "비밀번호 검증 실패" };
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_ACCESS_SECRET_KEY || "",
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_REFRESH_SECRET_KEY || "",
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return {
      success: true,
      message: "로그인 성공",
      accessToken,
      user: {
        userId: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        lastLogin: user.lastLogin,
      },
    };
  } catch (error: any) {
    console.error("로그인 에러:", error?.message);
    return {
      success: false,
      message: "서버 에러",
    };
  }
});
