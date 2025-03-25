// server/api/user/update.ts
import { defineEventHandler, readBody, getRequestHeader } from "h3";
import bcrypt from "bcryptjs";
import RegisterModel from "../../models/auth/RegisterModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminUpdateUserData, UpdateUserData } from "~/types/userInfoTypes";

export default defineEventHandler(async (event) => {
  try {
    // 1. 요청 헤더에서 Authorization 토큰 가져오기
    const authHeader = getRequestHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Authorization token required" };
    }

    // 2. Bearer 접두사 제거하고 토큰 추출
    const token = authHeader.substring(7);

    // 3. JWT 토큰 검증 및 디코딩
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET_KEY || ""
      ) as JwtPayload;
    } catch (error) {
      console.error("JWT 검증 오류:", error);
      return { success: false, message: "Invalid token" };
    }

    // 4. 디코딩된 토큰에서 userId 추출
    const userId = decoded.userId;
    console.log(userId);
    if (!userId) {
      return { success: false, message: "Invalid token" };
    }

    // 요청 데이터 읽기
    const body = (await readBody(event)) as UpdateUserData;

    // 현재 사용자 정보 조회
    const currentUser: AdminUpdateUserData | null =
      await RegisterModel.findById(userId);
    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    //악질유저가 프론트에서 제한한 닉네임 중복 뚫고 보냈을시
    const alreadyName = await RegisterModel.findByName(body.name as string);
    if (alreadyName && alreadyName?._id != userId) {
      return {
        success: false,
        message: "뭐 맘대로 개발자도구만져서 닉네임 바꾸고 그러지 마세요",
      };
    }

    // 변경 불가능한 필드는 기존 값으로 유지하고, 업데이트할 데이터 준비
    const updatedData: UpdateUserData = {
      // username은 변경 불가능 - 기존 값 유지
      name: body.name || currentUser.name,
      email: body.email || currentUser.email,
      phone: body.phone || currentUser.phone || "",
      address: {
        country: body.address?.country || currentUser.address?.country || "",
        mainAddress:
          body.address.mainAddress || currentUser?.address.mainAddress,
        subAddress:
          body.address?.subAddress || currentUser.address?.subAddress || "",
      },
      profileImage: body.profileImage || currentUser.profileImage,
    };

    // 비밀번호는 변경되었을 경우에만 해시 처리
    if (body.password) {
      updatedData.password = await bcrypt.hash(body.password, 10);
    }

    // 데이터 업데이트
    const updatedUser = await RegisterModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, message: "User update failed" };
    }

    return {
      success: true,
      message: "User updated successfully",
      user: {
        userId: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        phone: updatedUser.phone,
        address: updatedUser.address,
        lastLogin: updatedUser.lastLogin,
        premiumUntil: updatedUser.premiumUntil,
      },
    };
    
  } catch (error) {
    // 토큰 관련 에러 처리
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, message: "Invalid token" };
    } else if (error instanceof jwt.TokenExpiredError) {
      return { success: false, message: "Token expired" };
    }

    console.error("Update user error:", error);
    return { success: false, message: "Failed to update user" };
  }
});
