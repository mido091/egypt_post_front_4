<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseCard from "@/components/common/BaseCard.vue";
import api from "@/api";

const authStore = useAuthStore();
const loading = ref(false);
const success = ref(false);
const error = ref("");

const form = ref({
  username: authStore.user?.username || "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const updateProfile = async () => {
  if (!form.value.currentPassword) {
    error.value = "Current password is required";
    return;
  }

  if (
    form.value.newPassword &&
    form.value.newPassword !== form.value.confirmPassword
  ) {
    error.value = "New passwords do not match";
    return;
  }

  if (form.value.newPassword && form.value.newPassword.length < 6) {
    error.value = "New password must be at least 6 characters";
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    success.value = false;

    const updateData = {
      username: form.value.username,
      currentPassword: form.value.currentPassword,
    };

    if (form.value.newPassword) {
      updateData.newPassword = form.value.newPassword;
    }

    await api.put(`/users/${authStore.user.id}`, updateData);

    // Update local user data
    authStore.user.username = form.value.username;
    localStorage.setItem("user", JSON.stringify(authStore.user));

    success.value = true;

    // Clear password fields
    form.value.currentPassword = "";
    form.value.newPassword = "";
    form.value.confirmPassword = "";

    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      My Profile
    </h1>

    <BaseCard>
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Username -->
        <BaseInput
          v-model="form.username"
          label="Username"
          type="text"
          required
          placeholder="Enter your username"
        />

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Change Password
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Leave password fields empty if you don't want to change your
            password.
          </p>

          <!-- Current Password -->
          <div class="mb-4">
            <BaseInput
              v-model="form.currentPassword"
              label="Current Password"
              type="password"
              required
              placeholder="Enter your current password"
            />
          </div>

          <!-- New Password -->
          <div class="mb-4">
            <BaseInput
              v-model="form.newPassword"
              label="New Password (optional)"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <!-- Confirm Password -->
          <div v-if="form.newPassword">
            <BaseInput
              v-model="form.confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <!-- Success Message -->
        <div
          v-if="success"
          class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <p class="text-green-800 dark:text-green-200 text-sm">
            ✓ Profile updated successfully!
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <p class="text-red-800 dark:text-red-200 text-sm">
            {{ error }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <BaseButton type="submit" variant="primary" :loading="loading">
            Update Profile
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
