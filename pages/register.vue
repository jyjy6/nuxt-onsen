<template>
  <v-container class="py-5">
    <v-card elevation="2" class="pa-5 mx-auto" max-width="500">
      <v-card-title>Register</v-card-title>
      <v-card-subtitle>Create your account</v-card-subtitle>
      <v-form @submit.prevent="handleRegister">
        <v-text-field label="Name" v-model="name" required outlined />
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
        <v-btn type="submit" block color="primary" class="mt-4">Register</v-btn>
      </v-form>
      <v-divider class="my-4" />
      <v-btn block color="secondary" variant="text" @click="navigateToLogin">
        Already have an account? Login
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const name = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await axios.post("/api/auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    // Redirect to login page after successful registration
    alert("Registration successful! Please login.");
    router.push("/login");
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Registration failed. Please try again.");
  }
};

const navigateToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>
