<template>
  <FormComponent :fields="noticeFields" apiUrl="/api/notice" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const noticeFields = [
  {
    name: "title",
    label: "제목",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "content",
    label: "내용",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "mainImg",
    label: "이미지 링크",
    type: "text",
    rules: [
      (v: string) => !!v || "필수 입력입니다.",
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
  {
    name: "link",
    label: "팝업 링크",
    type: "text",
    rules: [
      (v: string) => !!v || "필수 입력입니다.",
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
];
</script>
