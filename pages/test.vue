<script setup lang="ts">
import { ref } from "vue";
import axios from "axios"; // 직접 axios를 import

// 응답 데이터의 타입 정의
interface ApiResponse {
  message: string;
}

// API 응답 메시지를 저장할 변수
const apiMessage = ref<string>("");

// API 호출 함수
const fetchTestMessage = async () => {
  try {
    // '/api/test' API 호출, 응답 타입을 ApiResponse로 지정
    const response = await axios.get<ApiResponse>("/api/test"); // axios 사용
    apiMessage.value = response.data.message || "No message returned"; // 응답 메시지 처리
  } catch (error: any) {
    // error 타입을 any로 지정
    apiMessage.value = "API 요청 실패"; // 에러 처리
    console.error(error);
  }
};
</script>

<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <!-- 인사말 텍스트 -->
          <v-text-field
            label="안녕하세요 테스트 페이지입니다."
            disabled
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <!-- API 요청 버튼 -->
          <v-btn @click="fetchTestMessage" color="primary" block>
            API 요청
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="apiMessage">
        <v-col cols="12">
          <!-- API 응답 메시지 출력 -->
          <v-alert type="success" v-if="apiMessage !== 'API 요청 실패'">
            응답: {{ apiMessage }}
          </v-alert>
          <v-alert type="error" v-else>
            {{ apiMessage }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped>
/* 스타일은 필요한 경우 여기에 추가 */
</style>
