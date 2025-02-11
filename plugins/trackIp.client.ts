import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  // 클라이언트 사이드에서만 실행되도록
  if (!nuxtApp.ssrContext) {
    // POST 요청 보내기
    axios.post("/api/log/post").catch((error) => {
      console.error("Failed to track IP:", error);
    });
  }
});
