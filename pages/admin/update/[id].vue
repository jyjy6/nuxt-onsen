<template>
  <v-container>
    <FormComponent
      :fields="contentFields"
      :form-data="formData"
      :apiUrl="apiUrl"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import type { Form } from "@/types/formTypes";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const route = useRoute();
const personalities = ref<string[]>([]);
const formData = ref<Form>();
const apiUrl = `/api/admin/contents/${route.params.id}`;

const contentFields = ref([
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
    items: [],
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
  { name: "info", label: "방송 설명", type: "text" },
]);

// 데이터 로딩
onMounted(async () => {
  try {
    // 진행자 목록 불러오기
    const personalityResponse = await axios.get("/api/personality");
    if (personalityResponse.data.success) {
      personalities.value = personalityResponse.data.data.map(
        (item: { personalityName: string }) => item.personalityName
      );
      contentFields.value.find((field) => field.name === "personality")!.items =
        personalities.value;
    }

    // 기존 콘텐츠 데이터 불러오기
    const contentResponse = await axios.get(apiUrl);
    if (contentResponse.data.success) {
      formData.value = { ...contentResponse.data.data }; // formData에 기존 데이터 넣기
    }
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  }
});
</script>
