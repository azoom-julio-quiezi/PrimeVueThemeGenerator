<template>
  <label :for="htmlFor"
    :id="id"
    :title="title"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :aria-required="ariaRequired"
    class="p-az-label"
    :class="[
      {
        [`p-az-label-${size}`]: size,
        [`p-az-label-${variant}`]: variant,
      },
    ]"
    :style="{ color }">
    {{ label }}
    <span class="p-az-label-required-text"
      v-if="variant === 'text'">必須</span>
    <span class="p-az-label-required-star"
      v-if="variant === 'star'">*</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  htmlFor?: string
  id?: string
  title?: string
  ariaLabel?: string
  ariaDescribedby?: string
  ariaRequired?: boolean
  variant?: 'text' | 'star'
  color?: string
  size?: 'sm' | 'lg'
}

withDefaults(defineProps<Props>(), {
  label: '',
  htmlFor: undefined,
  id: undefined,
  title: undefined,
  ariaLabel: undefined,
  ariaDescribedby: undefined,
  ariaRequired: undefined,
  variant: undefined,
  color: undefined,
  size: undefined,
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
}

.p-az-label-required-text,
.p-az-label-required-star {
  color: var(--p-red-700);
  font-weight: 600;
  margin-left: 0.45rem;
}

.p-az-label-required-text {
  font-size: 0.75rem;
  align-self: center;
}

.p-az-label-required-star {
  font-size: 0.75rem;
  align-self: flex-start;
}

.p-az-label-sm {
  font-size: 0.875rem;
}

.p-az-label-lg {
  font-size: 1.125rem;
}
</style>
