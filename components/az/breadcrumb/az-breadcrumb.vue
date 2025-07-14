<template>
  <Breadcrumb 
    :home="homeWithAzIcon" 
    :model="model"
    :pt="{
      item: {
        class: 'item'
      }
    }">
    <template #item="{ item }">
              <!-- For home item, show only AzIcon -->
        <template v-if="isHomeItem(item)">
          <a
            class="home"
            :href="item.url"
            :target="item.target || undefined">
            <AzIcon
              name="home"
              type="outline"
              size="14"
              bounded="tight" />
          </a>
        </template>
        <!-- For other items, show text -->
        <template v-else>
          <slot :item="item">
            <a 
              class="breadcrumb"
              v-if="item.url"
              :href="item.url"
              :target="item.target || undefined">
              {{ item.label }}
            </a>
            <span v-else class="breadcrumb -text">{{ item.label }}</span>
          </slot>
        </template>
    </template>
    <template #separator>
      <slot name="separator" />
    </template>
  </Breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Breadcrumb from 'primevue/breadcrumb'

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

// Transform home to use AzIcon
const homeWithAzIcon = computed(() => ({
  ...props.home,
  icon: 'home' // AzIcon name
}))

// Check if item is the home item
const isHomeItem = (item: any) => {
  return item.url === props.home.url && item.label === props.home.label
}
</script>

<style lang="scss" scoped>
.home {
  color: var(--p-navigation-item-icon-color);
  transition: color 0.2s;
  text-decoration: none;

  &:hover {
    color: var(--p-navigation-item-hover-color);
  }
}

.breadcrumb {
  color: var(--p-breadcrumb-item-color);
  transition: color 0.2s;
  text-decoration: none;

  &:hover {
    color: var(--p-breadcrumb-item-hover-color);
  }
}

.breadcrumb.-text {
  color: var(--p-breadcrumb-item-color);
}
</style>
