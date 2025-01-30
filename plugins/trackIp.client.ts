import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  console.log("trackIp 발동됨1");
  // 클라이언트 사이드에서만 실행되도록
  if (!nuxtApp.ssrContext) {
    console.log("trackIp 발동됨2");

    // POST 요청 보내기
    axios.post("/api/log/post").catch((error) => {
      console.error("Failed to track IP:", error);
    });
  }
});
