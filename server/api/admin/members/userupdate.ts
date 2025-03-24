// server/api/admin/user/update.ts
import { defineEventHandler, readBody, getRequestHeader } from "h3";
import bcrypt from "bcryptjs";
import RegisterModel from "~/server/models/auth/RegisterModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AdminUpdateUserData } from "~/types/userInfoTypes";

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
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET_KEY || ""
    ) as JwtPayload;

    // 4. 디코딩된 토큰에서 userId 및 role 추출
    const adminId = decoded.userId;
    const adminRole = decoded.role;
    console.log("운영자아이디:" + adminId);
    console.log("운영자롤:");
    console.log(decoded.role);

    if (!adminId) {
      return { success: false, message: "Invalid token" };
    }

    // 관리자 권한 확인
    if (adminRole !== "admin" && adminRole !== "superadmin") {
      return { success: false, message: "Unauthorized access" };
    }

    // 요청 데이터 읽기
    const body = (await readBody(event)) as AdminUpdateUserData;
    console.log("요청데이터");
    console.log(body);

    if (!body._id) {
      return { success: false, message: "User ID is required" };
    }

    // 대상 사용자 정보 조회
    const targetUser = await RegisterModel.findById(body._id);
    if (!targetUser) {
      return { success: false, message: "Target user not found" };
    }

    console.log("타겟유저");
    console.log(targetUser);
    // 업데이트할 데이터 준비
    const updatedData: any = {
      // username은 변경 불가능 - 기존 값 유지
      username: targetUser.username,
      name: body.name || targetUser.name,
      email: body.email || targetUser.email,
      phone: body.phone || targetUser.phone || "",
      address: body.address || targetUser.address || {},
      profileImage: body.profileImage || targetUser.profileImage,
    };
    console.log("업뎃데이터");
    console.log(updatedData);

    // 운영자 전용 필드 업데이트
    if (body.role) updatedData.role = body.role;
    if (body.premiumUntil) updatedData.premiumUntil = body.premiumUntil;
    // 비밀번호는 변경되었을 경우에만 해시 처리
    if (body.password) {
      updatedData.password = await bcrypt.hash(body.password, 10);
    }

    // 데이터 업데이트
    const updatedUser = await RegisterModel.findByIdAndUpdate(
      body._id, // 여기서는 특정 사용자 ID를 사용
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { success: false, message: "User update failed" };
    }

    // 민감한 정보 제외하고 응답
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return {
      success: true,
      message: "User updated successfully by admin",
      user: userWithoutPassword,
    };
  } catch (error) {
    // 토큰 관련 에러 처리
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, message: "Invalid token" };
    } else if (error instanceof jwt.TokenExpiredError) {
      return { success: false, message: "Token expired" };
    }

    console.error("Admin update user error:", error);
    return { success: false, message: "Failed to update user" };
  }
});
