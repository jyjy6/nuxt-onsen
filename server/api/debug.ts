import { defineEventHandler, getHeader } from "h3";

export default defineEventHandler((event) => {
  const forwardedFor = getHeader(event, "x-forwarded-for");
  const remoteAddr = event.node.req.socket.remoteAddress;

  console.log("🔹 x-forwarded-for:", forwardedFor);
  console.log("🔹 remoteAddress:", remoteAddr);

  return {
    forwardedFor,
    remoteAddr,
  };
});
