<template>
  <v-breadcrumb class="breadcrumb"
    :home="home"
    :model="model">
    <template #item="{ item }">
      <!-- For home item, show only icon -->
      <template v-if="isHomeItem(item)">
        <a class="home"
          :href="item.url"
          :target="item.target || undefined">
          <home-icon />
        </a>
      </template>
      <!-- For other items, show text -->
      <template v-else>
        <slot :item="item">
          <a class="item"
            :href="item.url"
            :target="item.target || undefined"
            v-if="item.url">
            {{ item.label }}
          </a>
          <span class="item -text"
            v-else>{{ item.label }}</span>
        </slot>
      </template>
    </template>
    <template #separator>
      <slot name="separator" />
    </template>
  </v-breadcrumb>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem, BreadcrumbProps } from '../types'
import HomeIcon from './v-home-icon.vue'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  home: () => ({
    label: 'Home',
    url: '/',
  }),
  model: () => [],
})

// Check if item is the home item
const isHomeItem = (item: BreadcrumbItem) => {
  return item.url === props.home?.url && item.label === props.home?.label
}
</script>

<style lang="scss" scoped>
.breadcrumb > .p-breadcrumb-list > .p-breadcrumb-item {
  > .home {
    color: var(--p-navigation-item-icon-color);
    transition: color 0.2s;
    text-decoration: none;

    &:hover {
      color: var(--p-navigation-item-hover-color);
    }
  }

  > .item {
    color: var(--p-breadcrumb-item-color);
    transition: color 0.2s;
    text-decoration: none;

    &:hover {
      color: var(--p-breadcrumb-item-hover-color);
    }
  }

  > .item.-text {
    &:hover {
      color: var(--p-breadcrumb-item-color);
    }
  }
}
</style>
