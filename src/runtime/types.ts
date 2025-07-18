export interface AzoomUIModuleOptions {
  prefix?: string
}

export interface BreadcrumbItem {
  label: string
  url?: string
  route?: string | Record<string, unknown>
  target?: '_blank' | '_self' | '_parent' | '_top'
  icon?: string
  disabled?: boolean
  command?: () => void
}

export interface LabelProps {
  label: string
  htmlFor?: string
  required?: boolean
  variant?: 'text' | 'star'
  size?: 'sm' | 'md' | 'lg'
}

export interface LinkProps {
  label?: string
  href: string
  external?: boolean
  variant?: 'primary' | 'secondary' | 'text' | 'traditional' | 'white'
  size?: 'xsm' | 'sm' | 'lg' | 'xlg'
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

export interface DialogProps {
  visible?: boolean
  header?: string
  modal?: boolean
  draggable?: boolean
  resizable?: boolean
  closeOnEscape?: boolean
  dismissableMask?: boolean
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  maximizable?: boolean
  breakpoints?: Record<string, string>
  style?: Record<string, string | number>
  class?: string | string[]
}

export interface ConfirmDialogProps {
  group?: string
  visible?: boolean
  header?: string
  icon?: string
  accept?: () => void
  reject?: () => void
  acceptLabel?: string
  rejectLabel?: string
  acceptClass?: string
  rejectClass?: string
  acceptIcon?: string
  rejectIcon?: string
  blockScroll?: boolean
  closeOnEscape?: boolean
  dismissableMask?: boolean
  style?: Record<string, string | number>
  class?: string | string[]
}

export interface BreadcrumbProps {
  model?: BreadcrumbItem[]
  home?: BreadcrumbItem
  separatorIcon?: string
  ariaLabel?: string
  style?: Record<string, string | number>
  class?: string | string[]
}
