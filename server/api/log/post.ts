import { defineEventHandler, getHeader } from "h3";
import Log from "../../models/LogsModel";
import requestIp from "request-ip";

export default defineEventHandler(async (event) => {
  try {
    // ✅ 헤더에서 직접 IP 추출 (계층화된 프록시 고려)
    const xRealIp = getHeader(event, "x-real-ip");
    const xForwardedFor = getHeader(event, "x-forwarded-for");

    // 최종 IP 결정
    let ip = xRealIp || xForwardedFor?.split(",")[0]?.trim();

    // Docker 내부 IP가 감지되면 remoteAddress 사용
    if (ip?.startsWith("172.")) {
      ip = event.node.req.socket.remoteAddress;
    }

    console.log("[Debug] Final IP:", ip);

    const userAgent = getHeader(event, "user-agent");

    // 로그 저장
    const newLog = new Log({ ip, userAgent });
    await newLog.save();

    return { success: true, message: "Log saved successfully" };
  } catch (error) {
    console.error("Error saving log:", error);
    return { success: false, message: "Failed to save log" };
  }
});
