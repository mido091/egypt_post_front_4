<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay - removed backdrop-blur to fix z-index issue -->
        <div
          class="fixed inset-0 bg-gray-900/75 transition-opacity"
          aria-hidden="true"
          @click="close"
        ></div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <!-- Modal panel - proper relative positioning -->
        <div
          :class="[
            'relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-visible shadow-2xl transform transition-all sm:my-8 sm:align-middle border border-gray-100 dark:border-gray-700',
            size === 'large' ? 'sm:max-w-4xl' : 'sm:max-w-lg',
            'sm:w-full',
          ]"
        >
          <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4"
                  id="modal-title"
                >
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <slot></slot>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700"
          >
            <slot name="footer">
              <BaseButton @click="confirm" class="w-full sm:w-auto">
                {{ $t("common.confirm") }}
              </BaseButton>
              <BaseButton
                variant="secondary"
                @click="close"
                class="w-full sm:w-auto mt-3 sm:mt-0"
              >
                {{ $t("common.cancel") }}
              </BaseButton>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import BaseButton from "./BaseButton.vue";

defineProps({
  isOpen: Boolean,
  title: String,
  size: {
    type: String,
    default: "normal",
    validator: (value) => ["normal", "large"].includes(value),
  },
});

const emit = defineEmits(["close", "confirm"]);

const close = () => emit("close");
const confirm = () => emit("confirm");
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
