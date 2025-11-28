<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 z-0 opacity-10 dark:opacity-5">
      <svg
        class="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 100 C 20 0 50 0 100 100 Z"
          fill="currentColor"
          class="text-blue-600"
        />
      </svg>
    </div>

    <div
      class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl relative z-10 border border-gray-100 dark:border-gray-700"
    >
      <div class="text-center">
        <div
          class="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-6"
        >
          <svg
            class="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2
          class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
        >
          {{ $t("auth.login_title") }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t("auth.login_subtitle") }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <BaseInput
            v-model="form.username"
            :label="$t('auth.username')"
            id="username"
            required
            class="transition-all duration-200"
          />
          <BaseInput
            v-model="form.password"
            :label="$t('auth.password')"
            type="password"
            id="password"
            required
            class="transition-all duration-200"
          />
        </div>

        <div
          v-if="error"
          class="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30"
        >
          {{ error }}
        </div>

        <div>
          <BaseButton
            type="submit"
            :loading="loading"
            block
            size="lg"
            class="w-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {{ $t("auth.login_button") }}
          </BaseButton>
        </div>
      </form>
    </div>

    <LoadingSpinner />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const form = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    await authStore.login(form.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = t("auth.login_failed");
  } finally {
    loading.value = false;
  }
};
</script>
