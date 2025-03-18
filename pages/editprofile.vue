<template>
  <RegisterFormComponent
    v-if="userData"
    :fields="emptyFields"
    :formData="userData"
    :isPut="true"
    apiURL="/api/auth/userupdate"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useLoginStore } from "~/store/login";

const loginStore = useLoginStore();
const emptyFields = ref({
  username: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  profileImage: "",
  address: {
    country: "",
    mainAddress: "",
    subAddress: "",
  },
});

const userData = computed(() => loginStore.user);
</script>
