<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: Object,
    default: null,
  },
  trend: {
    type: String,
    default: null, // 'up' or 'down'
  },
  trendValue: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "accent", "success", "warning", "danger"].includes(value),
  },
});

const colorClasses = {
  primary:
    "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400",
  accent:
    "bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400",
  success:
    "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  warning:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  danger: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {{ title }}
        </p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>
        <div v-if="trend && trendValue" class="mt-2 flex items-center text-sm">
          <span
            :class="trend === 'up' ? 'text-green-600' : 'text-red-600'"
            class="flex items-center font-medium"
          >
            <svg
              v-if="trend === 'up'"
              class="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            {{ trendValue }}
          </span>
          <span class="text-gray-500 dark:text-gray-400 ml-2"
            >vs last week</span
          >
        </div>
      </div>
      <div v-if="icon" :class="colorClasses[color]" class="p-3 rounded-xl">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>
