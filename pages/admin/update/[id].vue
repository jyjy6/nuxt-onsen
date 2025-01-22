<template>
  <v-container>
    <v-form v-model="valid" ref="contentForm">
      <v-text-field
        v-model="form.contentsName"
        label="방송 이름"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-select
        v-model="form.personality"
        :items="personalities"
        label="진행자 (복수 선택 가능)"
        :rules="[rules.required]"
        multiple
        required
      ></v-select>

      <v-select
        v-model="form.date"
        :items="dates"
        label="방송 요일"
        :rules="[rules.required]"
        required
      ></v-select>

      <v-text-field
        v-model="form.mainImg"
        label="방송 대문 이미지 링크"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.info"
        label="방송설명"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" @click="submitContentForm" color="primary">
        저장
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

definePageMeta({
  layout: "admin",
});

interface ContentForm {
  contentsName: string;
  personality: string[];
  mainImg: string;
  date: string;
  info: string;
}

const valid = ref(false);
const form = ref<ContentForm>({
  contentsName: "",
  personality: [],
  mainImg: "",
  date: "",
  info: "",
});

const personalities = ref<string[]>([]);
const dates = ["月", "火", "水", "木", "金", "土", "日"];
const route = useRoute();
const router = useRouter();

const rules = {
  required: (value: string) => !!value || "필수 입력입니다.",
  url: (value: string) =>
    /^https?:\/\/.+/.test(value) || "유효한 URL을 입력해주세요.",
};

// 진행자 목록 불러오기 및 데이터 로드
onMounted(async () => {
  try {
    // 진행자 목록 불러오기
    const personalityResponse = await axios.get("/api/personality");
    if (personalityResponse.data.success) {
      personalities.value = personalityResponse.data.data.map(
        (item: { personalityName: string }) => item.personalityName
      );
    }

    // 콘텐츠 데이터 불러오기
    const contentResponse = await axios.get(`/api/contents/${route.params.id}`);
    if (contentResponse.data.success) {
      form.value = contentResponse.data.data; // 초기 데이터 설정
    }
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  }
});

// 수정된 데이터 저장
const submitContentForm = async () => {
  try {
    const response = await axios.put(
      `/api/contents/${route.params.id}`,
      form.value
    );
    alert("저장 성공: " + response.data);
    router.push("/broadcast/list"); // 저장 후 목록으로 이동
  } catch (error) {
    console.error("저장 실패:", error);
  }
};
</script>
