<template>
  <v-container class="py-5">
    <v-card elevation="2" class="pa-5 mx-auto" max-width="500">
      <v-card-title>Login</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>
      <v-form @submit.prevent="handleLogin">
        <v-text-field
          label="Email"
          v-model="email"
          type="email"
          required
          outlined
        />
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
          required
          outlined
        />
        <v-btn type="submit" block color="primary" class="mt-4">Login</v-btn>
      </v-form>
      <v-divider class="my-4" />
      <v-btn block color="secondary" variant="text" @click="navigateToRegister">
        Don't have an account? Register
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const email = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post("/api/auth/login", {
      email: email.value,
      password: password.value,
    });
    

    if (response.data.success && response.data.accessToken) {
      // 액세스 토큰 저장 (예: localStorage)
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const decodedToken = jwtDecode(response.data.accessToken);
      const expirationTime = decodedToken.exp; // 만료 시간 (Unix timestamp)

      alert("로그인 성공!");
      router.push("/").then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  }
};

const navigateToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>
