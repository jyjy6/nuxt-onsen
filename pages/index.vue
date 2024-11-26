<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Navigation, Pagination, Autoplay];
// First Swiper
const swiperOptions = {
  modules,
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: true,
  pagination: { clickable: true },
  dots: true,

  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    1024: {
      slidesPerView: 1,
    },
  },
};
const items = ref([
  {
    id: 1,
    title: "슬라이드 1",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/cb/2a/cce5eece71de4167be5b2ac4de4a67470bfb/image?v=1728367671",
  },
  {
    id: 2,
    title: "슬라이드 2",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/eb/ae/2ed314b1f168955bad9a7016e47560b50f6a/image?v=1730862146",
  },
  {
    id: 3,
    title: "슬라이드 3",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/8b/ae/fc9547f03b3a199334f862dbfa2db417b122/image?v=1732072329",
  },
]);

// Second Swiper
const swiperOptions2 = {
  ...swiperOptions, // 첫 번째 옵션을 재사용
  autoplay: {
    delay: 3000, // 다른 딜레이 값
    disableOnInteraction: false,
  },
};

const items2 = ref([
  {
    id: 4,
    title: "internet something~~~~",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/30/1c/931f6181f616abcb0a8177b0d7d9db1f5675/image?v=1731578493",
  },
  {
    id: 5,
    title: "radio is good~~~~~",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/ed/2c/a5c823dcc6de5df90572f07f1d36cb9d8929/image?v=1711941354",
  },
  {
    id: 6,
    title: "go go go let`s move",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/banner_ad/banner_image/default/production/04/bc/125814aad5c9a83c60b462f5a5d78373c3e7/image?v=1690427379",
  },
]);
// swiper end=========================================================================
</script>

<template>
  <main style="width: 1800px; margin: 0 auto; background-color: #f7f7f7">
    <div style="width: 100%; margin: 0 auto; padding: 0">
      <div
        class="contents-row"
        style="
          width: 100%;
          height: 400px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        "
      >
        <div class="contents-col" style="width: 48%; margin: 0">
          <v-card
            class="d-flex justify-center"
            style="height: 100%; width: 100%; margin: 0"
          >
            <v-img
              src="https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/11/3d/d38f52419b456ac453c1a0dfaba0f7c9b66b/image?v=1731549397"
            />
          </v-card>
        </div>

        <div class="contents-col" style="width: 38%; height: 100%">
          <v-card style="height: 100%; margin: 0; width: 100%">
            <client-only>
              <v-container style="height: 50%">
                <SwiperComponent
                  :swiperOptions="swiperOptions2"
                  :items="items2"
                />
              </v-container>
              <v-container style="height: 50%">
                <SwiperComponent
                  :swiperOptions="swiperOptions"
                  :items="items"
                />
              </v-container>
            </client-only>
          </v-card>
        </div>
      </div>
    </div>
    <v-container class="d-flex justify-center ga-2 mt-10 pa-0">
      <v-btn variant="tonal" style="width: 150px">番組一覧</v-btn>
      <v-btn variant="tonal" style="width: 150px">マイページ</v-btn>
      <v-btn variant="tonal" style="width: 150px">おすすめ</v-btn>
      <v-btn variant="tonal" style="width: 150px">イベント・生放送</v-btn>
    </v-container>
    
  </main>
</template>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
}
</style>
