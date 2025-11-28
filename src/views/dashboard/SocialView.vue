<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1
        class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        {{ $t("social.title") }}
      </h1>
      <BaseButton @click="openModal()">
        <template #default>
          <span class="mr-2">+</span> {{ $t("social.add_link") }}
        </template>
      </BaseButton>
    </div>

    <BaseCard>
      <BaseTable :headers="headers" :items="links" :loading="loading">
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2 rtl:space-x-reverse">
            <BaseButton
              size="sm"
              variant="secondary"
              @click="openModal(item)"
              >{{ $t("common.edit") }}</BaseButton
            >
            <BaseButton
              size="sm"
              variant="danger"
              @click="confirmDelete(item)"
              >{{ $t("common.delete") }}</BaseButton
            >
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Add/Edit Link Modal -->
    <BaseModal
      :isOpen="isModalOpen"
      :title="editingLink ? $t('common.edit') : $t('social.add_link')"
      @close="closeModal"
      @confirm="saveLink"
    >
      <div class="space-y-5">
        <!-- Provider Dropdown -->
        <div>
          <label
            class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2"
          >
            {{ $t("social.provider") }} <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.provider"
            :disabled="!!editingLink"
            class="block w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {{ $t("social.select_provider") }}
            </option>
            <option
              v-for="provider in availableProviders"
              :key="provider"
              :value="provider"
            >
              {{ provider }}
            </option>
          </select>
          <p
            v-if="editingLink"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ $t("social.provider_locked") }}
          </p>
        </div>

        <!-- URL Input -->
        <BaseInput
          v-model="form.url"
          :label="$t('social.url')"
          type="url"
          required
          placeholder="https://..."
        />
      </div>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :isOpen="isDeleteModalOpen"
      :title="$t('common.delete')"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    >
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t("common.confirm") }}
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="handleDelete">{{
          $t("common.delete")
        }}</BaseButton>
        <BaseButton variant="secondary" @click="closeDeleteModal">{{
          $t("common.cancel")
        }}</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import adminApi from "@/api/admin";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useUiStore } from "@/stores/ui";

const { t } = useI18n();
const uiStore = useUiStore();
const links = ref([]);
const loading = ref(false);

// Fixed list of available providers
const ALL_PROVIDERS = [
  "Facebook",
  "Telegram",
  "WhatsApp",
  "X",
  "Instagram",
  "Gmail",
];

const headers = computed(() => [
  { key: "provider", label: t("social.provider") },
  { key: "url", label: t("social.url") },
]);

// Modal State
const isModalOpen = ref(false);
const editingLink = ref(null);
const form = ref({
  provider: "",
  url: "",
});

// Delete State
const isDeleteModalOpen = ref(false);
const linkToDelete = ref(null);

// Computed: Available providers for dropdown
// Filter out providers that already have a non-empty URL
const availableProviders = computed(() => {
  if (editingLink.value) {
    // When editing, only show the current provider
    return [editingLink.value.provider];
  }

  // When adding new, filter out providers with non-empty URLs
  const configuredProviders = links.value
    .filter((link) => link.url && link.url.trim() !== "")
    .map((link) => link.provider);

  return ALL_PROVIDERS.filter(
    (provider) => !configuredProviders.includes(provider)
  );
});

const fetchLinks = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getSocialLinks();
    // Extract data array from { success: true, data: [...] }
    links.value = res.data.data || res.data;
  } catch (error) {
    uiStore.showToast(t("common.error"), "error");
  } finally {
    loading.value = false;
  }
};

const openModal = (link = null) => {
  editingLink.value = link;
  if (link) {
    form.value = { ...link };
  } else {
    form.value = {
      provider: "",
      url: "",
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingLink.value = null;
};

const saveLink = async () => {
  if (!form.value.provider || !form.value.url) {
    uiStore.showToast(t("common.required"), "error");
    return;
  }

  // Validate URL format
  if (!form.value.url.trim()) {
    uiStore.showToast(t("social.url_required"), "error");
    return;
  }

  uiStore.setLoading(true);
  try {
    if (editingLink.value) {
      await adminApi.updateSocialLink(editingLink.value.provider, form.value);
      uiStore.showToast(t("common.success"), "success");
    } else {
      await adminApi.createSocialLink(form.value);
      uiStore.showToast(t("common.success"), "success");
    }
    closeModal();
    fetchLinks();
  } catch (error) {
    uiStore.showToast(
      error.response?.data?.message || t("common.error"),
      "error"
    );
  } finally {
    uiStore.setLoading(false);
  }
};

const confirmDelete = (link) => {
  linkToDelete.value = link;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  linkToDelete.value = null;
};

const handleDelete = async () => {
  if (!linkToDelete.value) return;

  uiStore.setLoading(true);
  try {
    await adminApi.deleteSocialLink(linkToDelete.value.provider);
    uiStore.showToast(t("common.success"), "success");
    closeDeleteModal();
    fetchLinks();
  } catch (error) {
    uiStore.showToast(t("common.error"), "error");
  } finally {
    uiStore.setLoading(false);
  }
};

onMounted(() => {
  fetchLinks();
});
</script>
