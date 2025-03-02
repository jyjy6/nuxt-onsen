import { defineEventHandler, readBody } from "h3";
import bcrypt from "bcryptjs";
import RegisterModel from "../../models/auth/RegisterModel"; // RegisterModel 경로 확인

export default defineEventHandler(async (event) => {
  // 요청 데이터 읽기
  const body = await readBody(event);
  const { name, email, password } = body;

  // 유효성 검사
  if (!name || !email || !password) {
    return { success: false, message: "All fields are required." };
  }

  try {
    // 이메일 중복 확인
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const newUser = await RegisterModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 성공 응답
    return {
      success: true,
      message: "User registered successfully.",
      data: {
        name: newUser.name,
        email: newUser.email,
      },
    };
  } catch (error) {
    // 에러 응답
    return { success: false, message: "Internal server error.", error };
  }
});
