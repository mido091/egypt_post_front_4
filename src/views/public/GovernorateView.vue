<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BuildingOfficeIcon } from "@heroicons/vue/24/outline";
import LeafletMap from "@/components/map/LeafletMap.vue";
import api from "@/api";
import { fuzzyMatch } from "@/utils/textNormalize";
import BaseInput from "@/components/common/BaseInput.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const govCode = computed(() => route.params.code);
const offices = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedOfficeId = ref(null);
const showSuggestions = ref(false);
const searchInputRef = ref(null);
const allGovernorates = ref({});

const fetchOffices = async () => {
  try {
    loading.value = true;
    const response = await api.get("/posts");
    const data = response.data;
    allGovernorates.value = data;

    let govOffices = [];
    if (Array.isArray(data)) {
      govOffices = data.filter((o) => o.gov_code === govCode.value);
    } else {
      govOffices = data[govCode.value] || [];
    }
    offices.value = govOffices;
  } catch (error) {
    console.error("Failed to fetch offices:", error);
  } finally {
    loading.value = false;
  }
};

const filteredOffices = computed(() => {
  if (!searchQuery.value) return offices.value;

  return offices.value.filter((office) => {
    return (
      fuzzyMatch(office.name, searchQuery.value) ||
      fuzzyMatch(office.address, searchQuery.value) ||
      (office.postal_code &&
        office.postal_code.toString().includes(searchQuery.value))
    );
  });
});

const filteredSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 1) return [];

  const suggestions = offices.value.filter((office) => {
    return (
      fuzzyMatch(office.name, searchQuery.value) ||
      fuzzyMatch(office.address, searchQuery.value) ||
      (office.postal_code &&
        office.postal_code.toString().includes(searchQuery.value))
    );
  });

  return suggestions.slice(0, 8); // Limit to 8 suggestions
});

const selectSuggestion = (office) => {
  searchQuery.value = office.name;
  showSuggestions.value = false;
  // Navigate to office details page
  router.push({
    name: "office-details",
    params: { id: office._id || office.id },
  });
};

const handleSearchFocus = () => {
  if (searchQuery.value && filteredSuggestions.value.length > 0) {
    showSuggestions.value = true;
  }
};

const handleSearchInput = () => {
  if (searchQuery.value && filteredSuggestions.value.length > 0) {
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
  }
};

const handleClickOutside = (event) => {
  if (searchInputRef.value && !searchInputRef.value.contains(event.target)) {
    showSuggestions.value = false;
  }
};

const selectOffice = (office) => {
  selectedOfficeId.value = office._id || office.id;
  router.push({
    name: "office-details",
    params: { id: office._id || office.id },
  });
};

onMounted(() => {
  fetchOffices();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main
      class="flex-grow bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto h-full flex flex-col">
        <!-- Header -->
        <div class="mb-6">
          <router-link
            to="/"
            class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-4"
          >
            &larr; {{ $t("common.home") }}
          </router-link>
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ govCode }}
            </h1>

            <!-- Search -->
            <div class="w-full md:w-96 relative" ref="searchInputRef">
              <BaseInput
                v-model="searchQuery"
                :placeholder="$t('common.search_placeholder')"
                class="w-full"
                @input="handleSearchInput"
                @focus="handleSearchFocus"
              />

              <!-- Autocomplete Dropdown -->
              <transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="showSuggestions && filteredSuggestions.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 max-h-80 overflow-y-auto"
                >
                  <div
                    v-for="office in filteredSuggestions"
                    :key="office._id || office.id"
                    @click="selectSuggestion(office)"
                    class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 ease-in-out border-b border-gray-50 dark:border-gray-700 last:border-b-0 group"
                  >
                    <div class="flex items-start gap-3">
                      <BuildingOfficeIcon
                        class="h-5 w-5 text-primary-500 group-hover:text-primary-600 mt-0.5 flex-shrink-0"
                      />
                      <div class="flex-1 min-w-0">
                        <div
                          class="text-gray-900 dark:text-white font-medium truncate"
                        >
                          {{
                            $i18n.locale === "ar"
                              ? office.name_ar || office.name
                              : office.name_en || office.name
                          }}
                        </div>
                        <div
                          class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
                        >
                          {{
                            $i18n.locale === "ar"
                              ? office.address_ar || office.address
                              : office.address_en || office.address
                          }}
                        </div>
                      </div>
                      <span
                        class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono flex-shrink-0"
                      >
                        {{ office.postal_code }}
                      </span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          ></div>
        </div>

        <!-- list -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          <div
            v-for="office in filteredOffices"
            :key="office._id || office.id"
            @click="selectOffice(office)"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-all"
            :class="{
              'ring-2 ring-primary-500':
                selectedOfficeId === (office._id || office.id),
            }"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {{
                $i18n.locale === "ar"
                  ? office.name_ar || office.name
                  : office.name_en || office.name
              }}
            </h3>

            <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {{
                $i18n.locale === "ar"
                  ? office.address_ar || office.address
                  : office.address_en || office.address
              }}
            </p>

            <div class="flex justify-between items-center">
              <span
                class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono"
              >
                {{ office.postal_code }}
              </span>

              <router-link
                :to="{
                  name: 'office-details',
                  params: { id: office._id || office.id },
                }"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                @click.stop
              >
                {{ $t("common.view_details") }} →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
