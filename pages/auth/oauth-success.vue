<!-- pages/auth/oauth-success.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
      <h1 class="text-2xl font-bold mb-4">로그인 성공!</h1>
      <p class="mb-4">구글 계정으로 로그인이 완료되었습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // URL 파라미터에서 데이터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const userDataParam = urlParams.get("userData");

  if (accessToken && userDataParam) {
    try {
      // 액세스 토큰과 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", userDataParam);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("로그인 정보 저장 오류:", error);
    }
  }
});
</script>
