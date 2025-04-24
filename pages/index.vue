<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useModalStore } from "~/store/modal";
import type { Banner } from "~/types/bannerTypes";

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
const noticeSlide = ref([]);
const fetchSelectedBanners1 = async () => {
  try {
    const response = await axios.get("/api/banners", {
      params: {
        selected: true,
        bannerNumber: 1,
      },
    });
    // 응답 데이터 형식을 SwiperComponent에 맞게 변환
    noticeSlide.value = response.data.data.map((banner: Banner) => ({
      id: banner._id,
      title: banner.title,
      image: banner.mainImg,
      link: banner.bannerPopup || "#", // 팝업 링크가 없으면 '#'으로 설정
    }));
  } catch (err) {
    console.error("배너 데이터 로딩 중 오류:", err);
  }
};

onMounted(() => {
  fetchSelectedBanners1();
});
// First Swiper End ********************************************************************

// Second Swiper ***********************************************************************
const swiperOptions2 = {
  ...swiperOptions, // 첫 번째 옵션을 재사용
  autoplay: {
    delay: 3000, // 다른 딜레이 값
    disableOnInteraction: false,
  },
};

const secondSwiper = ref([]);

const fetchSelectedBanners2 = async () => {
  try {
    const response = await axios.get("/api/banners", {
      params: {
        selected: true,
        bannerNumber: 2,
      },
    });
    // 응답 데이터 형식을 SwiperComponent에 맞게 변환
    secondSwiper.value = response.data.data.map((banner: Banner) => ({
      id: banner._id,
      title: banner.title,
      image: banner.mainImg,
      link: banner.bannerPopup || "#", // 팝업 링크가 없으면 '#'으로 설정
    }));
  } catch (err) {
    console.error("배너 데이터 로딩 중 오류:", err);
  }
};

onMounted(() => {
  fetchSelectedBanners2();
});

// Second Swiper End**************************************************************

//Third Swiper ********************************************************************
const swiperOptions3 = {
  autoplay: {
    delay: 3000, // 다른 딜레이 값
    disableOnInteraction: false,
  },
  modules,
  breakpoints: {
    480: {
      slidesPerView: 2,
    },
    720: {
      slidesPerView: 4,
    },
  },
  slidesPerView: 4,
  spaceBetween: 30,
  navigation: true,
  pagination: { clickable: true },
  dots: true,
};
const recommendedContents = ref([
  {
    id: 7,
    title: "추천방송1",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/0d/06/ae390a11f2cee482e656b2161b6ee175d5a8/image?v=1733562920",
  },
  {
    id: 8,
    title: "추천방송2",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/fe/1e/9335929e1bdf8e6893c84563dbdbace741aa/image?v=1733904363",
  },
  {
    id: 9,
    title: "추천방송3",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/d9/02/fd691478d67977a8aa183808aebab41a6317/image?v=1733298264",
  },
  {
    id: 10,
    title: "추천방송4",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/d9/02/fd691478d67977a8aa183808aebab41a6317/image?v=1733298264",
  },
  {
    id: 11,
    title: "추천방송5",
    image:
      "https://d3bzklg4lms4gh.cloudfront.net/program_info/image/default/production/3a/6b/3de4026429fa7a4cbae8cc472eae3e9d4b39/image?v=1733994177",
  },
]);

// thirdswiper end=========================================================================

interface Content {
  _id: string;
  contentsName: string;
  personality: string[];
  contentsTag: string[];
  mainImg: string;
  date: string;
  info: string;
}

// buttons 배열의 아이템 타입 정의
interface ButtonItem {
  label: string;
  active: boolean;
}

// buttonbox=======================================
const buttons = ref([
  { label: "番組一覧", active: true },
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

// 카테고리에 맞는 아이템들ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const contentsList = ref<Content[]>([]);
onMounted(async () => {
  const today = new Date();
  const dayOfWeekIndex = today.getDay(); // 0(일요일)부터 6(토요일)까지 반환
  // 요일에 맞는 카테고리 이름으로 변환
  const categoryMap: { [key: number]: string } = {
    1: "月",
    2: "火",
    3: "水",
    4: "木",
    5: "金",
    6: "土",
    0: "日",
  };

  const category: string = categoryMap[dayOfWeekIndex]; // 月~日 까지
  await fetchCategoryData(category); // 오늘의 요일에 맞는 카테고리 데이터 가져오기

  if (dayOfWeekIndex == 0) {
    //일요일 일 시 CategoryActive를 5로지정하여 cateGoryButtons의 토,일으로 설정
    setCategoryActive(5);
  } else {
    setCategoryActive(dayOfWeekIndex - 1);
    //월~토요일은 일요일을 뺀 인덱스를 categoryButtons에서 골라야하므로 -1
  }
});

const fetchCategoryData = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/contents/getContents?date=${category}`
    ); // API 요청
    contentsList.value = response.data.data; // 가져온 데이터를 contentsList에 바인딩

    if (category === "土") {
      const saturdaySundayData = await axios.get(
        `/api/contents/getContents?date=日`
      );
      contentsList.value.push(...saturdaySundayData.data.data);
    } else if (category === "日") {
      const saturdaySundayData = await axios.get(
        `/api/contents/getContents?date=土`
      );
      contentsList.value.push(...saturdaySundayData.data.data);
      //사실 일요일 로직은 필요없지만 안전을위해서 넣음
      //-> 필요없는이유는 categoryButtons에서 토,일요일을 나누지않고 土・日통합해서 최초 axios요청을 토요일 데이터만 불러오고있기에 이 if문에선 추가로 일요일 데이터만 불러오면되기 때문에.
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  }
};

const fetchContentsTagData = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/contents/getContents?contentsTag=${category}`
    ); // API 요청
    contentsList.value = response.data.data; // 가져온 데이터를 contentsList에 바인딩
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  }
};

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
      if (button.active) {
        if (i == 5) {
          fetchCategoryData("土");
        } else {
          if (index < 6) {
            fetchCategoryData(button.label); // 클릭한 버튼의 label의 요일에 맞는 데이터 가져오기
          } else {
            fetchContentsTagData(button.label); //클릭한 버튼의 Label의 태그에 맞는 데이터
          }
        }
      }
    }, 120);
  });
};
// ================================================

interface Episode {
  _id: string;
  contentsCode: string;
  mainImg: string;
  episode: string;
  episodeName: string;
  contentsLink: string;
  omake: string;
  guest?: string[];
  date: string;
  uploadDate: string;
}
const playingEpisode = ref<Episode>();

const fetchRandomEpisode = async () => {
  try {
    const response = await axios.get<{ data: Episode }>("/api/episodes");
    playingEpisode.value = response.data.data;
  } catch (error) {
    console.error("랜덤 에피소드를 가져오는 데 실패했습니다:", error);
  }
};
const selectEpisode = (episode: Episode) => {
  playingEpisode.value = episode;
};

onMounted(async () => {
  await fetchRandomEpisode(); // ✅ 데이터를 가져올 때까지 기다림
});
const isAudio = (src: string | undefined) => {
  if (src) {
    return src.toLowerCase().endsWith(".mp3");
  }
};
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

//모달창
const modalStore = useModalStore();
const selectedContent = ref<Content | null>(null);
const openModal = (item: Content) => {
  selectedContent.value = item;
  modalStore.openModal();
};
</script>

<template>
  <main
    style="
      width: 100%;
      max-width: 1800px;
      margin: 0 auto;
      background-color: #f7f7f7;
    "
  >
    <div class="container-wrapper">
      <div class="contents-row">
        <!-- 메인화면 좌측 비디오 -->
        <div class="contents-col video-col">
          <v-card class="d-flex align-center justify-center h-100 w-100 m-0">
            <v-row class="d-flex align-center justify-center w-100 h-100">
              <v-col
                v-if="
                  playingEpisode?.contentsLink.includes('youtube') ||
                  playingEpisode?.contentsLink.includes('youtu.be')
                "
                class="d-flex justify-center align-center"
                style="display: flex; width: 100%; height: 100%"
              >
                <iframe
                  :src="`https://www.youtube.com/embed/${getEmbedUrl(
                    playingEpisode.contentsLink
                  )}`"
                  class="episode-video-container"
                  title="YouTube Video"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  style="max-width: 100%; max-height: 100%; min-height: 350px"
                ></iframe>
              </v-col>

              <v-col
                v-else
                class="d-flex justify-center align-center"
                style="display: flex; width: 100%; height: 100%"
              >
                <video
                  :src="playingEpisode?.contentsLink"
                  class="episode-video-container"
                  controls
                  :style="
                    isAudio(playingEpisode?.contentsLink)
                      ? {
                          background: `url(${playingEpisode?.mainImg}) center/cover no-repeat`,
                        }
                      : {}
                  "
                  style="max-width: 100%; max-height: 100%"
                ></video>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <div class="contents-col swiper-col">
          <v-card style="height: 100%; margin: 0; width: 100%">
            <client-only>
              <v-container class="swiper-container first-swiper">
                <SwiperComponent
                  :swiperOptions="swiperOptions"
                  :items="noticeSlide"
                />
              </v-container>
              <v-container class="swiper-container second-swiper">
                <SwiperComponent
                  :swiperOptions="swiperOptions2"
                  :items="secondSwiper"
                />
              </v-container>
            </client-only>
          </v-card>
        </div>
      </div>
    </div>
    <client-only>
      <v-container class="d-flex justify-center flex-wrap ga-2 mt-10 pa-0">
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          :class="['tonal-btn', { active: button.active }]"
          @click="setActiveButton(index)"
          variant="tonal"
          :style="
            $vuetify.display.smAndDown
              ? 'width: calc(33.33% - 10px); margin: 0 5px;'
              : 'width: 150px'
          "
        >
          {{ button.label }}
        </v-btn>
      </v-container>

      <!-- 방송일람 페이지 -->
      <v-container
        :style="$vuetify.display.smAndDown ? 'width: 100%' : 'width: 75%'"
        v-if="buttons[0].active"
      >
        <p style="color: #43b149; font-size: 1.2rem; margin-bottom: 15px">
          おすすめ番組
        </p>
        <SwiperComponent
          :swiperOptions="swiperOptions3"
          :items="recommendedContents"
        />

        <div
          class="d-flex align-center"
          :class="{
            'flex-column': $vuetify.display.smAndDown,
            'justify-center': !$vuetify.display.smAndDown,
          }"
          style="margin-top: 100px"
        >
          <p
            :style="
              $vuetify.display.smAndDown
                ? 'color: #43b149; font-size: 1.2rem; margin-bottom: 15px'
                : 'color: #43b149; font-size: 1.2rem; margin-right: 20px; white-space: nowrap'
            "
          >
            カテゴリ
          </p>

          <div class="d-flex gap-2 flex-wrap justify-center align-center">
            <v-btn
              v-for="(button, index) in categoryButtons"
              :key="index"
              :class="['tonal-btn', { active: button.active }, 'mr-5', 'mb-2']"
              @click="setCategoryActive(index)"
              variant="tonal"
              size="small"
            >
              {{ button.label }}
            </v-btn>
          </div>
        </div>

        <!-- contentsList 표시 -->
        <HomeContentsClickModalComponent
          :content="selectedContent"
          @selectEpisode="selectEpisode"
        />
        <v-row class="mt-4">
          <v-col
            v-for="(item, index) in contentsList"
            :key="index"
            :cols="$vuetify.display.xs ? 12 : $vuetify.display.sm ? 6 : 4"
            :style="
              $vuetify.display.mdAndUp
                ? 'max-width: calc(100% / 3.5); flex: 0 0 calc(100% / 3.5)'
                : ''
            "
          >
            <v-card
              class="mb-4 elevation-2"
              :style="
                $vuetify.display.smAndDown
                  ? 'height: auto; min-height: 450px'
                  : 'height: 450px'
              "
              @click="openModal(item)"
            >
              <!-- 이미지 -->
              <v-img :src="item.mainImg" class="mb-2" height="200px"></v-img>

              <!-- 제목 -->
              <v-card-title class="text-h6 title-multiline">
                {{ item.contentsName }}
              </v-card-title>

              <!-- 카드 텍스트 -->
              <v-card-text>
                <div class="d-flex flex-column mb-2">
                  <p class="mt-2 mb-1 font-weight-bold">출연자:</p>
                  <div class="d-flex flex-wrap">
                    <v-chip
                      v-for="(person, index) in item.personality"
                      :key="index"
                      class="ma-1"
                      color="teal"
                      text-color="white"
                      pill
                      size="small"
                    >
                      {{ person }}
                    </v-chip>
                  </div>
                  <div class="d-flex flex-wrap">
                    <v-chip
                      v-for="(tag, index) in item.contentsTag"
                      :key="index"
                      class="ma-1"
                      color="blue"
                      text-color="white"
                      pill
                      size="small"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                </div>
                <p class="text-caption text-gray-600">날짜: {{ item.date }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- マイページ -->
      <HomeMyPageComponent v-if="buttons[1].active" />

      <!-- おすすめ -->
      <HomeOsusumeComponent v-if="buttons[2].active" />

      <!-- イベント・生放送 -->
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

.title-multiline {
  white-space: normal;
  overflow: visible;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  max-height: 3em; /* line-height * 표시할 줄 수 */
  margin-bottom: 30px;
}
.episode-video-container {
  height: 100%;
  width: 80%;
  margin: 0 auto;
}
.container-wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

.contents-row {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-direction: row;
}

.contents-col {
  min-height: 300px;
}

.video-col {
  width: 48%;
}

.swiper-col {
  width: 38%;
}

.swiper-container {
  height: 50%;
}

/* 모바일 화면에서의 스타일 */
@media (max-width: 960px) {
  .contents-row {
    flex-direction: column;
  }

  .video-col,
  .swiper-col {
    width: 100%;
  }

  .swiper-col {
    margin-top: 20px;
  }

  .swiper-container {
    height: auto;
    min-height: 150px;
  }
}
</style>
