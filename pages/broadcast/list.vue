<template>
  <v-container>
    <h1 class="text-h3 mb-6">모든 방송리스트</h1>

    <v-row>
      <v-col
        v-for="content in contents"
        :key="content._id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          @click="navigateToBroadcast(content._id)"
          :style="{ cursor: 'pointer' }"
        >
          <v-img :src="content.mainImg" height="200" cover></v-img>

          <v-card-title>{{ content.contentsName }}</v-card-title>

          <v-card-text>
            <div class="mb-2">
              <v-chip
                v-for="personality in content.personality"
                :key="personality"
                class="mr-2 mb-2"
                color="primary"
              >
                {{ personality }}
              </v-chip>
            </div>
            <div>
              <v-chip color="secondary">
                {{ content.date }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
        <v-btn :to="`/admin/update/${content._id}`" color="primary">
          수정
        </v-btn>
        <v-btn :to="`/admin/add/episodes/${content._id}`" color="warning">
          에피소드 추가
        </v-btn>
        <DeleteButtonComponent :URL="`/api/contents/${content._id}`" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 방송 상세 페이지로 이동하는 함수
const navigateToBroadcast = (id: string) => {
  router.push(`/broadcast/${id}`);
};

// 컨텐츠 타입 정의
interface Content {
  _id: string;
  contentsName: string;
  mainImg: string;
  personality: string[];
  date: string;
}

// contents ref에 타입 지정
const contents = ref<Content[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get<{ data: Content[] }>(
      "/api/contents/getAll"
    );
    contents.value = response.data.data || [];
  } catch (error) {
    console.error("데이터를 가져오는데 실패했습니다:", error);
  }
});
</script>
