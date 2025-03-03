<template>
  <v-app>
    <v-app-bar color="white" dark>
      <!-- Nav Icon -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <!-- Title -->
      <v-toolbar-title style="width: 170px; min-width: 170px; max-width: 170px">
        <v-btn to="/" class="home-v-btn">
          <v-img
            src="https://www.onsen.ag/_nuxt/img/98a6440.png"
            style="width: 150px; min-width: 150px; max-width: 150px"
          />
        </v-btn>
      </v-toolbar-title>
      <!-- Right button -->
      <v-spacer></v-spacer>
      <div class="right-buttons">
        <v-btn
          v-for="btn in rightButtons"
          :key="btn.id"
          :type="btn.btnType"
          :to="btn.to"
        >
          {{ btn.btnTitle }}
        </v-btn>
        <v-btn type="text" to="/test">
          <v-img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEqADAAQAAAABAAAAFAAAAAAV6Uf1AAABrUlEQVQ4EZWUzytEURTHZ/wqVixGg1JSsmChKBursbab8WunlFgoG2WDlX+Alf+AERsLoYSSIskGW7HwM5Efk+Lzfc6r23heb0593veec8+dO+ee+148FouNQjW4toez7Qb+GbcR74FFzafhG45hC07hAZIQZnVM3sC8m7SMs2KBcvQc1swPkgqC2ngTStyEBM4dDFqwE/1yfAt7EuepjS+g0ovkPTL4j1Bj8Tk0qMRZy2uyvEDJEl23mTL0DFbNl/RCDlJywkzdU4lDlqSuaOEAdMAbqMuRTLs+Q71lT6P3oA4tWCyyqIO6CjpYdUUdurIxEt1Uov6FX0YL4w/oh4JNi16h0VZOovpxbVKQ6ax043ehCIrhAFR2ZGsnUx3yD3rCVuruKN5nfqjUMnsNfodU4js0g2wcdEVCS9R7dgTqmPsO6VIegspTJ3cgC4GmhCW4hKq8jCS+XpcpizegL6Bz/GMzRJ5A5xBkut2f0GqTI6hKTJjvSYZnDrrdYMBYn5YTKLW5DVRfAs/8Do35gRD1S9wnR9dAqiuS1rkMg8z7XP4OQ58pZrvyMm5/AIh6VCYDGXE0AAAAAElFTkSuQmCC"
            alt="Sample Image"
            aspect-ratio="1.7"
            width="30"
          />
        </v-btn>

        <!-- Application btn -->
        <v-btn
          type="text"
          to="/test"
          style="background-color: #43b149; color: white; font-weight: bold"
          class="no-btncolor-change"
        >
          <v-img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAA20lEQVQ4je2TPQrCQBSEP9RSsPQCVv6EgKBgYyHYCzbewM6TiK2F4C0UBA/gBbxESi2VkeAKm7hxg6Z0IGR3582XB/uCJN8zlXSTNPPVlvCrDZSBvq8yDyy3/rBiYENgBdQyMvH5EhiljYqjeAFMgAEwdoAOQA9oAMeE6xi+lqRIT50krcx6a/YyfjudzZrmjgW8K6nI+G+5T7+HDZTVkRP0gtUl7SXVPMAsUJzbxZx4E5jiMOOLTUlr83b5ockHrttM6wzMc9QVO7R2Zxvg+gWjasNegO5PbcHlAQSyfYdj7F5wAAAAAElFTkSuQmCC"
            alt="Application Image"
            width="20"
          />
          <p>&nbsp;アプリ</p>
        </v-btn>

        <!-- Login btn -->
        <div v-if="isLoggedIn" class="d-flex align-center" style="gap: 10px">
          <!-- 사용자 이름 및 이메일 -->
          <div>
            <p style="margin: 0; font-weight: bold">{{ userName }}</p>
            <p style="margin: 0; color: gray">{{ userEmail }}</p>
          </div>

          <!-- 로그아웃 버튼 -->
          <v-btn
            type="text"
            style="background-color: #ff9900; color: white; font-weight: bold"
            class="no-btncolor-change"
            @click="handleLogout"
          >
            로그아웃
          </v-btn>
        </div>
        <div v-else>
          <!-- 로그인 버튼 -->
          <v-btn
            type="text"
            to="/login"
            style="background-color: #ff9900; color: white; font-weight: bold"
            class="no-btncolor-change"
          >
            <v-img
              src="https://www.onsen.ag/assets/img/common/icon-header-02.png"
              alt="Login Image"
              width="20"
            />
            <p>&nbsp;ログイン</p>
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <!-- Navigation Desk -->
    <v-navigation-drawer v-model="drawer" temporary app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about">
          <v-list-item-title>音泉通販</v-list-item-title>
        </v-list-item>
        <v-list-item to="/test">
          <v-list-item-title>TEST</v-list-item-title>
        </v-list-item>
        <v-list-item to="/broadcast/list">
          <v-list-item-title>BroadCast List</v-list-item-title>
        </v-list-item>
        <v-list-item to="/admin">
          <v-list-item-title>admin</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-btn
            type="text"
            to="/test"
            style="background-color: #43b149; color: white; font-weight: bold"
            class="no-btncolor-change"
          >
            <v-img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAA20lEQVQ4je2TPQrCQBSEP9RSsPQCVv6EgKBgYyHYCzbewM6TiK2F4C0UBA/gBbxESi2VkeAKm7hxg6Z0IGR3582XB/uCJN8zlXSTNPPVlvCrDZSBvq8yDyy3/rBiYENgBdQyMvH5EhiljYqjeAFMgAEwdoAOQA9oAMeE6xi+lqRIT50krcx6a/YyfjudzZrmjgW8K6nI+G+5T7+HDZTVkRP0gtUl7SXVPMAsUJzbxZx4E5jiMOOLTUlr83b5ockHrttM6wzMc9QVO7R2Zxvg+gWjasNegO5PbcHlAQSyfYdj7F5wAAAAAElFTkSuQmCC"
              alt="Application Image"
              width="20"
            />
            <p>&nbsp;アプリ</p>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <div v-if="isLoggedIn" class="d-flex align-center" style="gap: 10px">
            <!-- 사용자 이름 및 이메일 -->
            <div>
              <p style="margin: 0; font-weight: bold">{{ userName }}</p>
              <p style="margin: 0; color: gray">{{ userEmail }}</p>
            </div>

            <!-- 로그아웃 버튼 -->
            <v-btn
              type="text"
              style="background-color: #ff9900; color: white; font-weight: bold"
              class="no-btncolor-change"
              @click="handleLogout"
            >
              로그아웃
            </v-btn>
          </div>
          <div v-else>
            <!-- 로그인 버튼 -->
            <v-btn
              type="text"
              to="/login"
              style="background-color: #ff9900; color: white; font-weight: bold"
              class="no-btncolor-change"
            >
              <v-img
                src="https://www.onsen.ag/assets/img/common/icon-header-02.png"
                alt="Login Image"
                width="20"
              />
              <p>&nbsp;ログイン</p>
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 메인 콘텐츠 -->
    <v-main style="overflow-x: scroll">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import type { AxiosInstance } from "axios";

const rightButtons = ref([
  {
    id: 0,
    btnTitle: "ご利用ガイド",
    btnType: "text",
    to: "/",
  },
  {
    id: 1,
    btnTitle: "音泉通販",
    btnType: "text",
    to: "/about",
  },
  {
    id: 2,
    btnTitle: "音泉チャンネル",
    btnType: "text",
    to: "/test",
  },
  {
    id: 3,
    btnTitle: "更新情報",
    btnType: "text",
    to: "/test",
  },
  {
    id: 4,
    btnTitle: "PREMIUM",
    btnType: "text",
    to: "/test",
  },
  {
    id: 5,
    btnTitle: "BroadCast List",
    btnType: "text",
    to: "/broadcast/list",
  },
  {
    id: 6,
    btnTitle: "admin",
    btnType: "text",
    to: "/admin",
  },
  {
    id: 7,
    btnTitle: "テスト",
    btnType: "text",
    to: "/test",
  },
]);

const router = useRouter();
const isLoggedIn = ref(false);
const userName = ref(""); // 사용자 이름
const userEmail = ref(""); // 사용자 이메일

// 로컬스토리지에서 토큰과 사용자 정보 가져오기
onMounted(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    isLoggedIn.value = true;

    // 토큰에서 사용자 정보 가져오기 (예: 이름, 이메일)
    const user = JSON.parse(localStorage.getItem("user") || "{}"); // JSON으로 저장된 사용자 정보 가져오기
    userName.value = user.name || "Guest";
    userEmail.value = user.email || "guest@example.com";
  }
});

// 로그아웃 처리
const handleLogout = async () => {
  try {
    const axiosInstance: AxiosInstance = axios.create({
      // 필요한 설정 추가
    });
    await axiosInstance.post("/api/auth/logout"); // 서버에 로그아웃 요청
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    isLoggedIn.value = false;
    router.push("/login");
  }
};

// provide로 MyPageComponent.vue에 상태값 전송
provide("isLoggedIn", isLoggedIn);
provide("handleLogout", handleLogout);

const drawer = ref(false);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
</script>

<style scoped>
.home-v-btn:deep(*) {
  background-color: transparent !important; /* 배경색 제거 */
  box-shadow: none !important; /* 그림자 제거 */
}

.v-btn:hover:not(.no-btncolor-change) {
  color: #43b149 !important;
}

.right-buttons {
  display: flex;
  align-items: center;
}

@media (max-width: 1450px) {
  .right-buttons {
    display: none;
  }
}
</style>
