<template>
  <v-container v-if="content">
    <v-row class="justify-center">
      <!-- 상단 버튼 -->
      <v-col cols="12" class="mb-4 text-center">
        <NuxtLink to="/broadcast/list" class="text-decoration-none">
          <v-btn color="primary" variant="outlined" size="large" class="px-6">
            <v-icon start icon="mdi-arrow-left"></v-icon>
            모든 방송 목록으로
          </v-btn>
        </NuxtLink>
      </v-col>

      <!-- 방송 제목 -->
      <v-col cols="12" class="text-center mb-4">
        <h1 class="text-h2 font-weight-bold">{{ content.contentsName }}</h1>
      </v-col>

      <!-- 방송 이미지 -->
      <v-col cols="12" md="8" class="mb-6">
        <v-img
          v-if="!isPlay"
          :src="content.mainImg"
          height="400"
          class="rounded-lg shadow-lg"
        ></v-img>
      </v-col>

      <!-- 방송 정보 카드 -->
      <v-col cols="12" md="8">
        <v-card class="pa-4 rounded-lg shadow-sm">
          <!-- 성격 칩 -->
          <div class="mb-4">
            <v-chip
              v-for="personality in content.personality"
              :key="personality"
              class="mr-2 mb-2"
              color="primary"
              variant="outlined"
              @click="(event) => personInfo(personality, event)"
            >
              <v-icon start icon="mdi-account"></v-icon>
              {{ personality }}
            </v-chip>
            <!-- 모달 -->
            <div class="modal-wrapper">
              <div
                v-if="modalVisible"
                class="modal-container"
                :style="{ ...modalStyle }"
              >
                <v-card class="pa-4" style="width: 100%">
                  <v-img
                    v-if="person?.mainImg"
                    :src="person.mainImg"
                    height="120"
                    class="mb-2"
                  ></v-img>
                  <h3 class="mb-2">{{ person?.personalityName }}</h3>
                  <p>ID: {{ person?._id }}</p>
                  <v-btn @click="closeModal" color="error" variant="outlined"
                    >닫기</v-btn
                  >
                </v-card>
              </div>
            </div>
          </div>

          <!-- 날짜 칩 -->
          <v-chip color="secondary">
            <v-icon start icon="mdi-calendar"></v-icon>
            {{ content.date }}
          </v-chip>
          <div class="pt-2">
            <v-chip
              v-for="(tag, index) in content.contentsTag"
              :key="index"
              color="blue"
              class="mr-2"
              pill
            >
              {{ tag }}
            </v-chip>
          </div>

          <!-- 방송 설명 -->
          <p class="mt-5 text-body-1 text-justify text-secondary">
            {{ content.info }}
          </p>
        </v-card>
      </v-col>

      <!-- 수정 버튼 -->
      <v-col cols="12" md="8" class="text-right mt-6">
        <v-btn
          :to="`/admin/update/${content._id}`"
          color="primary"
          variant="elevated"
          size="large"
          class="rounded-lg mr-5"
        >
          <v-icon start icon="mdi-pencil"></v-icon>
          수정
        </v-btn>
        <v-btn
          :to="`/admin/add/episodes/${content._id}`"
          color="warning"
          size="large"
        >
          에피소드 추가
        </v-btn>
      </v-col>
    </v-row>

    <h2 style="margin: 3%">에피소드 목록</h2>
    <v-row>
      <v-container v-if="!episodes.length" class="text-center my-10">
        <v-img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076470.png"
          max-width="200"
          class="mx-auto"
        />
        <p class="text-h6 mt-3">아직 에피소드가 없습니다!</p>
        <p class="text-body-2 text-grey-darken-1">
          새로운 에피소드를 추가해보세요.
        </p>
        <v-btn
          color="primary"
          class="mt-3"
          :to="`/admin/add/episodes/${content._id}`"
        >
          + 에피소드 추가하기
        </v-btn>
      </v-container>

      <v-col v-for="(episode, i) in episodes" :key="i" cols="12" sm="6" md="4">
        <v-card class="ma-3" :elevation="4">
          <!-- 썸네일 이미지 -->
          <v-img
            :src="episode.mainImg"
            alt="썸네일 이미지"
            height="200px"
            class="mb-2"
          >
            <!-- 썸네일에 오버레이 추가 -->
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-card-title>
            <span>{{ episode.episodeName }}</span>
          </v-card-title>

          <v-card-subtitle>방송날짜: {{ episode.date }}</v-card-subtitle>
          <v-card-subtitle
            >업로드날짜: {{ episode.uploadDate }}</v-card-subtitle
          >

          <v-card-text>
            <p>
              <strong>내용 링크:</strong>
              <a :href="episode.contentsLink" target="_blank">링크 열기</a>
            </p>
            <p v-if="episode.omake">
              <strong>오마케:</strong> {{ episode.omake }}
            </p>

            <!-- 게스트 정보가 있을 경우 출력 -->
            <p v-if="episode.guest">
              <strong>게스트:</strong> {{ episode.guest }}
            </p>
            <p v-else style="min-height: 32px"></p>

            <!-- 콘텐츠 링크와 오마케를 동영상/오디오로 표시 -->
            <div v-if="episode.contentsLink" style="margin-top: 20px">
              <v-row>
                <v-col
                  v-if="
                    episode.contentsLink.includes('youtube') ||
                    episode.contentsLink.includes('youtu.be')
                  "
                >
                  <iframe
                    :src="`https://www.youtube.com/embed/${getEmbedUrl(
                      episode.contentsLink
                    )}`"
                    class="episode-video-container"
                    title="YouTube Video"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  ></iframe>
                </v-col>

                <v-col v-else class="mt-3">
                  <video
                    :src="episode.contentsLink"
                    class="episode-video-container"
                    controls
                    :style="
                      isAudio(episode.contentsLink)
                        ? {
                            background: `url(${episode.mainImg}) center/cover no-repeat`,
                          }
                        : {}
                    "
                  ></video>
                </v-col>
              </v-row>
            </div>
          </v-card-text>

          <v-card-actions>
            <!-- 추가적인 액션버튼을 넣을 수 있는 공간 -->
            <v-btn>더보기</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import type { Content } from "@/types/contentTypes";
import type { Episode } from "@/types/episodeTypes";

const route = useRoute();
const content = ref<Content | null>(null);
const episodes = ref<Episode[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get<{ data: Content }>(
      `/api/contents/${route.params.id}`
    );
    content.value = response.data.data;
  } catch (error) {
    console.error("컨텐츠를 불러오는데 실패했습니다:", error);
  }
});
onMounted(async () => {
  try {
    const response = await axios.get<{ data: Episode[] }>(
      `/api/episodes/${route.params.id}`
    );
    episodes.value = response.data.data;
  } catch (error) {
    console.error("에피소드를 찾아오는데 실패했습니다:", error);
  }
});
const getEmbedUrl = (url: string): string | null => {
  if (url.includes("youtube.com")) {
    // youtube.com/watch?v=IoUYWe5t_-A 형식
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  } else if (url.includes("youtu.be")) {
    // youtu.be/IoUYWe5t_-A 형식
    const videoId = url.split("/").pop();
    return videoId || null;
  }
  return null; // 유효하지 않은 링크인 경우
};

interface PersonInfo {
  _id: string;
  personalityName: string;
  mainImg: string;
}

const person = ref<PersonInfo | null>(null);
const modalVisible = ref(false);

const modalStyle = ref({
  top: "0px",
  left: "0px",
});

const personInfo = async (personality: string, event: any) => {
  try {
    const response = await axios.get<{ success: boolean; data: PersonInfo }>(
      `/api/personality?personalityName=${encodeURIComponent(personality)}`
    );
    if (response.data.success) {
      person.value = response.data.data;

      // 칩의 위치 계산
      const chipElement = (event.target as HTMLElement).closest(".v-chip");
      if (chipElement) {
        const rect = chipElement.getBoundingClientRect();
        modalStyle.value = {
          top: `${rect.top + window.scrollY - 150}px`, // 칩의 Y축 위치
          left: `${rect.right + 10}px`, // 칩의 오른쪽 끝 + 약간의 간격
        };
      }
      modalVisible.value = true; // 모달 보이기
    } else {
      console.error("데이터를 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("컨텐츠를 불러오는데 실패했습니다:", error);
  }
};

const closeModal = () => {
  modalVisible.value = false;
};

const isPlay = ref(false);
const isAudio = (src: string): boolean => {
  return src.toLowerCase().endsWith(".mp3");
};
</script>

<style scoped>
.modal-wrapper {
  position: relative; /* 추가 */
  width: 100%;
  height: 0;
}

.modal-container {
  position: fixed; /* absolute에서 fixed로 변경 */
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  z-index: 9999; /* z-index 값 증가 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
}
.v-card {
  background-color: #fafafa;
  border-radius: 12px;
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
}

.v-card-subtitle {
  font-size: 14px;
  color: #888;
}
.episode-video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
.audio-background {
  background: url(`${}`) center/cover no-repeat;
}
</style>
