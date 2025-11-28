<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1
          class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {{ $t("dashboard.overview") }}
        </h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          {{ $t("dashboard.welcome", { name: authStore.user?.username }) }}
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Users Count -->
      <BaseCard
        class="border-l-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("dashboard.total_users") }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.users }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <UsersIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </BaseCard>

      <!-- Posts Count -->
      <BaseCard
        class="border-l-4 border-green-500 transform hover:-translate-y-1 transition-transform duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("dashboard.total_posts") }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.posts }}
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <DocumentTextIcon
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </BaseCard>

      <!-- Governorates Count -->
      <BaseCard
        class="border-l-4 border-orange-500 transform hover:-translate-y-1 transition-transform duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
            >
              {{ $t("dashboard.total_govs") }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.govs }}
            </p>
          </div>
          <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <MapIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseCard :title="$t('dashboard.quick_actions')">
        <div class="grid grid-cols-2 gap-4">
          <BaseButton
            variant="primary"
            @click="$router.push('/dashboard/posts')"
          >
            {{ $t("posts.title") }}
          </BaseButton>
          <BaseButton
            v-if="authStore.isOwner"
            variant="secondary"
            @click="$router.push('/dashboard/users')"
          >
            {{ $t("users.title") }}
          </BaseButton>
          <BaseButton
            v-if="authStore.isOwner"
            variant="ghost"
            @click="$router.push('/dashboard/settings')"
          >
            {{ $t("settings.title") }}
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import {
  UsersIcon,
  DocumentTextIcon,
  MapIcon,
} from "@heroicons/vue/24/outline";
import adminApi from "@/api/admin";

const authStore = useAuthStore();

const stats = ref({
  users: "...",
  posts: "...",
  govs: "...",
});

onMounted(async () => {
  try {
    // FIX #2: Removed analytics/visitor counter API call

    // Fetch Counts
    const postsRes = await adminApi.getPosts();
    let allPosts = [];
    if (Array.isArray(postsRes.data)) {
      allPosts = postsRes.data;
    } else {
      allPosts = Object.values(postsRes.data).flat();
    }

    stats.value.posts = allPosts.length;

    // Compute unique governorates
    const uniqueGovs = new Set(allPosts.map((p) => p.gov_code).filter(Boolean));
    stats.value.govs = uniqueGovs.size;

    if (authStore.isOwner) {
      const usersRes = await adminApi.getUsers();
      stats.value.users = usersRes.data.length;
    } else {
      stats.value.users = "N/A";
    }
  } catch (e) {
    console.error("Failed to load stats", e);
  }
});
</script>
