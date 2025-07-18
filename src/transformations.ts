export const TOKEN_TRANSFORMATIONS: { [key: string]: string } = {
  'hover.border.color': 'hoverBorderColor',
  'filled.focus.background': 'filledFocusBackground',
  'filled.hover.background': 'filledHoverBackground',
  'float.label.active.color': 'floatLabelActiveColor',
  'float.label.color': 'floatLabelColor',
  'float.label.focus.color': 'floatLabelFocusColor',
  'float.label.invalid.color': 'floatLabelInvalidColor',
  'focus.border.color': 'focusBorderColor',
  'invalid.border.color': 'invalidBorderColor',
  'invalid.placeholder.color': 'invalidPlaceholderColor',
  'selected.focus.background': 'selectedFocusBackground',
  'selected.focus.color': 'selectedFocusColor',
  'active.background': 'activeBackground',
  'active.color': 'activeColor',
  'anchor.gutter': 'anchorGutter',
  'border.color': 'borderColor',
  'border.radius': 'borderRadius',
  'contrast.color': 'contrastColor',
  'disabled.background': 'disabledBackground',
  'disabled.color': 'disabledColor',
  'disabled.opacity': 'disabledOpacity',
  'filled.background': 'filledBackground',
  'focus.background': 'focusBackground',
  'focus.color': 'focusColor',
  'focus.ring': 'focusRing',
  'font.size': 'fontSize',
  'font.weight': 'fontWeight',
  'form.field': 'formField',
  'hover.background': 'hoverBackground',
  'hover.color': 'hoverColor',
  'hover.muted.color': 'hoverMutedColor',
  'icon.size': 'iconSize',
  'icon.color': 'iconColor',
  'muted.color': 'mutedColor',
  'option.group': 'optionGroup',
  'placeholder.color': 'placeholderColor',
  'selected.background': 'selectedBackground',
  'selected.color': 'selectedColor',
  'submenu.icon': 'submenuIcon',
  'submenu.label': 'submenuLabel',
  'transition.duration': 'transitionDuration',
}

export const TRANSFORM_PARENTS = new Set([
  'active',
  'anchor',
  'border',
  'contrast',
  'disabled',
  'filled',
  'float',
  'focus',
  'font',
])

export function shouldTransform(path: string[]): boolean {
  const pathStr = path.join('.')
  return Object.keys(TOKEN_TRANSFORMATIONS).some(pattern => pathStr.endsWith(pattern))
}

export function getTransformedKey(path: string[]): string {
  const pathStr = path.join('.')
  for (const [pattern, replacement] of Object.entries(TOKEN_TRANSFORMATIONS)) {
    if (pathStr.endsWith(pattern)) {
      return replacement
    }
  }
  return path[path.length - 1]
}
