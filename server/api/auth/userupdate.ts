import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";
import RegisterModel from "../../models/auth/RegisterModel"; // RegisterModel 경로 확인
// server/api/auth/update.ts 또는 관련 파일
import jwt, { JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // 1. 요청 헤더에서 Authorization 토큰 가져오기
    const authHeader = getRequestHeader(event, "Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Authorization token required" };
    }

    // 2. Bearer 접두사 제거하고 토큰 추출
    const token = authHeader.substring(7); // 'Bearer ' 이후의 문자열

    // 3. JWT 토큰 검증 및 디코딩
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET_KEY || ""
    ) as JwtPayload;

    // 4. 디코딩된 토큰에서 userId 추출
    const userId = decoded.userId;
    console.log("수정코드:" + userId);

    if (!userId) {
      return { success: false, message: "Invalid token" };
    }

    // 요청 데이터 읽기
    const body = await readBody(event);

    // 현재 사용자 정보 조회
    const currentUser = await RegisterModel.findById(userId);
    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    interface UpdatedUserData {
      username: string;
      name: string;
      email: string;
      phone: string;
      address: any; // 실제 타입에 맞게 정의
      profileImage: string;
      password?: string; // 선택적 속성으로 정의
    }

    // 변경 불가능한 필드는 기존 값으로 유지
    const updatedData: UpdatedUserData = {
      // username은 변경 불가능 - 기존 값 유지
      username: currentUser.username,
      // 나머지 필드는 요청에서 가져오되, 없으면 기존 값 유지
      name: body.name || currentUser.name,
      email: body.email || currentUser.email,
      phone: body.phone || currentUser.phone,
      address: body.address || currentUser.address,
      profileImage: body.profileImage || currentUser.profileImage,
    };

    // 비밀번호는 변경되었을 경우에만 해시 처리
    if (body.password) {
      // 비밀번호 해시 처리 (bcrypt 등 사용)
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updatedData.password = hashedPassword;
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
    // 민감한 정보 제외하고 응답
    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return {
      success: true,
      message: "User updated successfully",
      user: userWithoutPassword,
    };
  } catch (error) {
    // 토큰 만료 또는 검증 실패 등의 에러 처리
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, message: "Invalid token" };
    } else if (error instanceof jwt.TokenExpiredError) {
      return { success: false, message: "Token expired" };
    }

    console.error("Update user error:", error);
    return { success: false, message: "Failed to update user" };
  }
});
