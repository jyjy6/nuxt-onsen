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
        <v-card>
          <v-img :src="content.mainImg" height="200" cover></v-img>

          <v-card-title>{{ content.contentsName }}</v-card-title>

          <v-card-text>
            <v-chip
              v-for="personality in content.personality"
              :key="personality"
              class="mr-2 mb-2"
              color="primary"
            >
              {{ personality }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

// 컨텐츠 타입 정의
interface Content {
  _id: string;
  contentsName: string;
  mainImg: string;
  personality: string[];
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
