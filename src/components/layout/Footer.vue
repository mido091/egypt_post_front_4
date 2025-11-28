<template>
  <footer
    class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto"
  >
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div
          class="flex justify-center md:justify-start space-x-6 md:order-2 rtl:space-x-reverse"
        >
          <!-- Social links can go here -->
        </div>
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-base text-gray-400 dark:text-gray-500">
            {{ footerText }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/stores/settings";
import publicApi from "@/api/public";

const { locale, t } = useI18n();
const settingsStore = useSettingsStore();

const footerData = ref({
  title_ar: "",
  title_en: "",
});

const footerText = computed(() => {
  // If custom footer text exists, use it
  if (locale.value === "ar" && footerData.value.title_ar) {
    return footerData.value.title_ar;
  }
  if (locale.value === "en" && footerData.value.title_en) {
    return footerData.value.title_en;
  }

  // Fallback to default format with translated site name
  const year = new Date().getFullYear();
  const siteName =
    settingsStore.siteName ||
    (locale.value === "ar" ? "اسم الموقع" : "Site Name");

  return t("common.copyright", { siteName });
});

const fetchFooterData = async () => {
  try {
    const response = await publicApi.getFooter();
    if (response.data && response.data.data) {
      footerData.value = {
        title_ar: response.data.data.title_ar || "",
        title_en: response.data.data.title_en || "",
      };
    }
  } catch (error) {
    // Footer doesn't exist (404) or other error - use fallback
    console.log("Footer not found, using fallback");
  }
};

onMounted(() => {
  fetchFooterData();
});
</script>
