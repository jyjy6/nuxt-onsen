<template>
  <v-app>
    <v-app-bar color="white" class="custom-app-bar">
      <!-- 왼쪽 드로어 메뉴 버튼 -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <!-- 로고 -->
      <v-toolbar-title class="logo" style="min-width: 140px">
        <v-btn to="/" class="home-v-btn">
          <v-img
            src="https://www.onsen.ag/_nuxt/img/98a6440.png"
            class="logo-img"
            style="min-width: 140px"
          />
        </v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- 버튼 그룹 (가로 스크롤 가능) -->
      <v-slide-group show-arrows v-if="isDesktop">
        <v-slide-group-item v-for="btn in filteredButtons" :key="btn.id">
          <v-btn :type="btn.btnType" :to="btn.to" class="nav-btn">
            {{ btn.btnTitle }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>

      <!-- 로그인/로그아웃 -->
      <div v-if="isLoggedIn" class="user-info">
        <div style="min-width: 50px">
          <p class="user-name">{{ user?.name }}</p>
          <p class="user-role">{{ user?.role }}</p>
        </div>
        <v-btn @click="loginStore.logout()" class="logout-btn">로그아웃</v-btn>
      </div>
      <v-btn v-else to="/login" class="login-btn">ログイン</v-btn>
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
        <v-list-item v-if="user?.role === 'admin'" to="/test">
          <v-list-item-title>TEST</v-list-item-title>
        </v-list-item>
        <v-list-item to="/broadcast/list">
          <v-list-item-title>BroadCast List</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="user?.role === 'admin'" to="/admin">
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

        <!-- 사이드바 -->
        <v-list-item>
          <div v-if="isLoggedIn" class="d-flex align-center" style="gap: 10px">
            <!-- 사용자 이름 및 이메일 -->
            <div>
              <p
                style="
                  margin: 0;
                  font-weight: bold;
                  overflow-x: auto;
                  white-space: nowrap;
                "
              >
                {{ user?.name }}
              </p>

              <p style="margin: 0; white-space: nowrap; color: gray">
                {{ user?.email }}
              </p>
              <p style="margin: 0; white-space: nowrap; color: gray">
                {{ user?.role }}
              </p>
            </div>
            <!-- 로그아웃 버튼 -->
            <v-btn
              type="text"
              style="background-color: #ff9900; color: white; font-weight: bold"
              class="no-btncolor-change"
              @click="loginStore.logout()"
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "./store/login";

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
    adminOnly: true,
  },
  {
    id: 7,
    btnTitle: "テスト",
    btnType: "text",
    to: "/test",
    adminOnly: true,
  },
]);
const filteredButtons = computed(() =>
  rightButtons.value.filter(
    (btn) => !btn.adminOnly || user.value?.role === "admin"
  )
);

const router = useRouter();
const isLoggedIn = computed(() => loginStore.isLogin);
const user = computed(() => loginStore.user);
const loginStore = useLoginStore();

// 로컬스토리지에서 토큰과 사용자 정보 가져오기
onMounted(() => {
  loginStore.loadUserFromLocalStorage();
});

const drawer = ref(false);
const windowWidth = ref(0);
// 반응형 디바이스 감지
const isDesktop = computed(() => windowWidth.value > 960);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

const toggleDrawer = () => {
  console.log("Toggle Drawer Clicked"); // 디버깅용
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
  overflow-x: auto; /* 가로 스크롤 가능하게 설정 */
  white-space: nowrap; /* 버튼이 줄바꿈되지 않도록 설정 */
}

/* 모바일에서 스크롤 시 부드럽게 이동
.right-buttons::-webkit-scrollbar {
  height: 5px;
}

.right-buttons::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
} */

.custom-app-bar {
  padding: 0 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* 로고 */
.logo-img {
  width: 140px;
  height: auto;
}

/* 버튼 스타일 */
.nav-btn {
  font-weight: bold;
  text-transform: uppercase;
  margin: 0 8px;
}

/* 로그인 버튼 */
.login-btn {
  background-color: #ff9900;
  color: white;
  font-weight: bold;
}

/* 로그아웃 버튼 */
.logout-btn {
  background-color: #ff9900;
  color: white;
  font-weight: bold;
}

/* 유저 정보 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: bold;
}

.user-role {
  color: gray;
}

/* 모바일 반응형 */
@media (max-width: 760px) {
  .nav-btn {
    display: none;
  }
}
</style>
