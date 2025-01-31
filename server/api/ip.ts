export default defineEventHandler((event) => {
  const req = event.node.req;
  const headers = getRequestHeaders(event);

  // 클라이언트 IP 가져오기
  const ip =
    headers["x-forwarded-for"]?.split(",")[0] || // 프록시를 통해 전달된 IP
    headers["cf-connecting-ip"] || // Cloudflare 등의 프록시 IP
    headers["x-real-ip"] || // Nginx 등의 실제 클라이언트 IP
    req.socket?.remoteAddress || // 일반적인 요청의 IP
    null; // 기본값 (못 찾을 경우)

  console.log(`📌 [접속 감지] 클라이언트 IP: ${ip || "알 수 없음"}`);

  return { ip };
});
