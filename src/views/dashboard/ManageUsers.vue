<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t("dashboard.manage_users") }}
      </h1>
      <BaseButton @click="openModal()"> Add User </BaseButton>
    </div>

    <BaseCard>
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th
                class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("auth.name") }}
              </th>
              <th
                class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("auth.email") }}
              </th>
              <th
                class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("dashboard.role") }}
              </th>
              <th
                class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t("dashboard.actions") }}
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr v-for="user in users" :key="user._id || user.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ user.name }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ user.email }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                <span
                  :class="{
                    'px-2 py-1 rounded-full text-xs font-semibold': true,
                    'bg-purple-100 text-purple-800': user.role === 'owner',
                    'bg-blue-100 text-blue-800': user.role === 'admin',
                    'bg-green-100 text-green-800': user.role === 'editor',
                    'bg-gray-100 text-gray-800': user.role === 'viewer',
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse"
              >
                <button
                  @click="openModal(user)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Edit
                </button>
                <button
                  v-if="user.role !== 'owner'"
                  @click="deleteUser(user._id || user.id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Modal using BaseModal component -->
    <BaseModal
      :isOpen="showModal"
      :title="isEditing ? 'Edit User' : 'Add User'"
      @close="closeModal"
      @confirm="saveUser"
    >
      <div class="space-y-4">
        <BaseInput v-model="form.name" :label="$t('auth.name')" />
        <BaseInput
          v-model="form.email"
          :label="$t('auth.email')"
          type="email"
        />

        <div v-if="!isEditing">
          <BaseInput
            v-model="form.password"
            :label="$t('auth.password')"
            type="password"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Role</label
          >
          <select
            v-model="form.role"
            class="w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      <template #footer>
        <BaseButton
          @click="saveUser"
          :loading="saving"
          class="w-full sm:w-auto"
        >
          {{ $t("dashboard.save") }}
        </BaseButton>
        <BaseButton
          @click="closeModal"
          variant="secondary"
          class="w-full sm:w-auto mt-3 sm:mt-0"
        >
          {{ $t("dashboard.cancel") }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import api from "@/api";

const users = ref([]);
const loading = ref(true);
const showModal = ref(false);
const saving = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

const form = ref({
  name: "",
  email: "",
  password: "",
  role: "viewer",
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get("/users");
    users.value = response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
};

const openModal = (user = null) => {
  if (user) {
    isEditing.value = true;
    currentId.value = user._id || user.id;
    form.value = { ...user, password: "" }; // Don't show password
  } else {
    isEditing.value = false;
    currentId.value = null;
    form.value = {
      name: "",
      email: "",
      password: "",
      role: "viewer",
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveUser = async () => {
  try {
    saving.value = true;
    if (isEditing.value) {
      const updateData = { ...form.value };
      if (!updateData.password) delete updateData.password;
      await api.put(`/users/${currentId.value}`, updateData);
    } else {
      await api.post("/users", form.value);
    }
    await fetchUsers();
    closeModal();
  } catch (error) {
    console.error("Failed to save user:", error);
    alert("Failed to save user");
  } finally {
    saving.value = false;
  }
};

const deleteUser = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
