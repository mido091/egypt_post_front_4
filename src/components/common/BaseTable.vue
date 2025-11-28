<template>
  <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
          <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ $t('common.actions') || 'Actions' }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(item, index) in data" :key="item.id || index" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
          >
            <slot :name="col.key" :item="item" :value="item[col.key]">
              {{ item[col.key] }}
            </slot>
          </td>
          <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p>{{ emptyText || 'No data available' }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    // { key: 'name', label: 'Name' }
  },
  data: {
    type: Array,
    default: () => [],
  },
  actions: {
    type: Boolean,
    default: false,
  },
  emptyText: String,
});
</script>
