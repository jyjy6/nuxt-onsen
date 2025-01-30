<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-card-title v-if="isLoggedIn">마이페이지</v-card-title>
          <v-card-title v-else>로그인이 필요합니다</v-card-title>
          <v-card-text v-if="isLoggedIn">
            <p>환영합니다! 회원 정보를 확인하세요.</p>
            <v-btn color="primary" @click="logout">로그아웃</v-btn>
          </v-card-text>
          <v-card-text v-else>
            <p>로그인 후 마이페이지를 이용하실 수 있습니다.</p>
            <v-btn color="success" to="/login">로그인</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const isLoggedIn = inject('isLoggedIn', false) // 기본값 false
const logout = inject('handleLogout', () => {}) // app.vue에서 정의한 logout 함수
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>
