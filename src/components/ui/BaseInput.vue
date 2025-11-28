<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="block w-full h-12 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/50 transition-all duration-200 ease-in-out text-base disabled:opacity-60 disabled:cursor-not-allowed"
        :class="{
          'border-red-500 focus:border-red-500 focus:ring-red-500/50': error,
        }"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600 dark:text-red-400 font-medium"
    >
      {{ error }}
    </p>
    <p
      v-if="helpText && !error"
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helpText }}
    </p>
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
    default: "text",
  },
  placeholder: String,
  error: String,
  helpText: String,
  disabled: Boolean,
  required: Boolean,
});

defineEmits(["update:modelValue", "blur"]);
</script>
