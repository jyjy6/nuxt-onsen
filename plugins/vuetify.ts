// plugins/vuetify.ts
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light", // 기본 테마 설정
    },
    icons: {
      defaultSet: "mdi", // MDI 아이콘 세트
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
