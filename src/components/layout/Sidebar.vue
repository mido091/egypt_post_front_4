<template>
  <aside
    class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen hidden md:block"
  >
    <div class="p-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white">
        {{ $t("dashboard.title") }}
      </h2>
    </div>
    <nav class="space-y-1 px-3">
      <!-- Dashboard Home (Everyone) -->
      <router-link
        to="/dashboard"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'dashboard-home'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <HomeIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        {{ $t("dashboard.title") }}
      </router-link>

      <!-- Manage Offices (Owner + Admin) -->
      <router-link
        v-if="authStore.isAdmin"
        to="/dashboard/posts"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'posts'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <BuildingOfficeIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        {{ $t("dashboard.manage_offices") }}
      </router-link>

      <!-- Manage Users (Owner Only) -->
      <router-link
        v-if="authStore.isOwner"
        to="/dashboard/users"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'users'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <UsersIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        {{ $t("dashboard.manage_users") }}
      </router-link>

      <!-- Settings (Owner Only) -->
      <router-link
        v-if="authStore.isOwner"
        to="/dashboard/settings"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'settings'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <Cog6ToothIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        {{ $t("dashboard.settings") }}
      </router-link>

      <!-- Analytics (Owner Only) -->
      <router-link
        v-if="authStore.isOwner"
        to="/dashboard/analytics"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'analytics'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <ChartBarIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        Analytics
      </router-link>

      <!-- My Profile (Owner Only) -->
      <router-link
        v-if="authStore.isOwner"
        to="/dashboard/profile"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors"
        :class="[
          $route.name === 'owner-profile'
            ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
        ]"
      >
        <UserCircleIcon class="mr-3 h-5 w-5 flex-shrink-0" />
        My Profile
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
</script>
