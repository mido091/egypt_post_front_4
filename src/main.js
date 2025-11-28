import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import "./main.css";
import en from "./i18n/en.json";
import ar from "./i18n/ar.json";
import { useSettingsStore } from "./stores/settings";

const app = createApp(App);
const pinia = createPinia();

export const i18n = createI18n({
  legacy: false,
  locale: "ar",
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

app.use(pinia);
app.use(router);
app.use(i18n);

import { useThemeStore } from "./stores/theme";
import { useAuthStore } from "./stores/auth";

const settingsStore = useSettingsStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

// Initialize stores
settingsStore.init();
themeStore.init();
authStore.init(); // FIX: Initialize auth store to hydrate from localStorage

app.mount("#app");
