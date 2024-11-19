// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["vuetify/lib/styles/main.css", "@mdi/font/css/materialdesignicons.css"], // Vuetify 기본 CSS 추가
  build: {
    transpile: ["vuetify"], // Vuetify 트랜스파일 설정
  },
  
});
