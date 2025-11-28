<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import LeafletMap from "@/components/map/LeafletMap.vue";
import api from "@/api";
import { fuzzyMatch } from "@/utils/textNormalize";
import BaseInput from "@/components/common/BaseInput.vue";

const route = useRoute();
const govCode = computed(() => route.params.code);
const offices = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const selectedOfficeId = ref(null);

const fetchOffices = async () => {
  try {
    loading.value = true;
    const response = await api.get("/posts");
    const data = response.data;

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

const selectOffice = (office) => {
  selectedOfficeId.value = office._id || office.id;
  // Scroll to map on mobile if needed
  const mapElement = document.getElementById("gov-map");
  if (mapElement && window.innerWidth < 1024) {
    mapElement.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  fetchOffices();
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
            <div class="w-full md:w-96">
              <BaseInput
                v-model="searchQuery"
                :placeholder="$t('common.search_placeholder')"
                class="w-full"
              />
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
              {{ office.name }}
            </h3>

            <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {{ office.address }}
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
