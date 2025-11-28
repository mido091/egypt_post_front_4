<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h3>
      </slot>
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>
