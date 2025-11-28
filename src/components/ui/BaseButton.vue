<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      {
        'w-full': block,
        'shadow-md hover:shadow-lg': !disabled && variant !== 'ghost',
      },
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "success", "ghost"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  disabled: Boolean,
  loading: Boolean,
  block: Boolean,
});

defineEmits(["click"]);

const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent",
  success:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3.5 text-lg",
};
</script>
