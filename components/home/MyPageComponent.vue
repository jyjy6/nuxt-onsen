<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4 bg-transparent" elevation="0">
          <v-card-title v-if="loginStore.isLogin">마이페이지</v-card-title>
          <v-card-title v-else class="bg-transparent"
            >로그인이 필요합니다</v-card-title
          >
          <v-card-text v-if="loginStore.isLogin">
            <p>환영합니다!!!! 회원 정보를 확인하세요.</p>
            <v-btn color="primary" @click="loginStore.logout()">로그아웃</v-btn>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="!loginStore.isLogin">
            <p>로그인 후 마이페이지를 이용하실 수 있습니다.</p>
            <v-btn color="success" to="/login" style="margin-top: 10px"
              >로그인</v-btn
            >
          </v-card-text>
        </v-card>
        <v-card max-width="900px" style="margin-top: 10px" class="pa-4">
          <v-card-text class="text-center">
            <p class="text-green-darken-2 font-weight-bold text-h4">
              マイページ機能とは？
            </p>
            <p class="black--text text-h5">
              好きな番組・声優をお気に入り登録することができます！<br />
              マイページでは、お気に入りに登録した情報だけが表示されるので、<br />
              すぐに聴きたい番組や、好きな声優さんの番組、イベント情報が確認できるようになります。<br />
              更にプレイリスト機能を使えば、あなたの好きな順番に連続して視聴も可能です！<br />
              マイページは、音泉サポーターに登録すると使用することが可能になります。<br />
              是非、登録してみて下さい！
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useLoginStore } from "~/store/login";

const loginStore = useLoginStore();
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>
