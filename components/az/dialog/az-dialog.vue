<template>
  <v-dialog v-bind="$attrs"
    :visible="visible"
    :pt="{
      headerActions: {
        style: {
          gap: '0',
        }
      },
      pcCloseButton: {
        root: {
          style: {
            display: 'contents'
          }
        },
      }
    }"
    class="dialog"
    @update:visible="$emit('update:visible', $event)"
    @hide="$emit('hide', $event)">
    <!-- Custom close button slot -->
    <template #closeicon>
      <div class="block"
        @click="$emit('update:visible', false)">
        <AzIcon
          class="icon"
          name="close"
          type="outline"
          size="14"
          bounded="tight" />
        <span class="text">閉じる</span>
      </div>
    </template>

    <!-- Pass through all other slots -->
    <template v-for="(_, name) in $slots"
      #[name]="slotData">
      <slot :name="name"
        v-bind="slotData" />
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
interface Props {
  visible?: boolean
}

interface Emits {
  'update:visible': [value: boolean]
  'hide': [event: any]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss" scoped>
.dialog .block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--p-surface-100);
  }

  > .icon {
    padding-top: 1px;
  }

  > .text {
    font-size: 1rem;
    font-weight: 500;
  }
}

/* Dark mode support */
:root[class='p-dark'] .custom-close-button:hover {
  background-color: var(--p-surface-700);
}
</style>
