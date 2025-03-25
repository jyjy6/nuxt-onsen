<template>
  <v-dialog
    class="content-modal"
    v-model="modalStore.isOpen"
    @click.self="modalStore.closeModal"
    max-width="500px"
    :style="{ '--v-overlay-opacity': '0.1' }"
  >
    <v-card class="pa-4">
      <!-- 상단 타이틀 영역 -->
      <v-card-title class="d-flex align-center">
        <v-avatar size="40">
          <v-img :src="contentData?.mainImg" alt="썸네일" />
        </v-avatar>
        <span class="ml-3">{{ contentData?.contentsName }}</span>
        <v-spacer />
        <v-btn icon @click="modalStore.closeModal()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle class="text-caption">
        방송일: {{ contentData?.date }}
      </v-card-subtitle>

      <v-divider class="my-3"></v-divider>

      <!-- 에피소드 목록 -->
      <div>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="center-spinner"
        ></v-progress-circular>

        <v-list dense v-else-if="episodes.length">
          <v-list-item v-for="ep in episodes" :key="ep.episode">
            <div class="d-flex align-center">
              <div class="flex-grow-1">
                <v-list-item-title
                  style="white-space: normal; word-wrap: break-word"
                >
                  {{ ep.episode }} - {{ ep.episodeName }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ ep.date }}</v-list-item-subtitle>
              </div>

              <!-- 버튼들 -->
              <v-list-item-action>
                <v-btn icon size="35">
                  <!-- ListButton -->
                  <v-icon>mdi-playlist-plus</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="35"
                  @click="
                    emit('selectEpisode', ep);
                    modalStore.closeModal();
                    scrollToTop();
                  "
                >
                  <!-- PlayButton -->
                  <v-icon>mdi-play-circle</v-icon>
                </v-btn>
              </v-list-item-action>
            </div>
          </v-list-item>
        </v-list>
        <v-container v-else class="text-center my-10">
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
            :to="`/admin/add/episodes/${contentData?._id}`"
          >
            + 에피소드 추가하기
          </v-btn>
        </v-container>
      </div>

      <v-card-actions>
        <v-btn
          block
          color="primary"
          :to="`/broadcast/${contentData?._id}`"
          @click="modalStore.closeModal"
        >
          방송 페이지 이동
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, onMounted } from "vue";
import type { Content } from "@/types/contentTypes";
import type { Episode } from "@/types/episodeTypes";
import { useModalStore } from "~/store/modal";
import axios from "axios";

const props = defineProps<{
  content: Content | null;
}>();

const contentData = computed(() => props.content);
const modalStore = useModalStore();
const episodes = ref<Episode[]>([]);
const loading = ref(true); // 로딩 상태 추가

const fetchModalEpisode = async () => {
  loading.value = true;
  try {
    // contentData.value가 존재하고 _id가 있는지 확인
    if (contentData.value && contentData.value._id) {
      const response = await axios.get(
        `/api/episodes/${contentData.value._id}`
      );
      episodes.value = response.data.data;
    }
  } catch (error) {
    console.error("랜덤 에피소드를 가져오는 데 실패했습니다:", error);
  } finally {
    loading.value = false; // API 호출 끝나면 로딩 상태 해제
  }
};
watch(
  () => props.content,
  (newContent) => {
    fetchModalEpisode();
  }
);

onMounted(() => {
  fetchModalEpisode();
});

const emit = defineEmits<{
  (event: "selectEpisode", episode: Episode): void;
}>();
const scrollToTop = () => {
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};
</script>

<style scoped>
.content-modal {
  border-radius: 10px;
  padding: 16px;
}
.center-spinner {
  margin-top: 30px;
  top: 50%; /* 수직 중앙 */
  left: 50%; /* 수평 중앙 */
  transform: translate(-50%, -50%); /* 정확한 중앙 맞추기 */
  z-index: 9999; /* 다른 요소들 위에 표시 */
}
</style>
