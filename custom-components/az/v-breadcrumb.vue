<template>
  <Breadcrumb
    class="breadcrumb"
    :home="home" 
    :model="model">
    <template #item="{ item }">
        <!-- For home item, show only icon -->
        <template v-if="isHomeItem(item)">
          <a
            class="home"
            :href="item.url"
            :target="item.target || undefined">
            <AzHomeIcon />
          </a>
        </template>
        <!-- For other items, show text -->
        <template v-else>
          <slot :item="item">
            <a 
              class="item"
              v-if="item.url"
              :href="item.url"
              :target="item.target || undefined">
              {{ item.label }}
            </a>
            <span v-else class="item -text">{{ item.label }}</span>
          </slot>
        </template>
    </template>
    <template #separator>
      <slot name="separator" />
    </template>
  </Breadcrumb>
</template>

<script lang="ts" setup>
import Breadcrumb from 'primevue/breadcrumb'
import AzHomeIcon from '../home-icon/az-home-icon.vue'

interface BreadcrumbItem {
  label: string
  url?: string
  route?: any
  target?: string
  icon?: string
  [key: string]: any
}

interface Props {
  home?: BreadcrumbItem
  model?: BreadcrumbItem[]
}

const props = withDefaults(defineProps<Props>(), {
  home: () => ({
    label: 'Home',
    url: '/'
  }),
  model: () => []
})

// Check if item is the home item
const isHomeItem = (item: any) => {
  return item.url === props.home.url && item.label === props.home.label
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
