<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Navigation, Pagination, Autoplay];
// First Swiper
// 스와이퍼들 오브젝트자료 하드코딩돼어있는거 나중에 1,2번은 각각 공지/이벤트 데이터베이스에 넣고 출력
// 3번쨰 스와이퍼는 おすすめ방송 일단 내맘대로하고 나중에 유저정보에맞춰서 AI분석에따른 おすすめ방송출력
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

//Third Swiper
const swiperOptions3 = {
  autoplay: {
    delay: 3000, // 다른 딜레이 값
    disableOnInteraction: false,
  },
  modules,
  slidesPerView: 4,
  spaceBetween: 30,
  navigation: true,
  pagination: { clickable: true },
  dots: true,
};

const items3 = ref([
  {
    id: 7,
    title: "internet something~~~~",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/0d/06/ae390a11f2cee482e656b2161b6ee175d5a8/image?v=1733562920",
  },
  {
    id: 8,
    title: "radio is good~~~~~",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/fe/1e/9335929e1bdf8e6893c84563dbdbace741aa/image?v=1733904363",
  },
  {
    id: 9,
    title: "go go go let`s move",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/d9/02/fd691478d67977a8aa183808aebab41a6317/image?v=1733298264",
  },
  {
    id: 10,
    title: "go go go let`s move",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/d9/02/fd691478d67977a8aa183808aebab41a6317/image?v=1733298264",
  },
  {
    id: 11,
    title: "go go go let`s move",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/3a/6b/3de4026429fa7a4cbae8cc472eae3e9d4b39/image?v=1733994177",
  },
]);

// swiper end=========================================================================

const items5 = [
  "Card 1",
  "Card 2",
  "Card 3",
  "Card 4",
  "Card 5",
  "Card 6",
  "Card 7",
  "Card 8",
  "Card 8",
  "Card 8",
  "Card 8",
];

// buttons 배열의 아이템 타입 정의
interface ButtonItem {
  label: string;
  active: boolean;
}

// buttonbox=======================================
const buttons = ref([
  { label: "番組一覧", active: false },
  { label: "マイページ", active: false },
  { label: "おすすめ", active: false },
  { label: "イベント・生放送", active: false },
]);

const setActiveButton = (index: number) => {
  buttons.value.forEach((button: ButtonItem, i: number) => {
    setTimeout(() => {
      button.active = i === index;
    }, 120);
  });
};
// ================================================

// categoryButtons 배열의 아이템 타입 정의
interface CategoryButton {
  label: string;
  active: boolean;
}

// categoryButtons=======================================
const categoryButtons = ref([
  { label: "月", active: false },
  { label: "火", active: false },
  { label: "水", active: false },
  { label: "木", active: false },
  { label: "金", active: false },
  { label: "土・日", active: false },
  { label: "新番組", active: false },
  { label: "PREMIUM", active: false },
  { label: "ランキング", active: false },
  { label: "アニメ・ゲーム", active: false },
  { label: "検索", active: false },
]);

const setCategoryActive = (index: number) => {
  categoryButtons.value.forEach((button: CategoryButton, i: number) => {
    setTimeout(() => {
      button.active = i === index;
    }, 120);
  });
};
// ================================================
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
    <client-only>
      <v-container class="d-flex justify-center ga-2 mt-10 pa-0">
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          :class="['tonal-btn', { active: button.active }]"
          @click="setActiveButton(index)"
          variant="tonal"
          style="width: 150px"
        >
          {{ button.label }}
        </v-btn>
      </v-container>

      <v-container style="width: 70%">
        <p style="color: #43b149; font-size: 1.2rem; margin-bottom: 15px">
          おすすめ番組
        </p>
        <SwiperComponent :swiperOptions="swiperOptions3" :items="items3" />
        <div class="d-flex align-center" style="margin-top: 100px">
          <p style="color: #43b149; font-size: 1.2rem; margin-right: 20px">
            カテゴリ
          </p>
          <div class="d-flex flex-wrap gap-2 justify-center align-center">
            <v-btn
              v-for="(button, index) in categoryButtons"
              :key="index"
              :class="['tonal-btn', { active: button.active }, 'mr-5']"
              @click="setCategoryActive(index)"
              variant="tonal"
              size="small"
            >
              {{ button.label }}
            </v-btn>
          </div>
        </div>

        <!-- items5 표시 -->
        <v-row class="mt-4">
          <v-col
            v-for="(item, index) in items5"
            :key="index"
            style="max-width: calc(100% / 5); flex: 0 0 calc(100% / 5)"
          >
            <v-card>
              <v-card-text>
                {{ item }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </client-only>
  </main>
</template>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
}
.tonal-btn {
  transition: background-color 0.3s ease;
}

.tonal-btn.active {
  background-color: #43b149;
  color: white;
}
</style>
