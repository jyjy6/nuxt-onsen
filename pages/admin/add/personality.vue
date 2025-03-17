<!-- pages/PersonalityForm.vue -->
<template>
  <FormComponent :fields="personalityFields" apiUrl="/api/personality" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});
const router = useRouter();
const personalityFields = [
  {
    name: "personalityName",
    label: "진행자 이름",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  { name: "mainImg", label: "진행자 이미지", type: "text" },
];
</script>
