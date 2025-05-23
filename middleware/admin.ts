import { useLoginStore } from "~/store/login";

const loginStore = useLoginStore();
export default defineNuxtRouteMiddleware(() => {
  if (!loginStore.user || (loginStore.user.role !== "admin" && loginStore.user.role !== "guest")) {
    return navigateTo("/");
  }
});
