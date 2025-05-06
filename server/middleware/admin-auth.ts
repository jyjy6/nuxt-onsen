import jwt, { JwtPayload } from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // admin API 요청인지 확인 (예: /api/admin/로 시작하는 경로)
  if (url.pathname.startsWith("/api/admin/")) {
    // 토큰 가져오기
    const token = getRequestHeader(event, "authorization")?.split(" ")[1];
    console.log("토큰");
    console.log(token);


    if (!token) {
      return createError({
        statusCode: 401,
        message: "인증이 필요합니다.",
      });
    }

    try {
      // 토큰 검증
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET_KEY as string
      ) as JwtPayload;

      console.log(decoded.role)
      // admin 권한 확인
      if (decoded.role !== "admin" && decoded.role !== "guest") {
        return createError({
          statusCode: 403,
          message: "관리자 권한이 필요합니다.",
        });
      }
      // 토큰에서 얻은 사용자 정보를 이벤트에 추가
      event.context.auth = decoded;
      
    } catch (error) {
      return createError({
        statusCode: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
  }
});
