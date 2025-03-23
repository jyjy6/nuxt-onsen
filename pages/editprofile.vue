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
import { ref, computed, onMounted } from "vue";
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

// 깊은 복사본 생성
const userData = ref(null);

onMounted(() => {
  // 컴포넌트가 마운트될 때 스토어의 데이터를 복사
  userData.value = JSON.parse(JSON.stringify(loginStore.user));
});
</script>
