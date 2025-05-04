// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  modules: ["@sidebase/nuxt-auth", "@pinia/nuxt"],
  devtools: { enabled: true },
  css: ["vuetify/lib/styles/main.css", "@mdi/font/css/materialdesignicons.css"], // Vuetify 기본 CSS 추가
  build: {
    transpile: ["vuetify"], // Vuetify 트랜스파일 설정
  },
  auth: {
    baseURL: process.env.NODE_ENV === "production" ? process.env.AUTH_ORIGIN : "http://localhost:3000",
    provider: {
      type: "authjs",
    },
  },
  plugins: [
    "~/plugins/axios.ts", // axios 플러그인
    "~/plugins/trackIp.client.ts", // trackIp 클라이언트 플러그인
    "~/plugins/pinia.ts",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.AUTH_ORIGIN,
    },
    trustProxy: true,
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        ignored: ["**/node_modules/**", "**/.git/**"],
      },
    },
  },
  nitro: {
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "access-control-allow-origin":
            "http://ec2-43-203-220-238.ap-northeast-2.compute.amazonaws.com",
          "access-control-allow-credentials": "true",
          "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
          "access-control-allow-headers":
            "Content-Type, Authorization, X-CSRF-Token",
        },
      },
    },
  },
});
