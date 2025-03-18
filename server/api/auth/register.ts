import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";
import RegisterModel from "../../models/auth/RegisterModel"; // RegisterModel 경로 확인
import { AxiosError } from "axios";

export default defineEventHandler(async (event) => {
  // 요청 데이터 읽기
  const body = await readBody(event);
  const {
    username,
    name,
    email,
    password,
    phone,
    address,
    profileImage,
    role,
  } = body;

  // 유효성 검사
  if (!username || !name || !email || !password) {
    return { success: false, message: "All required fields must be filled." };
  }

  try {
    // 이메일 또는 사용자명 중복 확인
    const existingUser = await RegisterModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return { success: false, message: "Username or email is already taken." };
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const newUser = await RegisterModel.create({
      username,
      name,
      email,
      password: hashedPassword,
      phone: phone || null, // 값이 없으면 null 저장
      address: address || {}, // 값이 없으면 빈 객체 저장
      profileImage: profileImage || undefined, // 기본값 유지
      role: role || "user",
      lastLogin: null,
      loginAttempts: 0,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    // 성공 응답 (보안 상 password는 반환하지 않음)
    return {
      success: true,
      message: "User save successfully.",
      data: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        profileImage: newUser.profileImage,
        role: newUser.role,
        status: newUser.status,
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
