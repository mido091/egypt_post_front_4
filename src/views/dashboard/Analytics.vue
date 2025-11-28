<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAnalyticsStore } from "@/stores/analytics";
import StatCard from "@/components/common/StatCard.vue";
import VisitsChart from "@/components/analytics/VisitsChart.vue";
import DeviceChart from "@/components/analytics/DeviceChart.vue";
import CountryChart from "@/components/analytics/CountryChart.vue";
import {
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
} from "@heroicons/vue/24/outline";

const analyticsStore = useAnalyticsStore();
const refreshInterval = ref(null);

const fetchData = async () => {
  await analyticsStore.fetchAll();
};

onMounted(async () => {
  await fetchData();

  // Auto-refresh every 60 seconds
  refreshInterval.value = setInterval(() => {
    fetchData();
  }, 60000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Monitor your site performance and visitor statistics
        </p>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <span v-if="analyticsStore.lastFetch">
          Last updated:
          {{ new Date(analyticsStore.lastFetch).toLocaleTimeString() }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="analyticsStore.loading && !analyticsStore.lastFetch"
      class="flex justify-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visits"
          :value="analyticsStore.summary.total_visits.toLocaleString()"
          :icon="ChartBarIcon"
          color="primary"
        />

        <StatCard
          title="Unique Visitors"
          :value="analyticsStore.summary.unique_visitors.toLocaleString()"
          :icon="UserGroupIcon"
          color="accent"
        />

        <StatCard
          title="Weekly Change"
          :value="`${
            analyticsStore.summary.weekly_change_percent > 0 ? '+' : ''
          }${analyticsStore.summary.weekly_change_percent}%`"
          :icon="ArrowTrendingUpIcon"
          :color="
            analyticsStore.summary.weekly_change_percent >= 0
              ? 'success'
              : 'danger'
          "
          :trend="
            analyticsStore.summary.weekly_change_percent >= 0 ? 'up' : 'down'
          "
          :trend-value="`${Math.abs(
            analyticsStore.summary.weekly_change_percent
          )}%`"
        />

        <StatCard
          title="Top Page"
          :value="analyticsStore.summary.top_page || 'N/A'"
          :icon="GlobeAltIcon"
          color="warning"
        />
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Visits Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Visits (Last 30 Days)
          </h3>
          <div class="h-80">
            <VisitsChart
              :labels="analyticsStore.monthlyVisits.dates"
              :data="analyticsStore.monthlyVisits.visits"
              label="Daily Visits"
            />
          </div>
        </div>

        <!-- Device Stats Chart -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Device Distribution
          </h3>
          <div class="h-80">
            <DeviceChart :device-stats="analyticsStore.deviceStats" />
          </div>
        </div>
      </div>

      <!-- Weekly Visits & Countries -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Visits -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Visits
          </h3>
          <div class="h-64">
            <VisitsChart
              :labels="analyticsStore.weeklyVisits.days"
              :data="analyticsStore.weeklyVisits.visits"
              label="Visits"
            />
          </div>
        </div>

        <!-- Top Countries -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Countries
          </h3>
          <div class="h-64">
            <CountryChart :countries="analyticsStore.topCountries" />
          </div>
        </div>
      </div>

      <!-- Device Stats Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device Statistics
        </h3>
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Device Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Visits
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mobile
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.deviceStats.mobile.toLocaleString() }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.devicePercentages.mobile }}%
                </td>
              </tr>
              <tr>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  Desktop
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.deviceStats.desktop.toLocaleString() }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.devicePercentages.desktop }}%
                </td>
              </tr>
              <tr>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tablet
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.deviceStats.tablet.toLocaleString() }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ analyticsStore.devicePercentages.tablet }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
