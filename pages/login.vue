<template>
  <v-container class="py-5">
    <v-card elevation="2" class="pa-5 mx-auto" max-width="500">
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>
      <v-form @submit.prevent="handleLogin">
        <v-text-field
          label="아이디"
          v-model="username"
          type="text"
          required
          outlined
        />
        <v-text-field
          label="비밀번호"
          v-model="password"
          type="password"
          required
          outlined
        />
        <v-btn type="submit" block color="primary" class="mt-4">Login</v-btn>
      </v-form>
      <v-divider class="my-4" />
      <v-btn @click="handleGoogleLogin" class="google-login-btn">
        Google로 로그인
      </v-btn>
      <v-btn block color="secondary" variant="text" @click="navigateToRegister">
        계정이 없으신가요? 회원가입
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "~/store/login";

const username = ref("");
const password = ref("");
const router = useRouter();
const loginStore = useLoginStore();

const handleLogin = async () => {
  const success = await loginStore.login(username.value, password.value);
  if (success) {
    username.value = "";
    password.value = "";
  }
};

const navigateToRegister = () => {
  router.push("/register");
};

// 구글 로그인 버튼 클릭 시 실행되는 함수
async function handleGoogleLogin() {
  try {
    const response = await fetch("/api/auth/google");
    //위의 api요청 -> api/google-callback.ts를거쳐서 -> 홈으로 리다이렉팅됨.
    const data = await response.json(); // JSON 응답 파싱
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Google 로그인 URL이 올바르지 않습니다.", data);
      // 에러 처리
    }
  } catch (error) {
    console.error("Google 로그인 오류:", error);
    // 에러 처리
  }
}
</script>

<style scoped>
.google-login-btn {
  background-color: #db4437;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
}
.v-card {
  text-align: center;
}
</style>
