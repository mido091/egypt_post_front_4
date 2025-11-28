<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
  >
    <div class="flex flex-col items-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
        Loading...
      </p>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const uiStore = useUiStore();
const { isLoading } = storeToRefs(uiStore);
</script>
