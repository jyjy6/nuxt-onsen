<template>
  <v-app>
    <v-app-bar color="white" dark>
      <!-- Nav Icon -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <!-- Title -->
      <v-toolbar-title>
        <v-btn to="/" class="home-v-btn">
          <v-img
            src="https://www.onsen.ag/_nuxt/img/98a6440.png"
            class=""
            style="width: 150px"
          />
        </v-btn>
      </v-toolbar-title>
      <!-- Right button -->
      <v-spacer></v-spacer>
      <v-btn type="text" to="/">ご利用ガイド</v-btn>
      <v-btn type="text" to="/about">音泉通販</v-btn>
      <v-btn type="text" to="/test">音泉チャンネル</v-btn>
      <v-btn type="text" to="/test">更新情報</v-btn>
      <v-btn type="text" to="/test">PREMIUM</v-btn>
      <v-btn type="text" to="/test">インフォメーション</v-btn>
      <v-btn type="text" to="/test">
        <v-img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEqADAAQAAAABAAAAFAAAAAAV6Uf1AAABrUlEQVQ4EZWUzytEURTHZ/wqVixGg1JSsmChKBursbab8WunlFgoG2WDlX+Alf+AERsLoYSSIskGW7HwM5Efk+Lzfc6r23heb0593veec8+dO+ee+148FouNQjW4toez7Qb+GbcR74FFzafhG45hC07hAZIQZnVM3sC8m7SMs2KBcvQc1swPkgqC2ngTStyEBM4dDFqwE/1yfAt7EuepjS+g0ovkPTL4j1Bj8Tk0qMRZy2uyvEDJEl23mTL0DFbNl/RCDlJywkzdU4lDlqSuaOEAdMAbqMuRTLs+Q71lT6P3oA4tWCyyqIO6CjpYdUUdurIxEt1Uov6FX0YL4w/oh4JNi16h0VZOovpxbVKQ6ax043ehCIrhAFR2ZGsnUx3yD3rCVuruKN5nfqjUMnsNfodU4js0g2wcdEVCS9R7dgTqmPsO6VIegspTJ3cgC4GmhCW4hKq8jCS+XpcpizegL6Bz/GMzRJ5A5xBkut2f0GqTI6hKTJjvSYZnDrrdYMBYn5YTKLW5DVRfAs/8Do35gRD1S9wnR9dAqiuS1rkMg8z7XP4OQ58pZrvyMm5/AIh6VCYDGXE0AAAAAElFTkSuQmCC"
          alt="Sample Image"
          aspect-ratio="1.7"
          width="30"
        />
      </v-btn>
      <v-btn type="text" to="/test">
        <v-img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAA20lEQVQ4je2TPQrCQBSEP9RSsPQCVv6EgKBgYyHYCzbewM6TiK2F4C0UBA/gBbxESi2VkeAKm7hxg6Z0IGR3582XB/uCJN8zlXSTNPPVlvCrDZSBvq8yDyy3/rBiYENgBdQyMvH5EhiljYqjeAFMgAEwdoAOQA9oAMeE6xi+lqRIT50krcx6a/YyfjudzZrmjgW8K6nI+G+5T7+HDZTVkRP0gtUl7SXVPMAsUJzbxZx4E5jiMOOLTUlr83b5ockHrttM6wzMc9QVO7R2Zxvg+gWjasNegO5PbcHlAQSyfYdj7F5wAAAAAElFTkSuQmCC"
          alt="Application Image"
          width="20"
        />
        <p>&nbsp;アプリ</p>
      </v-btn>
      <v-btn type="text" to="/test">
        <v-img
          src="https://www.onsen.ag/assets/img/common/icon-header-02.png"
          alt="Login Image"
          width="20"
        />
        <p>&nbsp;ログイン</p>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Desk -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about">
          <v-list-item-title>About</v-list-item-title>
        </v-list-item>
        <v-list-item to="/test">
          <v-list-item-title>Contact</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 메인 콘텐츠 -->
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
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
</style>
