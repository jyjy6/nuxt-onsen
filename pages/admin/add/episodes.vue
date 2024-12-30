<template>
  <v-container>
    <v-form v-model="valid" ref="episodeForm">
      <v-text-field
        v-model="form.contentsCode"
        label="방송 고유번호"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.episode"
        label="회차"
        :rules="[rules.required]"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.contentsLink"
        label="방송 파일 링크"
        :rules="[rules.required, rules.url]"
        required
      ></v-text-field>

      <v-text-field
        v-model="form.omake"
        label="오마케 파일 링크"
        :rules="[rules.url]"
      ></v-text-field>

      <v-select
        v-model="form.guest"
        :items="guests"
        label="게스트 (복수 선택 가능)"
        multiple
      ></v-select>

      <v-text-field
        v-model="form.date"
        label="방송 날짜"
        :rules="[rules.required]"
        type="date"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" @click="submitEpisodeForm" color="primary">
        저장
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

interface EpisodeForm {
  contentsCode: string;
  episode: string;
  contentsLink: string;
  omake: string;
  guest: string[];
  date: string;
}

const valid = ref(false);
const form = ref<EpisodeForm>({
  contentsCode: "",
  episode: "",
  contentsLink: "",
  omake: "",
  guest: [],
  date: "",
});

const guests = ref(["Guest A", "Guest B", "Guest C"]); // 예제 데이터

const rules = {
  required: (value: string) => !!value || "필수 입력입니다.",
  url: (value: string) =>
    /^https?:\/\/.+/.test(value) || "유효한 URL을 입력해주세요.",
};

const submitEpisodeForm = async () => {
  try {
    const response = await axios.post("server/api/episodes", form.value);
    console.log("저장 성공:", response.data);
    // 폼 초기화
    form.value = {
      contentsCode: "",
      episode: "",
      contentsLink: "",
      omake: "",
      guest: [],
      date: "",
    };
  } catch (error) {
    console.error("저장 실패:", error);
  }
};
</script>
