<template>
  <v-container>
    <v-form v-model="valid" ref="contentForm">
      <v-text-field
        v-model="form.personalityName"
        label="진행자 이름"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <!-- FileUploadComponent에서 업로드된 URL을 받음 -->
      <file-upload-component @updateURL="updateURL" />

      <v-text-field
        v-model="form.mainImg"
        label="진행자 이미지"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" @click="submitContentForm" color="primary">
        저장
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
definePageMeta({
  layout: "admin",
});

interface PersonalityForm {
  personalityName: string;
  mainImg: string;
}

const valid = ref(false);
const form = ref<PersonalityForm>({
  personalityName: "",
  mainImg: "",
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
    const response = await axios.post("/api/personality", form.value);
    console.log("전체 응답 데이터:", response.data);

    if (response.status === 200) {
      console.log("저장 성공!");
      form.value = { personalityName: "", mainImg: "" };
      alert("성공적으로 저장되었습니다.");
    } else {
      console.error("저장 실패:", response.data);
      alert("저장에 실패했습니다.");
    }
  } catch (error: any) {
    console.error("에러 발생:", error);
    alert("서버 통신 중 오류가 발생했습니다.");
  }
};
</script>
