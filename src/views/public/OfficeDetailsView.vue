<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LeafletMap from "@/components/map/LeafletMap.vue";
import api from "@/api";
import { convertXYtoLatLng } from "@/utils/mapUtils";

const route = useRoute();
const office = ref(null);
const loading = ref(true);
const usefulInfo = ref(null);
const { locale } = useI18n();

const displayKeys = [
  "postal_code",
  "atm",
  "stamp_service",
  "foreign_transfer",
  "internal_transfer",
  "full_window_service",
  "ems_service",
];

const getLabel = (key) => {
  const labels = {
    postal_code: { ar: "الرمز البريدي", en: "Postal Code" },
    atm: { ar: "صراف آلي (ATM)", en: "ATM Service" },
    stamp_service: { ar: "شباك بيع الطوابع", en: "Stamp Window" },
    foreign_transfer: { ar: "قبول حوالات من الخارج", en: "Foreign Transfers" },
    internal_transfer: {
      ar: "قبول الحوالات الداخلية",
      en: "Internal Transfers",
    },
    full_window_service: {
      ar: "خدمة الشباك الكامل",
      en: "Full Window Service",
    },
    ems_service: { ar: "خدمة البريد السريع (EMS)", en: "EMS Service" },
  };
  return locale.value === "ar" ? labels[key]?.ar : labels[key]?.en;
};

const translateValue = (value) => {
  if (locale.value === "ar") return value;

  const map = {
    "داخل الخدمة": "Available",
    "خارج الخدمة": "Not Available",
    نعم: "Yes",
    لا: "No",
    "لايوجد خدمة": "Not Available",
    "": "Not Available",
  };

  return map[value] ?? value;
};

const fetchUsefulInformation = async () => {
  try {
    const response = await api.get("/informations");
    if (response.data && response.data.success && response.data.data) {
      const allInfo = response.data.data;

      // 1. Try to find exact match
      const match = allInfo.find(
        (item) => item.postal_code === office.value.postal_code
      );

      if (match) {
        usefulInfo.value = match;
      } else {
        // 2. Random from first 20
        const first20 = allInfo.slice(0, 20);
        if (first20.length > 0) {
          const random = first20[Math.floor(Math.random() * first20.length)];
          usefulInfo.value = random;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch useful information:", error);
  }
};

const fetchOffice = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/posts/${route.params.id}`);
    office.value = response.data;
    // Fetch useful info after office data is loaded (need postal code)
    await fetchUsefulInformation();
  } catch (error) {
    console.error("Failed to fetch office:", error);
  } finally {
    loading.value = false;
  }
};

const googleMapsLink = computed(() => {
  if (!office.value || !office.value.x || !office.value.y) return "#";
  const { lat, lng } = convertXYtoLatLng(
    parseFloat(office.value.x),
    parseFloat(office.value.y)
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
});

onMounted(() => {
  fetchOffice();
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main
      class="flex-grow bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></div>
      </div>

      <div v-else-if="!office" class="text-center py-12">
        <p class="text-gray-500 text-lg">{{ $t("common.no_data") }}</p>
      </div>

      <div v-else class="max-w-7xl mx-auto">
        <div class="mb-8">
          <button
            @click="$router.back()"
            class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-4"
          >
            &larr; {{ $t("common.governorates") }}
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ office.name }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            {{ office.gov_code }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Details Card -->
          <div class="lg:col-span-1 space-y-6">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
              <h2
                class="text-xl font-semibold mb-6 text-gray-900 dark:text-white"
              >
                {{ $t("common.view_details") }}
              </h2>

              <div class="space-y-4">
                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.address") }}</label
                  >
                  <p class="text-gray-900 dark:text-gray-100">
                    {{ office.address }}
                  </p>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.postal_code") }}</label
                  >
                  <p
                    class="text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block"
                  >
                    {{ office.postal_code }}
                  </p>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.phone") }}</label
                  >
                  <div class="space-y-1">
                    <p
                      v-if="office.phone1"
                      class="text-gray-900 dark:text-gray-100 flex items-center gap-2"
                    >
                      <span>{{ office.phone1 }}</span>
                    </p>
                    <p
                      v-if="office.phone2"
                      class="text-gray-900 dark:text-gray-100 flex items-center gap-2"
                    >
                      <span>{{ office.phone2 }}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.working_days") }}</label
                  >
                  <p class="text-gray-900 dark:text-gray-100">
                    {{
                      $t("office.working_days") === "office.working_days"
                        ? $i18n.locale === "ar"
                          ? "الأحد - الخميس"
                          : "Sunday - Thursday"
                        : $t("office.working_days")
                    }}
                  </p>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.working_hours") }}</label
                  >
                  <p class="text-gray-900 dark:text-gray-100">
                    {{
                      $t("office.working_hours") === "office.working_hours"
                        ? $i18n.locale === "ar"
                          ? "٨ ص - ٣ م"
                          : "8 AM – 3 PM"
                        : $t("office.working_hours")
                    }}
                  </p>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.hotline") }}</label
                  >
                  <p
                    class="text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block"
                  >
                    16789
                  </p>
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.email") }}</label
                  >
                  <a
                    href="mailto:customersupport@egyptpost.org"
                    class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >customersupport@egyptpost.org</a
                  >
                </div>

                <div>
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1"
                    >{{ $t("office.holidays") }}</label
                  >
                  <p class="text-gray-900 dark:text-gray-100">
                    {{
                      $t("office.holidays") === "office.holidays"
                        ? $i18n.locale === "ar"
                          ? "الجمعة والسبت وأيام العطلات الرسمية"
                          : "Friday, Saturday and official holidays"
                        : $t("office.holidays")
                    }}
                  </p>
                </div>
              </div>

              <div
                class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700"
              >
                <a
                  :href="googleMapsLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ $t("common.directions") }}
                </a>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div
            class="lg:col-span-2 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <LeafletMap
              :x="office.x"
              :y="office.y"
              :readonly="true"
              :popup-content="office.name"
            />
          </div>

          <!-- Useful Information Card -->
          <div
            v-if="usefulInfo"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 w-full lg:col-span-3"
          >
            <h2
              class="text-xl font-semibold mb-6 text-gray-900 dark:text-white"
            >
              {{
                $i18n.locale === "ar" ? "معلومات تهمك" : "Useful Information"
              }}
            </h2>

            <div class="space-y-0">
              <div
                v-for="key in displayKeys"
                :key="key"
                class="flex justify-between items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getLabel(key) }}
                </span>
                <span class="text-gray-900 dark:text-white font-semibold">
                  {{ translateValue(usefulInfo[key]) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
