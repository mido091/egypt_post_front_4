<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-900/50">
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
          <th
            v-if="$slots.actions"
            class="px-6 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr v-if="loading">
          <td
            :colspan="headers.length + ($slots.actions ? 1 : 0)"
            class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            Loading...
          </td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td
            :colspan="headers.length + ($slots.actions ? 1 : 0)"
            class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            No data available
          </td>
        </tr>
        <tr
          v-else
          v-for="(item, index) in items"
          :key="item.id || index"
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <td
            v-for="header in headers"
            :key="header.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            <slot
              :name="`cell-${header.key}`"
              :item="item"
              :value="item[header.key]"
            >
              {{ item[header.key] }}
            </slot>
          </td>
          <td
            v-if="$slots.actions"
            class="px-6 py-4 whitespace-nowrap text-right rtl:text-left text-sm font-medium"
          >
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true,
    // [{ key: 'name', label: 'Name' }]
  },
  items: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
});
</script>
