<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4 bg-transparent" elevation="0">
          <v-card-title v-if="isLogin" class="text-h5 font-weight-bold"
            >마이페이지</v-card-title
          >
          <v-card-title v-else class="bg-transparent"
            >로그인이 필요합니다</v-card-title
          >
          <v-card-text v-if="isLogin">
            <p>환영합니다!!!! 회원 정보를 확인하세요.</p>
          </v-card-text>
        </v-card>
        <v-card class="mx-auto" max-width="500">
          <v-card-text>
            <!-- 프로필 이미지 -->
            <v-row justify="center">
              <v-avatar size="200" style="margin: 15px">
                <img :src="user?.profileImage" alt="프로필 이미지" />
              </v-avatar>
            </v-row>

            <!-- 회원 정보 -->
            <v-list dense>
              <v-list-item>
                <v-list-item-title>아이디:</v-list-item-title>
                <v-list-item-subtitle>{{
                  user?.username
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>닉네임:</v-list-item-title>
                <v-list-item-subtitle>{{ user?.name }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>이메일:</v-list-item-title>
                <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>연락처:</v-list-item-title>
                <v-list-item-subtitle>{{ user?.phone }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>주소:</v-list-item-title>
                <v-list-item-subtitle>
                  {{ user?.address?.mainAddress }}
                  {{ user?.address?.subAddress }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>최근 로그인:</v-list-item-title>
                <v-list-item-subtitle>{{
                  user?.lastLogin
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <!-- 로그아웃 버튼 -->
            <v-btn block color="green" class="mt-4" :to="`/editprofile`">
              회원정보수정
            </v-btn>

            <v-btn
              block
              color="primary"
              class="mt-4"
              @click="loginStore.logout()"
            >
              로그아웃
            </v-btn>
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
const isLogin = computed(() => loginStore.isLogin);
const user = computed(() => loginStore.user);
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>
