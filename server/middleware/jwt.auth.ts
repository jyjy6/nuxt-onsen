import jwt from "jsonwebtoken";

//이 코드는 미들웨어를 활용한 테스트코드로 실제 토큰관리는 api/auth/refresh-token.ts를 거쳐서함 (plugins/axios.ts 인터셉터에서 검증후 ->refresh-token.ts에서 토큰을 생성)
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
