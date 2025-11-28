<template>
  <nav
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex-shrink-0 flex items-center gap-2">
            <img
              class="h-8 w-auto rounded-full"
              :src="
                settingsStore.currentLogo ||
                'https://upload.wikimedia.org/wikipedia/commons/2/2c/Egypt_Post_logo.svg'
              "
              :alt="settingsStore.siteName"
            />
            <span
              class="ml-3 text-xl font-bold text-gray-900 dark:text-white hidden sm:block"
              >{{ settingsStore.siteName }}</span
            >
          </router-link>
          <div
            class="hidden gap-3 sm:ml-6 sm:flex sm:space-x-8 rtl:space-x-reverse"
          >
            <router-link
              to="/"
              active-class="border-primary-500 text-gray-900 dark:text-white"
              class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
            >
              {{ $t("common.home") }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button
            @click="
              themeStore.setTheme(
                themeStore.theme === 'dark' ? 'light' : 'dark'
              )
            "
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
          >
            <SunIcon v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>

          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none font-bold"
          >
            {{ settingsStore.locale === "ar" ? "EN" : "عربي" }}
          </button>

          <!-- Auth Buttons -->
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {{ $t("common.dashboard") }}
            </router-link>
            <button
              @click="handleLogout"
              class="text-sm font-medium text-red-600 hover:text-red-700"
            >
              {{ $t("common.logout") }}
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {{ $t("common.login") }}
            </router-link>
            <!-- Register button removed - registration is owner-only via dashboard -->
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const settingsStore = useSettingsStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const router = useRouter();

const toggleLanguage = () => {
  const newLang = settingsStore.locale === "ar" ? "en" : "ar";
  settingsStore.setLocale(newLang);
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
