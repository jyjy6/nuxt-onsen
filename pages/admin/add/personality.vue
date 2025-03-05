<!-- pages/PersonalityForm.vue -->
<template>
  <FormComponent :fields="personalityFields" api-url="/api/personality" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
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
