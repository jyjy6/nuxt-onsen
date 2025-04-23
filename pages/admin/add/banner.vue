<template>
  <FormComponent :fields="bannerFileds" apiUrl="/api/admin/banners" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const bannerNumber = [1, 2];

const bannerFileds = [
  {
    name: "title",
    label: "제목",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "mainImg",
    label: "배너 이미지 링크",
    type: "text",
    rules: [
      (v: string) => !!v || "필수 입력입니다.",
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
  {
    name: "bannerPopup",
    label: "팝업 링크",
    type: "text",
    rules: [
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
  {
    name: "bannerNumber",
    label: "몇번째 배너로 사용하실껀가요?",
    type: "select",
    items: bannerNumber,
    rules: [(v: number) => !!v || "필수 입력입니다."],
  },
];
</script>
