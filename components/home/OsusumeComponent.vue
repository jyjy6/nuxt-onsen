<template>
  <v-container class="py-5">
    <!-- 주목 배너 -->
    <v-banner class="mb-5" color="primary" elevation="2">
      <template #text>
        <h3 class="text-black">🔥 주목! 최신 소식 확인하기</h3>
      </template>
    </v-banner>

    <!-- 공지 링크 배너 -->
    <v-row dense>
      <v-col
        v-for="(banner, index) in visibleBanners"
        :key="index"
        cols="12"
        md="6"
      >
        <v-card elevation="2" class="pa-4">
          <v-row align="center" no-gutters>
            <!-- 왼쪽: 이미지 -->
            <v-col cols="4">
              <v-img :src="banner.mainImg" alt="Banner Image" />
            </v-col>

            <!-- 오른쪽: 텍스트와 버튼 -->
            <v-col cols="8" class="d-flex flex-column justify-center pa-2">
              <!-- 제목 -->
              <h4 class="mb-2">{{ banner.title }}</h4>
              <!-- 설명 -->
              <p class="mb-4">{{ banner.content }}</p>
              <!-- 버튼 -->
              <v-btn
                :href="banner.link"
                target="_blank"
                color="secondary"
                variant="outlined"
                class="mt-auto align-self-end"
              >
                자세히 보기
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- More 버튼 -->
    <v-btn
      class="mt-4"
      block
      color="primary"
      variant="tonal"
      @click="loadMore"
      :disabled="visibleBanners.length >= banners.length"
    >
      더 보기
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

interface Banner {
  title: string;
  content: string;
  mainImg: string;
  link: string;
}
// 초기 공지 데이터
const banners = ref<Banner[]>([]);

// 한 번에 보여줄 줄 수와 상태
const rowsToShow = ref(2); // 초기에 3줄
const visibleBanners = computed(() =>
  banners.value.slice(0, rowsToShow.value * 2)
);

// 더 보기 로직
function loadMore() {
  rowsToShow.value += 1;
}

async function fetchBanners() {
  try {
    const response = await axios.get("/api/notice"); // GET 요청 URL
    banners.value = response.data.data; // 데이터 리스트로 설정
  } catch (error) {
    console.error("Error fetching banners:", error);
  }
}

onMounted(() => {
  fetchBanners();
});
</script>

<style scoped>
h3 {
  margin: 0;
}
</style>
