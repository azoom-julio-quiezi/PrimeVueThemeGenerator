<template>
  <label :for="htmlFor"
    :title="title"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :aria-required="ariaRequired"
    class="p-az-label"
    :class="[
      {
        [`p-az-label-${size}`]: size,
        [`p-az-label-${variant}`]: variant,
        'p-az-label-required': required,
      },
    ]"
    :style="{ color }"
    :id="id">
    {{ label }}
    <!-- Required indicator variants -->
    <span class="p-az-label-required-text"
      v-if="required && variant === 'text'">必須</span>
    <span class="p-az-label-required-star"
      v-if="required && (variant === 'star' || !variant)">*</span>
  </label>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  htmlFor: {
    type: String,
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
  ariaDescribedby: {
    type: String,
    default: undefined,
  },
  ariaRequired: {
    type: Boolean,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: 'md',
  },
})
</script>

<style scoped>
.p-az-label {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  color: var(--p-text-color);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  cursor: pointer;
  gap: 0.25rem;
}

.p-az-label-required-text,
.p-az-label-required-star {
  color: var(--p-red-700);
  font-weight: 600;
  align-self: center;
}

.p-az-label-required-text {
  font-size: 0.75rem;
}

.p-az-label-required-star {
  font-size: 0.875rem;
}

/* Size variants */
.p-az-label-sm {
  font-size: 0.875rem;
}

.p-az-label-md {
  font-size: 1rem;
}

.p-az-label-lg {
  font-size: 1.125rem;
}

/* Focus styles for accessibility */
.p-az-label:focus-within {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Disabled state */
.p-az-label:has(+ input:disabled),
.p-az-label:has(+ select:disabled),
.p-az-label:has(+ textarea:disabled) {
  opacity: var(--p-disabled-opacity);
  cursor: not-allowed;
}
</style>
