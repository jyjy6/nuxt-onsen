import { useLoginStore } from "~/store/login";

const loginStore = useLoginStore();
export default defineNuxtRouteMiddleware(() => {
  if (!loginStore.user || loginStore.user.role !== "admin") {
    alert("운영자 페이지에 마음대로 들어오고 뭐 그러지마세요");
    return navigateTo("/");
  }
});
