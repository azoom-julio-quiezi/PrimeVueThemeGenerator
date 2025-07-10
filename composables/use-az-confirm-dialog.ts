import { useConfirm } from 'primevue/useconfirm'

interface ConfirmDialogOptions {
  message: string
  header?: string
  group?: string
  icon?: string // AzIcon name (e.g., 'warning', 'info', 'question')
  iconProps?: {
    type?: 'outline' | 'filled'
    size?: number
    bounded?: 'tight' | 'spacious'
    color?: string
    class?: string
  }
  accept?: () => void
  reject?: () => void
  acceptLabel?: string
  rejectLabel?: string
  acceptProps?: {
    label?: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
    outlined?: boolean
  }
  rejectProps?: {
    label?: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
    outlined?: boolean
  }
}

export function useAzConfirmDialog() {
  let confirm: ReturnType<typeof useConfirm> | null = null

  try {
    confirm = useConfirm()
  } catch (error) {
    console.warn('ConfirmationService not available:', error)
    // Return a mock function that does nothing
    return {
      showConfirm: () => {
        console.warn('ConfirmationService not available')
      }
    }
  }

  const showConfirm = (options: ConfirmDialogOptions) => {
    if (!confirm) {
      console.warn('ConfirmationService not available')
      return
    }

    confirm.require({
      ...options,
      header: options.header || 'Confirmation',
      icon: options.icon || 'warning',
      acceptLabel: options.acceptLabel || 'Yes',
      rejectLabel: options.rejectLabel || 'No'
    })
  }

  return {
    showConfirm
  }
}
