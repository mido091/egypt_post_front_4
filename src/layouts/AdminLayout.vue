<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-gray-100 dark:border-gray-700"
      :class="[
        isSidebarOpen
          ? 'translate-x-0'
          : $i18n.locale === 'ar'
          ? 'translate-x-full lg:translate-x-0'
          : '-translate-x-full lg:translate-x-0',
        $i18n.locale === 'ar' ? 'right-0' : 'left-0',
      ]"
    >
      <div
        class="flex items-center justify-center h-20 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900"
      >
        <!-- FIX #4: Wrap site title in router-link -->
        <router-link
          to="/"
          class="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition-opacity"
        >
          {{ siteName }}
        </router-link>
      </div>

      <nav class="mt-6 px-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-4 py-3.5 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-200 group"
          :class="{
            'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white shadow-sm':
              $route.path === item.path,
          }"
          @click="closeSidebarOnMobile"
        >
          <component
            :is="item.icon"
            class="w-6 h-6 transition-colors duration-200"
            :class="$i18n.locale === 'ar' ? 'ml-3' : 'mr-3'"
          />
          <span class="font-semibold text-base">{{ $t(item.label) }}</span>
        </router-link>
      </nav>
    </aside>

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
      @click="uiStore.closeSidebar"
    ></div>

    <!-- Main Content -->
    <div
      class="min-h-screen flex flex-col transition-all duration-300"
      :class="$i18n.locale === 'ar' ? 'lg:mr-72' : 'lg:ml-72'"
    >
      <!-- Header -->
      <header
        class="bg-white dark:bg-gray-800 shadow-sm h-20 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300"
      >
        <button
          @click="uiStore.toggleSidebar"
          class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <Bars3Icon class="w-7 h-7" />
        </button>

        <div
          class="flex items-center space-x-4"
          :class="$i18n.locale === 'ar' ? 'space-x-reverse' : ''"
        >
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {{ $i18n.locale === "ar" ? "English" : "العربية" }}
          </button>

          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <SunIcon
              v-if="themeStore.theme === 'dark'"
              class="w-6 h-6 text-yellow-400"
            />
            <MoonIcon v-else class="w-6 h-6 text-gray-600" />
          </button>

          <!-- User Menu -->
          <div
            class="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700"
            :class="
              $i18n.locale === 'ar'
                ? 'space-x-reverse border-l-0 border-r pr-4 pl-0'
                : ''
            "
          >
            <div
              class="text-right hidden sm:block"
              :class="$i18n.locale === 'ar' ? 'text-left' : 'text-right'"
            >
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                {{ authStore.user?.username }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {{ $t(`users.roles.${authStore.user?.role}`) }}
              </p>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-colors"
              :title="$t('common.logout')"
            >
              <ArrowRightOnRectangleIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 lg:p-8 overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Global UI Components -->
    <BaseToast />
    <LoadingSpinner />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { useThemeStore } from "@/stores/theme";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import BaseToast from "@/components/ui/BaseToast.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ShareIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const themeStore = useThemeStore();
const settingsStore = useSettingsStore();
const { isSidebarOpen } = storeToRefs(uiStore);
const { locale } = useI18n();

// Dynamic site name based on language
const siteName = computed(() => {
  return locale.value === "ar"
    ? settingsStore.settings.site_name || "الموقع"
    : settingsStore.settings.site_name_en || "Site";
});

// Initialize theme on mount
onMounted(() => {
  themeStore.init();
});

const menuItems = computed(() => {
  const items = [
    {
      name: "Dashboard",
      path: "/dashboard",
      label: "nav.home",
      icon: HomeIcon,
      roles: ["owner", "admin", "editor"],
    },
    {
      name: "Posts",
      path: "/dashboard/posts",
      label: "nav.posts",
      icon: DocumentTextIcon,
      roles: ["owner", "admin", "editor"],
    },
    {
      name: "Users",
      path: "/dashboard/users",
      label: "nav.users",
      icon: UsersIcon,
      roles: ["owner"],
    },
    {
      name: "Social",
      path: "/dashboard/social",
      label: "nav.social",
      icon: ShareIcon,
      roles: ["owner"],
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      label: "nav.settings",
      icon: Cog6ToothIcon,
      roles: ["owner"],
    },
  ];

  return items.filter((item) => item.roles.includes(authStore.user?.role));
});

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    uiStore.closeSidebar();
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const toggleLanguage = () => {
  const newLocale = settingsStore.locale === "ar" ? "en" : "ar";
  settingsStore.setLocale(newLocale);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
