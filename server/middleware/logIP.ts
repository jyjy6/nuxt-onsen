export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event);

  const ip =
    headers["x-forwarded-for"]?.split(",")[0] || // 프록시 환경에서 원본 IP
    headers["cf-connecting-ip"] || // Cloudflare 같은 서비스 사용 시
    headers["x-real-ip"] || // 일부 서버에서 직접 설정
    event.node.req.socket.remoteAddress; // 기본 요청 IP

  console.log(`[접속 감지] 클라이언트 IP: ${ip}`);
});
