import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios, { AxiosError } from "axios";
import type { UserInfo } from "~/types/userInfoTypes";

export const useLoginStore = defineStore("login", () => {
  const isLogin = ref(false);
  const user = ref<UserInfo | null>();
  const router = useRouter();

  // ✅ 앱이 실행될 때 로컬 스토리지에서 유저 정보 불러오기
  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
      isLogin.value = true; // 로그인 상태 유지
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean | undefined> => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        const userData = response.data.user;
        user.value = userData;
        isLogin.value = true;

        // ✅ 로컬 스토리지에 저장 (새로고침 시 유지)
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", response.data.accessToken);

        alert("로그인 성공!");
        router.push("/").then(() => window.location.reload());
      } else {
        alert(response.data.message || "로그인 실패!");
      }
      return;
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      user.value = null;
      isLogin.value = false;

      // ✅ 로컬 스토리지 정리 (로그아웃 시 유지 데이터 삭제)
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      router.push("/login");
    }
  };

  // ✅ 컴포넌트에서 `user?.username` 이런 방식으로 쉽게 접근 가능하도록 Getter 제공
  const isAuthenticated = computed(() => isLogin.value);
  const getUser = computed(() => user.value);

  return {
    isLogin,
    user,
    isAuthenticated,
    getUser,
    login,
    logout,
    loadUserFromLocalStorage,
  };
});
