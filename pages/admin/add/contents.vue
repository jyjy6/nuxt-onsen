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

      <v-text-field
        v-model="form.mainImg"
        label="방송 대문 이미지 링크"
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

interface ContentForm {
  contentsName: string;
  personality: string[];
  mainImg: string;
}

const valid = ref(false);
const form = ref<ContentForm>({
  contentsName: "",
  personality: [],
  mainImg: "",
});

const personalities = ref(["鈴代紗弓", "稗田寧々", "DJ Mike"]); // 예제 데이터

const rules = {
  required: (value: string) => !!value || "필수 입력입니다.",
  url: (value: string) =>
    /^https?:\/\/.+/.test(value) || "유효한 URL을 입력해주세요.",
};

const submitContentForm = async () => {
  try {
    const response = await axios.post("/api/contents", form.value);
    console.log("저장 성공:", response.data);
    // 폼 초기화
    form.value = { contentsName: "", personality: [], mainImg: "" };
  } catch (error) {
    console.error("저장 실패:", error);
  }
};
</script>
