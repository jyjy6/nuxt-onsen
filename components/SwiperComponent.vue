<!-- SwiperComponent.vue -->
<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Item {
  id: number;
  title?: string;
  image: string;
}

defineProps({
  swiperOptions: Object,
  items: Array as PropType<Item[]>, // Item 타입을 배열로 받습니다.
});
</script>

<template>
  <swiper v-bind="swiperOptions" style="height: 100%">
    <swiper-slide v-for="item in items" :key="item.id">
      <v-card class="custom-card">
        <v-img class="custom-img" :src="item.image" />
        <v-card-title class="custom-title">{{ item.title }}</v-card-title>
      </v-card>
    </swiper-slide>
  </swiper>
</template>

<style scoped>
.custom-card {
  height: 100%;
  position: relative;
}

.custom-img {
  object-fit: contain; /* 이미지를 비율에 맞춰 보여줌 */
  width: 100%; /* 가로로 100% */
  height: 100%;
}

.custom-title {
  background-color: rgba(0, 0, 0, 0.3); /* 투명한 배경 추가 */
  color: white; /* 텍스트 색상 흰색 */
  padding: 4px; /* 약간의 여백 추가 */
  position: absolute; /* Title을 이미지 위에 겹치게 설정 */
  bottom: 0; /* 이미지의 아래쪽에 고정 */
  width: 100%; /* Title이 카드 가로 전체를 차지 */
  text-align: left;
}
</style>
