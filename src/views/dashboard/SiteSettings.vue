<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t("dashboard.settings") }}
    </h1>

    <BaseCard>
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></div>
      </div>

      <form v-else @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.site_name" label="Site Name" />
          <BaseInput
            v-model="form.contact_email"
            label="Contact Email"
            type="email"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Logo URL</label
          >
          <div class="flex gap-4 items-center">
            <div class="flex-grow">
              <BaseInput
                v-model="form.logo"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div
              v-if="form.logo"
              class="h-12 w-12 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden bg-white"
            >
              <img
                :src="form.logo"
                alt="Logo Preview"
                class="max-h-full max-w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Primary Color</label
          >
          <div class="flex gap-4 items-center">
            <input
              type="color"
              v-model="form.primary_color"
              class="h-10 w-20 rounded cursor-pointer"
            />
            <span class="text-gray-600 dark:text-gray-400">{{
              form.primary_color
            }}</span>
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Default Theme</label
          >
          <select
            v-model="form.theme_mode"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >About Content (English)</label
            >
            <textarea
              v-model="form.about_en"
              rows="4"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >About Content (Arabic)</label
            >
            <textarea
              v-model="form.about_ar"
              rows="4"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-right"
              dir="rtl"
            ></textarea>
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Google Ads Script</label
          >
          <textarea
            v-model="form.google_ads_script"
            rows="4"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="<script>...</script>"
          ></textarea>
          <div class="mt-2 flex items-center">
            <input
              type="checkbox"
              id="ads_enabled"
              v-model="form.ads_enabled"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              for="ads_enabled"
              class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >Enable Google Ads</label
            >
          </div>
        </div>

        <!-- Footer Settings (Owner Only) -->
        <div
          v-if="isOwner"
          class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Footer Settings
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Footer Text (English)</label
              >
              <input
                v-model="form.footer_en"
                type="text"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                placeholder="© 2025 - Site Name"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Footer Text (Arabic)</label
              >
              <input
                v-model="form.footer_ar"
                type="text"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 text-right"
                dir="rtl"
                placeholder="© 2025 - اسم الموقع"
              />
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <BaseButton
              @click="saveFooter"
              :loading="savingFooter"
              type="button"
            >
              Save Footer
            </BaseButton>
          </div>
        </div>

        <div class="flex justify-end">
          <BaseButton type="submit" :loading="saving">
            {{ $t("dashboard.save") }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import api from "@/api";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/auth";

const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const savingFooter = ref(false);
const footerExists = ref(false);

// Check if user is owner
const isOwner = computed(() => {
  return authStore.user && authStore.user.role === "owner";
});

const form = ref({
  site_name: "",
  logo: "",
  contact_email: "",
  primary_color: "#0ea5e9",
  theme_mode: "light",
  about_en: "",
  about_ar: "",
  google_ads_script: "",
  ads_enabled: false,
  footer_ar: "",
  footer_en: "",
});

const fetchFooterData = async () => {
  if (!isOwner.value) return;

  try {
    const footerResponse = await api.get("/about/footer");
    if (footerResponse.data && footerResponse.data.data) {
      footerExists.value = true;
      form.value.footer_ar = footerResponse.data.data.title_ar || "";
      form.value.footer_en = footerResponse.data.data.title_en || "";
    }
  } catch (footerError) {
    // Footer doesn't exist yet (404), that's okay
    footerExists.value = false;
    console.log("Footer not found, will create on save");
  }
};

const fetchSettings = async () => {
  try {
    loading.value = true;
    const response = await api.get("/settings");
    if (response.data) {
      form.value = { ...form.value, ...response.data };
    }

    // Fetch footer data only if user is owner
    await fetchFooterData();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  try {
    saving.value = true;
    await api.put("/settings", form.value);

    // Update local store
    settingsStore.siteName = form.value.site_name;
    settingsStore.logo = form.value.logo;

    alert("Settings saved successfully");
  } catch (error) {
    console.error("Failed to save settings:", error);
    alert("Failed to save settings");
  } finally {
    saving.value = false;
  }
};

const saveFooter = async () => {
  if (!isOwner.value) {
    alert("Only owners can modify footer settings");
    return;
  }

  try {
    savingFooter.value = true;

    if (footerExists.value) {
      // Update existing footer
      await api.put("/about/footer", {
        title_ar: form.value.footer_ar,
        title_en: form.value.footer_en,
      });
    } else {
      // Create new footer
      await api.post("/about", {
        key_name: "footer",
        title_ar: form.value.footer_ar,
        title_en: form.value.footer_en,
      });
      footerExists.value = true;
    }

    alert("Footer saved successfully");
  } catch (error) {
    console.error("Failed to save footer:", error);
    alert("Failed to save footer");
  } finally {
    savingFooter.value = false;
  }
};

// Watch for user data to become available
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    // When user data loads and user is owner, fetch footer data
    if (newUser && !oldUser && newUser.role === "owner") {
      fetchFooterData();
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchSettings();
});
</script>
