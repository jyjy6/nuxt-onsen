// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["vuetify/lib/styles/main.css", "@mdi/font/css/materialdesignicons.css"], // Vuetify 기본 CSS 추가
  build: {
    transpile: ["vuetify"], // Vuetify 트랜스파일 설정
  },
  plugins: [
    "~/plugins/axios.ts", // axios 플러그인
    "~/plugins/trackIp.client.ts", // trackIp 클라이언트 플러그인
  ],
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000/api",
    },
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
});
