<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t("about.disclaimer_title") }}
        </h1>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="prose dark:prose-invert max-w-none">
          <div
            class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg"
          >
            {{ disclaimerContent }}
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
        >
          {{ $t("common.back") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useSettingsStore } from "@/stores/settings";

const { locale } = useI18n();
const settingsStore = useSettingsStore();

const disclaimerContentAr = computed(
  () => `موقع وتطبيق ${settingsStore.settings.site_name} هو موقع غير رسمي ولا يدعم أي نوع من أنواع المعاملات المالية ولكن فقط يقوم بتوفير خدمات هيئة البريد المصري وعرضه بشكل سلس وسريع مما يسهل على المواطنين عملية اتخاذ القرار من خلال تزويدهم بأكبر قدر من المعلومات سواء عن مكاتب البريد أو الخدمات الإلكترونية للبريد المصري 
البريد المصري يقوم بجمع المعلومات من مصادر موثوقة ويقدمها لك في صيغة مرتبة ومنظمة تستطيع الوصول لها فى اى وقت اونلاين بدون رسوم اى مجانية تماما ويعمل فريق البريد المصري على تحديثها بشكل مستمر طبقا لموقع هيئة البريد المصري.`
);

const disclaimerContentEn = computed(
  () => `The ${settingsStore.settings.site_name_en} website and application is an unofficial website and does not support any type of financial transactions, but only provides Egyptian Post Authority services and displays them in a smooth and fast manner, which facilitates the decision-making process for citizens by providing them with the maximum amount of information, whether about post offices or electronic services of the Egyptian Post.

Egyptian Post collects information from reliable sources and presents it to you in an organized and structured format that you can access at any time online without fees, completely free of charge. The Egyptian Post team works to update it continuously according to the Egyptian Post Authority website.`
);

const disclaimerContent = computed(() => {
  return locale.value === "ar"
    ? disclaimerContentAr.value
    : disclaimerContentEn.value;
});
</script>
