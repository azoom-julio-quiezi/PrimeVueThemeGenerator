<template>
  <ClientOnly>
    <ConfirmDialog :group="group" class="az-confirm-dialog">
      <template #container="{ message, acceptCallback, rejectCallback, closeCallback }">
        <div class="confirm-dialog-container">
          <!-- Title (top left) -->
          <h2 class="dialog-title">{{ message.header }}</h2>

          <!-- Custom close button (top right) -->
          <button 
            class="close-button"
            @click="rejectCallback"
            type="button">
            <AzIcon
              class="icon"
              name="close"
              type="outline"
              size="14"
              bounded="tight" />
            <span class="text">閉じる</span>
          </button>

          <!-- Message content -->
          <div class="dialog-content">
            <p class="dialog-message">
              <AzIcon
                v-if="message.icon"
                :name="message.icon"
                v-bind="{
                  type: message.iconProps?.type ?? 'outline',
                  size: message.iconProps?.size ?? 16,
                  bounded: message.iconProps?.bounded ?? 'tight',
                  ...(message.iconProps || {})
                }"
                class="message-icon" />
              {{ message.message }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons">
            <v-button 
              :label="message.acceptLabel || 'Yes'"
              :severity="message.acceptProps?.severity"
              :outlined="message.acceptProps?.outlined"
              @click="acceptCallback" />
            <v-button 
              :label="message.rejectLabel || 'No'"
              :severity="message.rejectProps?.severity || 'secondary'"
              :outlined="message.rejectProps?.outlined"
              @click="rejectCallback" />
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import ConfirmDialog from 'primevue/confirmdialog'

interface Props {
  group?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.confirm-dialog-container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--p-surface-0);
  border-radius: 0.5rem;
  min-width: 400px;
}

.dialog-title {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--p-surface-900);
  margin: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  height: 2.5rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  border: none;
  background: none;
  color: inherit;
  height: 2.5rem;
  padding: 0 0.5rem;

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

.dialog-content {
  margin: 3rem 0 1.5rem 0;
}

.dialog-message {
  color: var(--p-surface-700);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;

  .message-icon {
    font-size: 1.25rem;
    color: var(--p-primary-500);
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Dark mode support */
:root[class='p-dark'] .dialog-title {
  color: var(--p-surface-0);
}

:root[class='p-dark'] .close-button:hover {
  background-color: var(--p-surface-700);
}

:root[class='p-dark'] .confirm-dialog-container {
  background: var(--p-surface-900);
}

:root[class='p-dark'] .dialog-message {
  color: var(--p-surface-300);
}
</style> 