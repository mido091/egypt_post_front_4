<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Egypt_Post_logo.svg"
          :alt="settingsStore.siteName"
        />
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          {{ $t("auth.register_title") }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <BaseInput
            v-model="form.name"
            :label="$t('auth.full_name')"
            type="text"
            required
          />
          <BaseInput
            v-model="form.username"
            :label="$t('auth.username')"
            type="text"
            required
          />
          <BaseInput
            v-model="form.email"
            :label="$t('auth.email')"
            type="email"
            required
          />
          <BaseInput
            v-model="form.password"
            :label="$t('auth.password')"
            type="password"
            required
          />
          <BaseInput
            v-model="form.confirmPassword"
            :label="$t('auth.confirm_password')"
            type="password"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <BaseButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
          >
            {{ $t("auth.register_button") }}
          </BaseButton>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            {{ $t("auth.already_have_account") }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useSettingsStore } from "@/stores/settings";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const form = ref({
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    await authStore.register({
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    });
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>
