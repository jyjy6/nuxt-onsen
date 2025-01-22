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
          <v-chip color="secondary" class="mb-4">
            <v-icon start icon="mdi-calendar"></v-icon>
            {{ content.date }}
          </v-chip>

          <!-- 방송 설명 -->
          <p class="text-body-1 text-justify text-secondary">
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
          class="rounded-lg"
        >
          <v-icon start icon="mdi-pencil"></v-icon>
          수정
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const content = ref<Content | null>(null);

interface Content {
  _id: string;
  contentsName: string;
  mainImg: string;
  personality: string[];
  date: string;
  info: string;
}

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
</style>
