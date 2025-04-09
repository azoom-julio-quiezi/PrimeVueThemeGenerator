<template>
  <nuxt-link 
    class="p-link"
    :to="href"
    :class="[
      {
        'p-disabled': disabled,
        [`p-az-link-${size}`]: size,
        [`p-az-link-${semanticColor}`]: semanticColor,
        [`p-az-link-${variant}`]: variant
      }
    ]"
  >
    {{ label }}
    <slot name="icon">
      <svg v-if="showDefaultIcon" class="p-link-icon" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="az-new-window">
          <path id="Vector" d="M4.9231 17.0834C4.50216 17.0834 4.14585 16.9375 3.85419 16.6459C3.56252 16.3542 3.41669 15.9979 3.41669 15.577V4.42317C3.41669 4.00222 3.56252 3.64591 3.85419 3.35425C4.14585 3.06258 4.50216 2.91675 4.9231 2.91675H8.72115C8.89849 2.91675 9.04699 2.97658 9.16665 3.09625C9.2863 3.2159 9.34613 3.3644 9.34613 3.54175C9.34613 3.7191 9.2863 3.8676 9.16665 3.98725C9.04699 4.1069 8.89849 4.16673 8.72115 4.16673H4.9231C4.85899 4.16673 4.80022 4.19344 4.74679 4.24685C4.69337 4.30028 4.66667 4.35905 4.66667 4.42317V15.577C4.66667 15.6411 4.69337 15.6998 4.74679 15.7533C4.80022 15.8067 4.85899 15.8334 4.9231 15.8334H16.0769C16.141 15.8334 16.1998 15.8067 16.2532 15.7533C16.3066 15.6998 16.3333 15.6411 16.3333 15.577V11.7789C16.3333 11.6016 16.3932 11.4531 16.5128 11.3334C16.6325 11.2138 16.781 11.1539 16.9583 11.1539C17.1357 11.1539 17.2842 11.2138 17.4038 11.3334C17.5235 11.4531 17.5833 11.6016 17.5833 11.7789V15.577C17.5833 15.9979 17.4375 16.3542 17.1458 16.6459C16.8541 16.9375 16.4978 17.0834 16.0769 17.0834H4.9231ZM16.3333 5.04492L9.03846 12.3398C8.92307 12.4552 8.77804 12.5142 8.60338 12.5169C8.42869 12.5195 8.28099 12.4605 8.16027 12.3398C8.03955 12.2191 7.97919 12.0727 7.97919 11.9007C7.97919 11.7287 8.03955 11.5823 8.16027 11.4616L15.4551 4.16673H11.9583C11.781 4.16673 11.6325 4.1069 11.5128 3.98725C11.3932 3.8676 11.3333 3.7191 11.3333 3.54175C11.3333 3.3644 11.3932 3.2159 11.5128 3.09625C11.6325 2.97658 11.781 2.91675 11.9583 2.91675H17.5833V8.54175C17.5833 8.7191 17.5235 8.8676 17.4038 8.98725C17.2842 9.1069 17.1357 9.16673 16.9583 9.16673C16.781 9.16673 16.6325 9.1069 16.5128 8.98725C16.3932 8.8676 16.3333 8.7191 16.3333 8.54175V5.04492Z" fill="currentColor"/> 
        </g>
      </svg>
    </slot>
  </nuxt-link>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: '#'
  },
  semanticColor: {
    type: String,
    default: undefined
  },
  variant: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: undefined
  },
  showDefaultIcon: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
:root {
  --p-az-link-primary-color: var(--p-primary-color);
  --p-az-link-primary-hover-color: var(--p-primary-color);
  --p-az-link-primary-active-color: var(--p-primary-active-color);

  --p-az-link-secondary-color: var(--p-az-secondary-color);
  --p-az-link-secondary-hover-color: var(--p-az-secondary-color);
  --p-az-link-secondary-active-color: var(--p-az-secondary-color);
  
  --p-az-link-text-color: var(--p-text-color);
  --p-az-link-text-hover-color: var(--p-text-color);
  --p-az-link-text-active-color: var(--p-surface-400);

  --p-az-link-white-color: var(--p-primary-contrast-color);
  --p-az-link-white-hover-color: var(--p-primary-contrast-color);
  --p-az-link-white-active-color: var(--p-primary-contrast-color);

  --p-az-link-unvisited-color: var(--p-az-unvisited-600);
  --p-az-link-unvisited-hover-color: var(--p-az-unvisited-600);
  --p-az-link-unvisited-active-color: var(--p-az-unvisited-200);

  --p-az-link-visited-color: var(--p-az-visited-950);
  --p-az-link-visited-hover-color: var(--p-az-visited-950);
  --p-az-link-visited-active-color: var(--p-az-visited-200);

  --p-az-link-disabled-color: var(--p-az-disabled-color);
}

.p-link {
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.p-link:hover {
  text-decoration-thickness: 2px;
}

.p-link:focus-visible {
  outline-offset: 4px;
  border-radius: 4px;
}

.p-az-link-primary {
  color: var(--p-az-link-primary-color);
}
.p-az-link-primary:hover {
  color: var(--p-az-link-primary-hover-color);
}
.p-az-link-primary:active {
  color: var(--p-az-link-primary-active-color);
}
.p-az-link-primary:focus-visible {
  outline: 1px solid var(--p-az-link-primary-color);
}

.p-az-link-secondary {
  color: var(--p-az-link-secondary-color);
}
.p-az-link-secondary:hover {
  color: var(--p-az-link-secondary-hover-color);
}
.p-az-link-secondary:active {
  color: var(--p-az-link-secondary-active-color);
}
.p-az-link-secondary:focus-visible {
  outline: 1px solid var(--p-az-link-secondary-color);
}

.p-az-link-text {
  color: var(--p-az-link-text-color);
}
.p-az-link-text:hover {
  color: var(--p-az-link-text-hover-color);
}
.p-az-link-text:active {
  color: var(--p-az-link-text-active-color);
}
.p-az-link-text:focus-visible {
  color: var(--p-az-link-text-color);
  outline: 1px solid var(--p-az-link-text-color);
}

.p-az-link-white {
  color: var(--p-az-link-white-color);
}
.p-az-link-white:hover {
  color: var(--p-az-link-white-hover-color);
}
.p-az-link-white:active {
  color: var(--p-az-link-white-active-color);
  opacity: 0.5;
}
.p-az-link-white:focus-visible {
  color: var(--p-az-link-white-color);
  outline: 1px solid var(--p-az-link-white-color);
}

.p-az-link-traditional {
  color: var(--p-az-link-unvisited-color);
}
.p-az-link-traditional:hover {
  color: var(--p-az-link-unvisited-hover-color);
}
.p-az-link-traditional:active {
  color: var(--p-az-link-unvisited-active-color);
}
.p-az-link-traditional:focus-visible {
  color: var(--p-az-link-unvisited-color);
  outline: 1px solid var(--p-az-link-unvisited-color);
}

.p-az-link-traditional:visited {
  color: var(--p-az-link-visited-color);
}
.p-az-link-traditional:visited:hover {
  color: var(--p-az-link-visited-hover-color);
}
.p-az-link-traditional:visited:active {
  color: var(--p-az-link-visited-active-color);
}
.p-az-link-traditional:visited:focus-visible {
  color: var(--p-az-link-visited-color);
  outline: 1px solid var(--p-az-link-visited-color);
}

.p-az-link-traditional:visited .p-link-icon {
  color: var(--p-az-link-visited-color);
}
.p-az-link-traditional:visited:hover .p-link-icon {
  color: var(--p-az-link-visited-hover-color);
}
.p-az-link-traditional:visited:active .p-link-icon {
  color: var(--p-az-link-visited-active-color);
}
.p-az-link-traditional:visited:focus-visible .p-link-icon {
  color: var(--p-az-link-visited-color);
  outline: 1px solid var(--p-az-link-visited-color);
}

.p-link.p-disabled, .p-link.p-disabled .p-link-icon {
  color: var(--p-az-link-disabled-color);
  opacity: 1;
}

.p-link-icon {
  width: 1em;
  height: 1em;
  color: currentColor;
}

.p-az-link-size-xsm {
  font-size: 0.75rem;
}

.p-az-link-size-sm {
  font-size: 0.875rem;
}

.p-az-link-size-lg {
  font-size: 1.125rem;
}

.p-az-link-size-xlg {
  font-size: 1.25rem;
}
</style>