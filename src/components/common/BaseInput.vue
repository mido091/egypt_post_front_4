<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600',
          { 'opacity-50 cursor-not-allowed': disabled }
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  },
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  error: String,
  disabled: Boolean,
});

defineEmits(['update:modelValue', 'blur']);
</script>
