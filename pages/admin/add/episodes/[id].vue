<template>
  <FormComponent
    :formData="formData"
    :fields="episodeFields"
    api-url="/api/admin/episodes"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const route = useRoute();
const episodeId = route.params.id; // URL에서 받은 id 값

interface EpisodeForm {
  contentsCode: string;
  episode: string;
  contentsLink: string;
  omake: string;
  guest: string;
  date: string;
}
const formData = ref<EpisodeForm>({
  contentsCode: "",
  episode: "",
  contentsLink: "",
  omake: "",
  guest: "",
  date: "",
});

onMounted(() => {
  formData.value.contentsCode = episodeId as string;
});

const episodeFields = [
  {
    name: "contentsCode",
    label: "방송 고유번호",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "mainImg",
    label: "에피소드 이미지를 업로드하거나 링크를 작성해주세요!",
    type: "text",
  },
  {
    name: "episodeName",
    label: "에피소드 제목",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
  {
    name: "episode",
    label: "회차",
    type: "text",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },

  {
    name: "contentsLink",
    label: "방송 파일을 업로드하거나 링크를 작성해주세요!",
    type: "text",
    rules: [
      (v: string) => !!v || "필수 입력입니다.",
      (v: string) => /^https?:\/\/.+/.test(v) || "유효한 URL을 입력해주세요.",
    ],
  },
  {
    name: "omake",
    label: "오마케 파일을 업로드하거나 링크를 작성해주세요!",
    type: "text",
  },
  {
    name: "guest",
    label: "게스트",
    type: "text",
  },
  {
    name: "date",
    label: "방송 날짜",
    type: "date",
    rules: [(v: string) => !!v || "필수 입력입니다."],
  },
];
</script>
