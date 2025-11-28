<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
  >
    <div
      v-if="$slots.header || title"
      class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50"
    >
      <h3
        v-if="title"
        class="text-lg font-bold text-gray-900 dark:text-white tracking-tight"
      >
        {{ title }}
      </h3>
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
    <div
      v-if="$slots.footer"
      class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>
