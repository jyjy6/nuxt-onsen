import jwt from "jsonwebtoken";
import { useLoginStore } from "~/store/login";

export default defineEventHandler(async (event: any) => {
  // console.log("전체 헤더:", event.req.headers); // 헤더 전체 출력
  if (!event.req.url?.startsWith("/api/test")) {
    return; // API 경로가 아닐 경우 미들웨어 실행하지 않음
  }
  const token = event.req.headers["authorization"]?.split(" ")[1];
  console.log("서버에서 받은 토큰:", token);

  if (!token) {
    console.error("토큰이 없습니다.");
    return { success: false, message: "Token is missing. 인증이 필요합니다." };
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET_KEY as string
    );
    console.log("디코딩된 토큰:", decoded);
    event.req.user = decoded;

    return { success: true, user: decoded, message: "정상토큰" };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("만료된 토큰");
      // 클라이언트가 새 토큰 요청할 수 있도록 401 상태 반환
      event.res.statusCode = 401;
      return { success: false, message: "Token has expired." };
    }
    console.error("유효하지 않은 토큰");
    return { success: false, message: "Invalid token." };
  }
});
