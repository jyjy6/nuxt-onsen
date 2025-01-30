import { defineEventHandler, getHeader } from "h3";
import Log from "../../models/LogsModel";
import requestIp from "request-ip";

export default defineEventHandler(async (event) => {
  try {
    // x-forwarded-for에서 첫 번째 IP를 추출하고, 없으면 requestIp.getClientIp() 또는 remoteAddress 사용
    let ip = requestIp.getClientIp(event.node.req);
    if (!ip || ip === "127.0.0.1") {
      //@ts-ignore
      ip = getHeader(event, "x-forwarded-for")?.split(',')[0]?.trim() || event.node.req.socket.remoteAddress;
    }

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
