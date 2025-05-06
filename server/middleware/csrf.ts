import { defineEventHandler, getCookie, sendError } from "h3";

// 이 코드는 미들웨어 composable/useSecureApi.ts에서 이미 쿠키로 csrf토큰 검증하는방식을 사용하고있어서
// 사실필요없음 학습용. 이 미들웨어방식은 경로제외할곳이 많아서 귀찮기도하고
// 하지만 쿠키확인하는방식은 useSecureApi에서 만들어놓은 securePost securePut 등의 함수를 사용해야함

export default defineEventHandler((event) => {
  if (
    !event.path.startsWith("/api/") ||
    event.path.startsWith("/api/upload") ||
    event.path.startsWith("/api/auth/login") ||
    event.path.startsWith("/api/auth/logout") ||
    event.path.startsWith("/api/auth/refresh-token") ||
    event.path.startsWith("/api/auth/guest")
  ) {
    return; //위 API경로는 CSRF 검증 제외
  }
  //겟요청은 무시
  if (["GET", "HEAD", "OPTIONS"].includes(event.method || "")) {
    return;
  }

  // 1️⃣ 요청 헤더에서 X-CSRF-Token 가져오기
  const csrfHeader = event.node.req.headers["x-csrf-token"];

  // 2️⃣ 쿠키에서 저장된 CSRF 토큰 가져오기
  const csrfCookie = getCookie(event, "csrf-token");

  // 3️⃣ 쿠키와 헤더 값이 다르면 CSRF 공격 가능성 있음 → 차단
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "CSRF 검증 실패",
      })
    );
  }
});
