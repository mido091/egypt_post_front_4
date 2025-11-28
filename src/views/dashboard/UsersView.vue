<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1
        class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight"
      >
        {{ $t("users.title") }}
      </h1>
      <BaseButton @click="openModal()">
        <template #default>
          <span class="mr-2">+</span> {{ $t("users.add_user") }}
        </template>
      </BaseButton>
    </div>

    <BaseCard>
      <BaseTable :headers="headers" :items="users" :loading="loading">
        <template #cell-role="{ value }">
          <span
            class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm"
            :class="{
              'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300':
                value === 'owner',
              'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300':
                value === 'admin',
              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':
                value === 'editor',
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                value === 'user',
            }"
          >
            {{ $t(`users.roles.${value}`) }}
          </span>
        </template>
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
              :disabled="item.role === 'owner'"
              >{{ $t("common.delete") }}</BaseButton
            >
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Add/Edit User Modal -->
    <BaseModal
      :isOpen="isModalOpen"
      :title="editingUser ? $t('users.edit_user') : $t('users.add_user')"
      @close="closeModal"
      @confirm="saveUser"
    >
      <div class="space-y-5">
        <BaseInput
          v-model="form.username"
          :label="$t('auth.username')"
          required
        />

        <BaseInput
          v-if="!editingUser"
          v-model="form.password"
          :label="$t('auth.password')"
          type="password"
          required
          helpText="Min 6 characters"
        />
        <div v-else>
          <BaseInput
            v-model="form.password"
            :label="$t('users.password_hint')"
            type="password"
          />
        </div>

        <!-- Role Selection (Only visible when editing, auto-set to admin on create) -->
        <div v-if="editingUser">
          <label
            class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2"
            >{{ $t("users.role") }}</label
          >
          <select
            v-model="form.role"
            class="block w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-base transition-colors"
          >
            <option value="admin">{{ $t("users.roles.admin") }}</option>
            <option value="editor">{{ $t("users.roles.editor") }}</option>
            <option value="user">{{ $t("users.roles.user") }}</option>
          </select>
        </div>
        <div
          v-else
          class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300"
        >
          {{ $t("users.roles.admin") }} role will be assigned automatically
        </div>
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
        {{ $t("users.delete_confirm", { name: userToDelete?.username }) }}
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
const users = ref([]);
const loading = ref(false);

const headers = computed(() => [
  { key: "username", label: t("auth.username") },
  { key: "role", label: t("users.role") },
]);

// Modal State
const isModalOpen = ref(false);
const editingUser = ref(null);
const form = ref({
  username: "",
  password: "",
  role: "admin", // Default to admin
});

// Delete State
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await adminApi.getUsers();
    users.value = res.data;
  } catch (error) {
    uiStore.showToast(t("common.error"), "error");
  } finally {
    loading.value = false;
  }
};

const openModal = (user = null) => {
  editingUser.value = user;
  if (user) {
    form.value = {
      username: user.username,
      password: "",
      role: user.role,
    };
  } else {
    form.value = {
      username: "",
      password: "",
      role: "admin", // Auto-assign admin
    };
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingUser.value = null;
};

const saveUser = async () => {
  if (!form.value.username) {
    uiStore.showToast(t("common.required"), "error");
    return;
  }
  if (!editingUser.value && !form.value.password) {
    uiStore.showToast(t("common.required"), "error");
    return;
  }
  if (!editingUser.value && form.value.password.length < 6) {
    uiStore.showToast("Password must be at least 6 characters", "error");
    return;
  }

  uiStore.setLoading(true);
  try {
    if (editingUser.value) {
      const updateData = { ...form.value };
      if (!updateData.password) delete updateData.password;
      await adminApi.updateUser(
        editingUser.value._id || editingUser.value.id,
        updateData
      );
      uiStore.showToast(t("users.user_updated"), "success");
    } else {
      // Create new user with auto-admin role
      await adminApi.createUser({
        username: form.value.username,
        password: form.value.password,
        role: "admin",
      });
      uiStore.showToast(t("users.user_created"), "success");
    }
    closeModal();
    fetchUsers();
  } catch (error) {
    uiStore.showToast(
      error.response?.data?.message || t("common.error"),
      "error"
    );
  } finally {
    uiStore.setLoading(false);
  }
};

const confirmDelete = (user) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const handleDelete = async () => {
  if (!userToDelete.value) return;

  uiStore.setLoading(true);
  try {
    await adminApi.deleteUser(userToDelete.value._id || userToDelete.value.id);
    uiStore.showToast(t("users.user_deleted"), "success");
    closeDeleteModal();
    fetchUsers();
  } catch (error) {
    uiStore.showToast(t("common.error"), "error");
  } finally {
    uiStore.setLoading(false);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
