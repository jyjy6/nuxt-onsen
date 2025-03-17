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
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>
