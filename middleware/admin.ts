import { useLoginStore } from "~/store/login";

//  (라우트 미들웨어 - 클라이언트 측)
export default defineNuxtRouteMiddleware(() => {
  const loginStore = useLoginStore();
  if (!loginStore.user || loginStore.user.role !== "admin") {
    alert("운영자 페이지에 마음대로 들어오고 뭐 그러지마세요");
    return navigateTo("/");
  }
});
