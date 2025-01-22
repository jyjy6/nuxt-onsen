// middleware/jwtAuth.ts
import jwt from "jsonwebtoken";

export default async (event: any) => {
  const token = event.req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return { success: false, message: "Token is missing." };
  }

  try {
    // process.env.JWT_SECRET_KEY로 비밀 키를 가져와 JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    event.req.user = decoded; // 사용자 정보 추가
    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, message: "Invalid or expired token." };
  }
};
