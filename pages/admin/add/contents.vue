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

      <file-upload-component @updateURL="updateURL" />
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

const personalities = ref<string[]>([]); // 빈 배열로 초기화
const dates = ["月", "火", "水", "木", "金", "土", "日"];

// personalities 데이터 가져오기
onMounted(async () => {
  try {
    const response = await axios.get("/api/personality");
    if (response.data.success) {
      // personalityName만 추출하여 배열로 만들기
      personalities.value = response.data.data.map(
        (item: { personalityName: string }) => item.personalityName
      );
    }
  } catch (error) {
    console.error("진행자 목록 가져오기 실패:", error);
  }
});

const rules = {
  required: (value: string) => !!value || "필수 입력입니다.",
  url: (value: string) =>
    /^https?:\/\/.+/.test(value) || "유효한 URL을 입력해주세요.",
};

// FileUploadComponent에서 URL을 업데이트하는 함수
const updateURL = (url: string) => {
  form.value.mainImg = url;
};

const submitContentForm = async () => {
  try {
    const response = await axios.post("/api/contents", form.value);
    alert("저장 성공:" + response.data);
    console.log(form.value);
    // 폼 초기화
    form.value = {
      contentsName: "",
      personality: [],
      mainImg: "",
      date: "",
      info: "",
    };
    window.location.reload();
  } catch (error) {
    console.error("저장 실패:", error);
  }
};
</script>
