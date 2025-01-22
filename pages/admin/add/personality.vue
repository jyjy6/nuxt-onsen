<template>
  <v-container>
    <v-form v-model="valid" ref="contentForm">
      <v-text-field
        v-model="form.personalityName"
        label="진행자 이름"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.mainImg"
        label="진행자 이미지"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>
      <!-- 지금은 진행자이미지를 링크를 직접 폼에 입력하는방식이지만 나중에는 직접업로드버튼을 눌러서 S3에 업로드 할 수 있게 변경 -->
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
