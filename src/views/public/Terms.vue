<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t("about.terms_title") }}
        </h1>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div class="prose dark:prose-invert max-w-none">
          <div
            class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg"
          >
            {{ termsContent }}
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

const termsContentAr = computed(
  () => `الشروط والأحكام

مرحباً بك في موقع ${settingsStore.settings.site_name}. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية:

1. استخدام الموقع
موقع ${settingsStore.settings.site_name} هو منصة معلوماتية تهدف إلى توفير معلومات عن مكاتب البريد المصري وخدماته. الموقع غير رسمي ولا يمثل هيئة البريد المصري.

2. دقة المعلومات
نبذل قصارى جهدنا لضمان دقة المعلومات المقدمة، ولكننا لا نضمن صحة أو اكتمال أي معلومات على الموقع. يجب عليك التحقق من المعلومات من مصادر رسمية قبل اتخاذ أي قرارات.

3. المسؤولية
موقع ${settingsStore.settings.site_name} غير مسؤول عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام المعلومات المقدمة على الموقع.

4. الخصوصية
نحن نحترم خصوصيتك ولا نجمع معلومات شخصية دون موافقتك. يرجى مراجعة سياسة الخصوصية الخاصة بنا لمزيد من التفاصيل.

5. حقوق الملكية الفكرية
جميع المحتويات على هذا الموقع محمية بموجب قوانين حقوق النشر. لا يجوز نسخ أو توزيع أي محتوى دون إذن كتابي مسبق.

6. التعديلات
نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت دون إشعار مسبق.

7. القانون الحاكم
تخضع هذه الشروط والأحكام لقوانين جمهورية مصر العربية.

للاستفسارات أو الشكاوى، يرجى التواصل معنا عبر صفحة الاتصال.`
);

const termsContentEn = computed(
  () => `Terms and Conditions

Welcome to ${settingsStore.settings.site_name_en} website. By using this website, you agree to comply with the following terms and conditions:

1. Use of the Website
${settingsStore.settings.site_name_en} is an informational platform aimed at providing information about Egyptian Post offices and their services. The website is unofficial and does not represent the Egyptian Post Authority.

2. Accuracy of Information
We make every effort to ensure the accuracy of the information provided, but we do not guarantee the correctness or completeness of any information on the website. You should verify information from official sources before making any decisions.

3. Liability
${settingsStore.settings.site_name_en} website is not responsible for any direct or indirect damages that may result from using the information provided on the website.

4. Privacy
We respect your privacy and do not collect personal information without your consent. Please review our privacy policy for more details.

5. Intellectual Property Rights
All content on this website is protected under copyright laws. No content may be copied or distributed without prior written permission.

6. Amendments
We reserve the right to modify these terms and conditions at any time without prior notice.

7. Governing Law
These terms and conditions are subject to the laws of the Arab Republic of Egypt.

For inquiries or complaints, please contact us through the contact page.`
);

const termsContent = computed(() => {
  return locale.value === "ar" ? termsContentAr.value : termsContentEn.value;
});
</script>
