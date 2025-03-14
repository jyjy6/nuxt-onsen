<template>
  <v-container v-if="!isLoading">
    <FormComponent :fields="contentFields" apiUrl="/api/contents" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

definePageMeta({
  layout: "admin",
});

const personalities = ref<string[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/api/personality");
    if (response.data.success) {
      personalities.value = response.data.data.map(
        (item: { personalityName: string }) => item.personalityName
      );
      // 필드 업데이트
      contentFields.find((field) => field.name === "personality")!.items =
        personalities.value;
    }
  } catch (error) {
    console.error("진행자 목록 가져오기 실패:", error);
  } finally {
    isLoading.value = false;
  }
});

const contentFields = [
  {
    name: "contentsName",
    label: "방송 이름",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "personality",
    label: "진행자 (복수 선택 가능)",
    type: "select",
    items: personalities.value,
    multiple: true,
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "date",
    label: "방송 요일",
    type: "select",
    items: ["月", "火", "水", "木", "金", "土", "日"],
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "contentsTag",
    label: "방송 태그",
    type: "select",
    items: ["新番組", "PREMIUM", "ランキング", "アニメ・ゲーム", "検索"],
    multiple: true,
  },
  {
    name: "mainImg",
    label: "방송 대문 이미지 링크",
    type: "text",
    rules: [
      (v: string) => !!v || "필수 입력입니다.",
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
  {
    name: "info",
    label: "방송 설명",
    type: "text",
  },
];
</script>
