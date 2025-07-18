<template>
  <ClientOnly>
    <confirm-dialog class="confirm-dialog"
      :group="group">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="container">
          <!-- Title (top left) -->
          <h2 class="title">{{ message.header }}</h2>

          <!-- Custom close button (top right) -->
          <button class="button -close"
            type="button"
            @click="rejectCallback">
            <az-icon class="icon"
              name="close"
              type="outline"
              size="14"
              bounded="tight"
              color="var(--p-button-text-secondary-color)" />
            <span class="text">閉じる</span>
          </button>

          <!-- Message content -->
          <div class="content">
            <p class="message">
              <az-icon class="icon"
                :name="message.icon"
                v-bind="{
                  type: message.iconProps?.type ?? 'fill',
                  size: message.iconProps?.size ?? 16,
                  bounded: message.iconProps?.bounded ?? 'spacious',
                  color: message.iconProps?.color ?? 'var(--p-dialog-color)',
                  ...(message.iconProps || {}),
                }"
                v-if="message.icon" />
              {{ message.message }}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="area -actions">
            <v-button :label="message.acceptLabel || 'Yes'"
              :severity="message.acceptProps?.severity"
              :outlined="message.acceptProps?.outlined"
              @click="acceptCallback" />
            <v-button :label="message.rejectLabel || 'No'"
              :severity="message.rejectProps?.severity"
              :outlined="message.rejectProps?.outlined"
              @click="rejectCallback" />
          </div>
        </div>
      </template>
    </confirm-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
interface Props {
  group?: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.confirm-dialog > .container {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--p-surface-0);
  border-radius: 0.5rem;
  min-width: 400px;

  .title {
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

  .button.-close {
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
    color: var(--p-button-text-secondary-color);
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

  .content {
    margin: 3rem 0 1.5rem 0;
  }

  .message {
    color: var(--p-dialog-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem 0;

    .icon {
      font-size: 1.25rem;
    }
  }

  .area.-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
