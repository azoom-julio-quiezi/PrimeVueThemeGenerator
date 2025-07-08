<template>
  <nuxt-link :to="href"
    :replace="replace"
    :active-class="activeClass"
    :exact-active-class="exactActiveClass"
    :aria-current="ariaCurrent"
    :prefetch="prefetch"
    :no-prefetch="noPrefetch"
    :prefetch-on-hover="prefetchOnHover"
    :id="id"
    :title="title"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    class="p-link"
    :class="[
      {
        'p-disabled': disabled,
        [`p-az-link-${size}`]: size,
        [`p-az-link-${semanticColor}`]: semanticColor,
        [`p-az-link-${variant}`]: variant,
      },
    ]"
    v-if="!useHtmlAnchor">
    {{ label }}
    <slot name="icon">
      <svg class="p-link-icon"
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-if="showDefaultIcon">
        <g id="az-new-window">
          <path d="M4.9231 17.0834C4.50216 17.0834 4.14585 16.9375 3.85419 16.6459C3.56252 16.3542 3.41669 15.9979 3.41669 15.577V4.42317C3.41669 4.00222 3.56252 3.64591 3.85419 3.35425C4.14585 3.06258 4.50216 2.91675 4.9231 2.91675H8.72115C8.89849 2.91675 9.04699 2.97658 9.16665 3.09625C9.2863 3.2159 9.34613 3.3644 9.34613 3.54175C9.34613 3.7191 9.2863 3.8676 9.16665 3.98725C9.04699 4.1069 8.89849 4.16673 8.72115 4.16673H4.9231C4.85899 4.16673 4.80022 4.19344 4.74679 4.24685C4.69337 4.30028 4.66667 4.35905 4.66667 4.42317V15.577C4.66667 15.6411 4.69337 15.6998 4.74679 15.7533C4.80022 15.8067 4.85899 15.8334 4.9231 15.8334H16.0769C16.141 15.8334 16.1998 15.8067 16.2532 15.7533C16.3066 15.6998 16.3333 15.6411 16.3333 15.577V11.7789C16.3333 11.6016 16.3932 11.4531 16.5128 11.3334C16.6325 11.2138 16.781 11.1539 16.9583 11.1539C17.1357 11.1539 17.2842 11.2138 17.4038 11.3334C17.5235 11.4531 17.5833 11.6016 17.5833 11.7789V15.577C17.5833 15.9979 17.4375 16.3542 17.1458 16.6459C16.8541 16.9375 16.4978 17.0834 16.0769 17.0834H4.9231ZM16.3333 5.04492L9.03846 12.3398C8.92307 12.4552 8.77804 12.5142 8.60338 12.5169C8.42869 12.5195 8.28099 12.4605 8.16027 12.3398C8.03955 12.2191 7.97919 12.0727 7.97919 11.9007C7.97919 11.7287 8.03955 11.5823 8.16027 11.4616L15.4551 4.16673H11.9583C11.781 4.16673 11.6325 4.1069 11.5128 3.98725C11.3932 3.8676 11.3333 3.7191 11.3333 3.54175C11.3333 3.3644 11.3932 3.2159 11.5128 3.09625C11.6325 2.97658 11.781 2.91675 11.9583 2.91675H17.5833V8.54175C17.5833 8.7191 17.5235 8.8676 17.4038 8.98725C17.2842 9.1069 17.1357 9.16673 16.9583 9.16673C16.781 9.16673 16.6325 9.1069 16.5128 8.98725C16.3932 8.8676 16.3333 8.7191 16.3333 8.54175V5.04492Z"
            fill="currentColor"
            id="Vector" />
        </g>
      </svg>
    </slot>
  </nuxt-link>

  <a class="p-link"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :download="download"
    :hreflang="hreflang"
    :ping="ping"
    :referrerpolicy="referrerpolicy"
    :type="type"
    :id="id"
    :title="title"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :class="[
      {
        'p-disabled': disabled,
        [`p-az-link-${size}`]: size,
        [`p-az-link-${semanticColor}`]: semanticColor,
        [`p-az-link-${variant}`]: variant,
      },
    ]"
    v-else>
    {{ label }}
    <slot name="icon">
      <svg class="p-link-icon"
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-if="showDefaultIcon">
        <g id="az-new-window">
          <path d="M4.9231 17.0834C4.50216 17.0834 4.14585 16.9375 3.85419 16.6459C3.56252 16.3542 3.41669 15.9979 3.41669 15.577V4.42317C3.41669 4.00222 3.56252 3.64591 3.85419 3.35425C4.14585 3.06258 4.50216 2.91675 4.9231 2.91675H8.72115C8.89849 2.91675 9.04699 2.97658 9.16665 3.09625C9.2863 3.2159 9.34613 3.3644 9.34613 3.54175C9.34613 3.7191 9.2863 3.8676 9.16665 3.98725C9.04699 4.1069 8.89849 4.16673 8.72115 4.16673H4.9231C4.85899 4.16673 4.80022 4.19344 4.74679 4.24685C4.69337 4.30028 4.66667 4.35905 4.66667 4.42317V15.577C4.66667 15.6411 4.69337 15.6998 4.74679 15.7533C4.80022 15.8067 4.85899 15.8334 4.9231 15.8334H16.0769C16.141 15.8334 16.1998 15.8067 16.2532 15.7533C16.3066 15.6998 16.3333 15.6411 16.3333 15.577V11.7789C16.3333 11.6016 16.3932 11.4531 16.5128 11.3334C16.6325 11.2138 16.781 11.1539 16.9583 11.1539C17.1357 11.1539 17.2842 11.2138 17.4038 11.3334C17.5235 11.4531 17.5833 11.6016 17.5833 11.7789V15.577C17.5833 15.9979 17.4375 16.3542 17.1458 16.6459C16.8541 16.9375 16.4978 17.0834 16.0769 17.0834H4.9231ZM16.3333 5.04492L9.03846 12.3398C8.92307 12.4552 8.77804 12.5142 8.60338 12.5169C8.42869 12.5195 8.28099 12.4605 8.16027 12.3398C8.03955 12.2191 7.97919 12.0727 7.97919 11.9007C7.97919 11.7287 8.03955 11.5823 8.16027 11.4616L15.4551 4.16673H11.9583C11.781 4.16673 11.6325 4.1069 11.5128 3.98725C11.3932 3.8676 11.3333 3.7191 11.3333 3.54175C11.3333 3.3644 11.3932 3.2159 11.5128 3.09625C11.6325 2.97658 11.781 2.91675 11.9583 2.91675H17.5833V8.54175C17.5833 8.7191 17.5235 8.8676 17.4038 8.98725C17.2842 9.1069 17.1357 9.16673 16.9583 9.16673C16.781 9.16673 16.6325 9.1069 16.5128 8.98725C16.3932 8.8676 16.3333 8.7191 16.3333 8.54175V5.04492Z"
            fill="currentColor"
            id="Vector" />
        </g>
      </svg>
    </slot>
  </a>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  href: {
    type: String,
    default: '#',
  },
  external: {
    type: Boolean,
    default: false,
  },
  replace: {
    type: Boolean,
    default: false,
  },
  activeClass: {
    type: String,
    default: undefined,
  },
  exactActiveClass: {
    type: String,
    default: undefined,
  },
  ariaCurrent: {
    type: String,
    default: undefined,
  },
  prefetch: {
    type: Boolean,
    default: undefined,
  },
  noPrefetch: {
    type: Boolean,
    default: false,
  },
  prefetchOnHover: {
    type: Boolean,
    default: undefined,
  },
  download: {
    type: [String, Boolean],
    default: false,
  },
  hreflang: {
    type: String,
    default: undefined,
  },
  ping: {
    type: String,
    default: undefined,
  },
  referrerpolicy: {
    type: String,
    default: undefined,
  },
  type: {
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
  semanticColor: {
    type: String,
    default: undefined,
  },
  variant: {
    type: String,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: undefined,
  },
  showDefaultIcon: {
    type: Boolean,
    default: true,
  },
})

// Computed property to determine if we should use HTML anchor instead of nuxt-link
const useHtmlAnchor = computed(() => {
  // Check if any HTML-specific properties have been explicitly provided
  return props.external
    || props.download
    || props.hreflang
    || props.ping
    || props.referrerpolicy
    || props.type
})
</script>

<style>
.p-link {
  font-size: 1rem;
  font-weight: 400;
  display: inline-flex;
  align-items: center;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.p-link:hover {
  text-decoration-thickness: 2px;
}

.p-link:focus-visible {
  outline-offset: 4px;
  border-radius: 4px;
  outline: 1px solid var(--p-primary-color);
}

.p-az-link-primary {
  color: var(--p-primary-color);
}

.p-az-link-text {
  color: var(--p-text-color);
}
.p-az-link-text:focus-visible {
  outline: 1px solid var(--p-text-color);
}

.p-az-link-traditional {
  color: var(--p-blue-600);
}
.p-az-link-traditional:focus-visible {
  outline: 1px solid var(--p-blue-600);
}

.p-az-link-traditional:visited {
  color: var(--p-fuchsia-950);
}
.p-az-link-traditional:visited:focus-visible {
  outline: 1px solid var(--p-fuchsia-950);
}

.p-az-link-traditional:visited .p-link-icon {
  color: var(--p-fuchsia-950);
}

.p-az-link-white {
  color: #ffffff;
}
.p-az-link-white:focus-visible {
  outline: 1px solid #ffffff;
}

.p-link.p-disabled {
  opacity: var(--p-disabled-opacity);
}

.p-link-icon {
  width: 1rem;
  height: 1rem;
  color: currentColor;
  margin-left: 0.2rem;
}

.p-az-link-sm {
  font-size: 0.875rem;
}

.p-az-link-lg {
  font-size: 1.125rem;
}
</style>
