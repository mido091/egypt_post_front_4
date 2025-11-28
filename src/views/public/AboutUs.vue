<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t("about.section_title", { siteName: settingsStore.siteName }) }}
        </h1>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          ></div>
        </div>

        <div v-else class="prose dark:prose-invert max-w-none">
          <div
            class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg"
            v-html="displayContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import publicApi from "@/api/public";

import { useSettingsStore } from "@/stores/settings";

const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const loading = ref(false);
const aboutContent = ref("");

const fallbackContentAr = computed(
  () => `${settingsStore.settings.site_name} 
تطبيق ويب سريع وبسيط يسهل خدمات البريد المصري من خلال واجهة سهلة الاستخدام تستطيع من خلالها استخدام جميع خدمات هيئة البريد المصري الالكترونية، يهدف موقع الى حصر جميع مكاتب بريد فى محافظات مصر في جميع المناطق وتوفير جميع بيانات كل مكتب بريد.
يقوم فريق عمل ${settingsStore.settings.site_name} بجمع بيانات كل مكتب بريد ويقسمها الى معلومات أساسية مثل

الرمز البريدى
الرقم المالي
العنوان
رقم هاتف المكتب
مواعيد العمل
يوضح فريق عمل فترات عمل كل مكتب وأيام عمل المكتب بالإضافة الى ساعات العمل

خدمات مكتب البريد
توفر هيئة البريد المصري خدمات عديدة وتعمل بشكل مستمر على تطوير الخدمات الموجودة من ناحية ومن ناحية اخرى تعمل على زيادة هذه الخدمات من خلال إضافة خدمات جديدة، ويأتى هنا دور فريق عمل لتوضيح اذا كان مكتب البريد يوفر الخدمة أم لا وعلى سبيل الذكر وليس الحصر هذه مجموعة من الخدمات التى يقوم فريق العمل بحصرها داخل كل مكتب

البريد السريع
البريد المسجل
البريد العادي
الخدمات العقارية
الخدمات القنصلية
الأحوال المدنية
إرسال الشحنات
حساب التوفير
الحساب الجاري
تحويل الأموال
استقبال المدفوعات
الصناديق الخاصة
خدمات فوري
الصراف الآلي
موقع مكتب البريد
يقوم فريق عمل ${settingsStore.settings.site_name} بتحديد إحداثيات كل مكتب بريد على الخريطة لتسهيل عمل تحديد الاتجاهات من موقعك`
);

const fallbackContentEn = computed(
  () => `${settingsStore.settings.site_name_en}
A fast and simple web application that facilitates Egyptian Post services through an easy-to-use interface through which you can use all the electronic services of the Egyptian Post Authority. The site aims to inventory all post offices in the governorates of Egypt in all regions and provide all data for each post office.

The ${settingsStore.settings.site_name_en} team collects data for each post office and divides it into basic information such as:

Postal Code
Financial Number
Address
Office Phone Number
Working Hours

The team clarifies the working periods of each office, the office's working days, and working hours.

Post Office Services
The Egyptian Post Authority provides many services and works continuously to develop existing services on the one hand, and on the other hand works to increase these services by adding new services. Here comes the role of the team to clarify whether the post office provides the service or not. For example, but not limited to, this is a set of services that the team inventories within each office:

Express Mail
Registered Mail
Regular Mail
Real Estate Services
Consular Services
Civil Status
Shipping
Savings Account
Current Account
Money Transfer
Receiving Payments
Private Boxes
Fawry Services
ATM

Post Office Location
The ${settingsStore.settings.site_name_en} team determines the coordinates of each post office on the map to facilitate determining directions from your location.`
);

const displayContent = computed(() => {
  if (aboutContent.value) {
    return aboutContent.value;
  }
  return locale.value === "ar"
    ? fallbackContentAr.value
    : fallbackContentEn.value;
});

const fetchAboutContent = async () => {
  loading.value = true;
  try {
    const response = await publicApi.getAbout();
    // Handle different response formats
    let data = response.data;

    if (data.success && data.data) {
      data = data.data;
    }

    // If data is array, find about_us entry
    if (Array.isArray(data)) {
      const aboutEntry = data.find((item) => item.key_name === "about_us");
      if (aboutEntry && aboutEntry.content) {
        aboutContent.value = aboutEntry.content;
      }
    } else if (data.content) {
      aboutContent.value = data.content;
    }
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    // Use fallback content
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAboutContent();
});
</script>
