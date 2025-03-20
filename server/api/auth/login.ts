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
  console.log("로그인시도됨");

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

    // 3.6초 지나면 로그인 시도 횟수 초기화
    if (
      user.loginSuspendedTime &&
      new Date().getTime() - user.loginSuspendedTime.getTime() >= 60 * 60
    ) {
      user.loginSuspendedTime = null;
      user.loginAttempts = 0;
      console.log("로그인 시도 0회로 리셋됨 (3.6초 경과)");
      await user.save(); // 초기화된 값 저장
    }

    // 로그인 시도 5회 초과시 로그인 차단
    if (user.loginAttempts >= 5) {
      console.log("로그인 시도 5회 초과됨");
      return {
        success: false,
        message: "로그인 횟수 5회를 초과했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    // 비밀번호 비교
    const isValid = await bcrypt.compare(
      String(body.password),
      String(user.password)
    );

    if (!isValid) {
      user.loginAttempts++; // 비밀번호가 틀린 경우만 증가
      console.log(`로그인 시도 ${user.loginAttempts}회`);

      // 5회 실패 시 로그인 차단 시간 설정
      if (user.loginAttempts >= 5) {
        user.loginSuspendedTime = new Date();
        console.log("로그인 차단됨: 3초 동안 로그인 불가");
      }

      await user.save();
      event.node.res.statusCode = 401;
      return {
        success: false,
        message: `로그인 실패! 현재 로그인 시도: ${user.loginAttempts}회 (5회 초과 시 30분 차단)`,
      };
    }

    // 로그인 성공 시 초기화
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

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
        premiumUntil: user.premiumUntil,
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
