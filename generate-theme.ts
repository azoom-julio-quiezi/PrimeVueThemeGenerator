import * as fs from 'fs';
import * as path from 'path';

interface Token {
  [key: string]: any;
}

interface TokenValue {
  $type: string;
  $value: string;
}

interface DropShadowValue {
  type: 'dropShadow';
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
}

function isDropShadow(value: any): value is DropShadowValue {
  return (
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'dropShadow' &&
    'x' in value &&
    'y' in value &&
    'blur' in value &&
    'spread' in value &&
    'color' in value
  );
}

function resolveReference(value: string, primitive: Token, preserveReferences = false): string {
  if (typeof value !== 'string') return value;
  
  const match = value.match(/\{([^}]+)\}/);
  if (!match) return value;
  
  if (preserveReferences) return value;
  
  const reference = match[1];
  const parts = reference.split('.');
  let current: any = primitive;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`Warning: Reference "${reference}" not found in primitive tokens`);
      return value;
    }
  }
  
  return current;
}

function processTokens(tokens: any, primitive: Token, preserveReferences = false): any {
  if (typeof tokens !== 'object' || tokens === null) {
    return tokens;
  }

  // For semantic tokens, we want to use the $value directly
  if (tokens.$value !== undefined) {
    const value = tokens.$value;
    if (typeof value === 'object' && value !== null) {
      // For shadow values, format them as strings
      if (isDropShadow(value)) {
        return `${value.x} ${value.y} ${value.blur} ${value.spread} ${value.color}`;
      }
      // For boxShadow with multiple shadows
      if (value.$type === 'boxShadow' && typeof value === 'object' && value !== null) {
        const shadows = Object.values(value as Record<string, unknown>).filter(v => isDropShadow(v));
        return shadows.map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`).join(', ');
      }
      // For other complex values like border, use their values directly
      return value;
    }
    // If it's a string and contains a reference, resolve it
    if (typeof value === 'string' && value.includes('{')) {
      return resolveReference(value, primitive, preserveReferences);
    }
    return value;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key !== '$type') {
      // Special handling for shadow property
      if (key === 'shadow') {
        if (isDropShadow(value)) {
          result[key] = `${value.x} ${value.y} ${value.blur} ${value.spread} ${value.color}`;
        } else if (typeof value === 'object' && value !== null && '$value' in value) {
          const shadowValue = value.$value;
          if (typeof shadowValue === 'object' && shadowValue !== null) {
            const shadows = Object.values(shadowValue as Record<string, unknown>).filter(v => isDropShadow(v));
            result[key] = shadows.map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`).join(', ');
          } else {
            result[key] = shadowValue;
          }
        } else if (typeof value === 'string' && value.includes('{')) {
          result[key] = resolveReference(value, primitive, preserveReferences);
        } else {
          result[key] = value;
        }
        continue;
      }

      // If the value has a $value property, use that instead
      if (typeof value === 'object' && value !== null && '$value' in value) {
        const processedValue = (value as { $value: any }).$value;
        // If the value is a string, keep it as is
        if (typeof processedValue === 'string') {
          result[key] = processedValue;
        } else if (isDropShadow(processedValue)) {
          result[key] = `${processedValue.x} ${processedValue.y} ${processedValue.blur} ${processedValue.spread} ${processedValue.color}`;
        } else if (typeof processedValue === 'object' && processedValue !== null) {
          const shadows = Object.values(processedValue as Record<string, unknown>).filter(v => isDropShadow(v));
          if (shadows.length > 0) {
            result[key] = shadows.map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`).join(', ');
          } else {
            result[key] = processTokens(processedValue, primitive, preserveReferences);
          }
        } else {
          result[key] = processTokens(processedValue, primitive, preserveReferences);
        }
      } else if (typeof value === 'string') {
        // If it's a string and contains a reference, resolve it
        if (value.includes('{')) {
          result[key] = resolveReference(value, primitive, preserveReferences);
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        // For objects, process them recursively
        const processedValue = processTokens(value, primitive, preserveReferences);
        // Only add to result if the processed value is not undefined
        if (processedValue !== undefined) {
          result[key] = processedValue;
        }
      } else {
        // For other types (numbers, booleans, etc.), keep them as is
        result[key] = value;
      }
    }
  }

  // Remove empty objects
  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return result;
}

function formatObject(obj: any, baseIndent = 0, addNewline = true): string {
  if (obj === undefined || obj === null) {
    return '{}';
  }

  const indent = ' '.repeat(baseIndent);
  const nextIndent = ' '.repeat(baseIndent + 2);
  const lines: string[] = [];
  
  const entries = Object.entries(obj).filter(([_, value]) => value !== undefined);
  entries.forEach(([key, value], index) => {
    const isLast = index === entries.length - 1;
    if (typeof value === 'object' && value !== null) {
      lines.push(`${nextIndent}${key}: ${formatObject(value, baseIndent + 2, false)}${isLast ? '' : ','}`);
    } else {
      lines.push(`${nextIndent}${key}: ${typeof value === 'string' ? `'${value}'` : value}${isLast ? '' : ','}`);
    }
  });
  
  return `{${lines.length ? '\n' : ''}${lines.join('\n')}${lines.length ? `\n${indent}` : ''}}`;
}

try {
  // Read the combined tokens file
  const tokensPath = path.join(__dirname, 'tokens/tokens.json');
  const tokensContent = fs.readFileSync(tokensPath, 'utf-8');
  const tokens = JSON.parse(tokensContent);

  // Extract the sections we need
  const primitiveTokens = tokens['aura/primitive'];
  const semanticTokens = tokens['aura/semantic'];
  const lightTokens = tokens['aura/semantic/light'];
  const darkTokens = tokens['aura/semantic/dark'];

  // Process tokens
  const processedPrimitive = processTokens(primitiveTokens, primitiveTokens);
  const processedLightTokens = processTokens(lightTokens, processedPrimitive, true);
  const processedDarkTokens = processTokens(darkTokens, processedPrimitive, true);

  // Extract and process special semantic tokens
  const transitionDuration = processTokens(semanticTokens.transition?.duration, primitiveTokens);
  const disabledOpacity = semanticTokens.disabled?.opacity?.$value;
  const iconSize = semanticTokens.icon?.size?.$value;
  const anchorGutter = semanticTokens.anchor?.gutter?.$value;

  // Process focus ring properties
  const focusRingValues = {
    width: processTokens(semanticTokens.focus?.ring?.width, primitiveTokens),
    style: processTokens(semanticTokens.focus?.ring?.style, primitiveTokens),
    color: processTokens(semanticTokens.focus?.ring?.color, primitiveTokens),
    offset: processTokens(semanticTokens.focus?.ring?.offset, primitiveTokens),
    shadow: semanticTokens.focus?.ring?.shadow?.$value ? 
      processTokens(semanticTokens.focus?.ring?.shadow, primitiveTokens) : 
      semanticTokens.focus?.ring?.shadow
  };

  // Only include focusRing if at least one value is defined
  const focusRing = Object.values(focusRingValues).some(value => value !== undefined) ? focusRingValues : undefined;

  // Generate theme file content
  const tsContent = `import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Default = definePreset(Aura, {
  primitive: {
    borderRadius: ${formatObject(processedPrimitive.border?.radius || {}, 4)},
    emerald: ${formatObject(processedPrimitive.emerald || {}, 4)},
    green: ${formatObject(processedPrimitive.green || {}, 4)},
    lime: ${formatObject(processedPrimitive.lime || {}, 4)},
    red: ${formatObject(processedPrimitive.red || {}, 4)},
    orange: ${formatObject(processedPrimitive.orange || {}, 4)},
    amber: ${formatObject(processedPrimitive.amber || {}, 4)},
    yellow: ${formatObject(processedPrimitive.yellow || {}, 4)},
    teal: ${formatObject(processedPrimitive.teal || {}, 4)},
    cyan: ${formatObject(processedPrimitive.cyan || {}, 4)},
    sky: ${formatObject(processedPrimitive.sky || {}, 4)},
    blue: ${formatObject(processedPrimitive.blue || {}, 4)},
    indigo: ${formatObject(processedPrimitive.indigo || {}, 4)},
    violet: ${formatObject(processedPrimitive.violet || {}, 4)},
    purple: ${formatObject(processedPrimitive.purple || {}, 4)},
    fuchsia: ${formatObject(processedPrimitive.fuchsia || {}, 4)},
    pink: ${formatObject(processedPrimitive.pink || {}, 4)},
    rose: ${formatObject(processedPrimitive.rose || {}, 4)},
    slate: ${formatObject(processedPrimitive.slate || {}, 4)},
    gray: ${formatObject(processedPrimitive.gray || {}, 4)},
    zinc: ${formatObject(processedPrimitive.zinc || {}, 4)},
    neutral: ${formatObject(processedPrimitive.neutral || {}, 4)},
    stone: ${formatObject(processedPrimitive.stone || {}, 4)}
  },
  semantic: {
    transitionDuration: '${transitionDuration}',
    focusRing: ${formatObject(focusRing, 4)},
    disabledOpacity: '${disabledOpacity}',
    iconSize: '${iconSize}',
    anchorGutter: '${anchorGutter}',
    primary: ${formatObject(processTokens(semanticTokens.primary || {}, primitiveTokens), 4)},
    formField: ${formatObject(processTokens({
      paddingX: semanticTokens.form?.field?.padding?.x,
      paddingY: semanticTokens.form?.field?.padding?.y,
      borderRadius: semanticTokens.form?.field?.border?.radius,
      focusRing: {
        width: semanticTokens.focus?.ring?.width,
        style: semanticTokens.focus?.ring?.style,
        color: semanticTokens.focus?.ring?.color,
        offset: semanticTokens.focus?.ring?.offset,
        shadow: semanticTokens.focus?.ring?.shadow?.$value ? 
          processTokens(semanticTokens.focus?.ring?.shadow, primitiveTokens) : 
          semanticTokens.focus?.ring?.shadow
      },
      transitionDuration: semanticTokens.transition?.duration
    }, primitiveTokens), 4)},
    list: ${formatObject(processTokens({
      padding: semanticTokens.list?.padding,
      gap: semanticTokens.list?.gap,
      header: {
        padding: semanticTokens.list?.header?.padding
      },
      option: {
        padding: semanticTokens.list?.option?.padding,
        borderRadius: semanticTokens.list?.option?.border?.radius
      },
      optionGroup: {
        padding: semanticTokens.list?.option?.group?.padding,
        fontWeight: semanticTokens.list?.option?.group?.font?.weight
      }
    }, primitiveTokens), 4)},
    content: ${formatObject(processTokens({
      borderRadius: semanticTokens.content?.border?.radius
    }, primitiveTokens), 4)},
    mask: ${formatObject(processTokens({
      transitionDuration: semanticTokens.mask?.transition?.duration
    }, primitiveTokens), 4)},
    navigation: ${formatObject(processTokens({
      list: {
        padding: semanticTokens.navigation?.list?.padding,
        gap: semanticTokens.navigation?.list?.gap
      },
      item: {
        padding: semanticTokens.navigation?.item?.padding,
        borderRadius: semanticTokens.navigation?.item?.border?.radius,
        gap: semanticTokens.navigation?.item?.gap
      },
      submenuLabel: {
        padding: semanticTokens.navigation?.submenu?.label?.padding,
        fontWeight: semanticTokens.navigation?.submenu?.label?.font?.weight
      },
      submenuIcon: {
        size: semanticTokens.navigation?.submenu?.icon?.size
      }
    }, primitiveTokens), 4)},
    overlay: ${formatObject(processTokens({
      select: {
        borderRadius: semanticTokens.overlay?.select?.border?.radius,
        shadow: semanticTokens.overlay?.select?.shadow
      },
      popover: {
        borderRadius: semanticTokens.overlay?.popover?.border?.radius,
        padding: semanticTokens.overlay?.popover?.padding,
        shadow: semanticTokens.overlay?.popover?.shadow
      },
      modal: {
        borderRadius: semanticTokens.overlay?.modal?.border?.radius,
        padding: semanticTokens.overlay?.modal?.padding,
        shadow: semanticTokens.overlay?.modal?.shadow
      },
      navigation: {
        shadow: semanticTokens.overlay?.navigation?.shadow
      }
    }, primitiveTokens), 4)},
    colorScheme: {
      light: ${formatObject(processTokens({
        surface: tokens['aura/semantic/light'].surface,
        primary: {
          color: tokens['aura/semantic/light'].primary?.color,
          contrastColor: tokens['aura/semantic/light'].primary?.contrast?.color,
          hoverColor: tokens['aura/semantic/light'].primary?.hover?.color,
          activeColor: tokens['aura/semantic/light'].primary?.active?.color
        },
        highlight: {
          background: tokens['aura/semantic/light'].highlight?.background,
          focusBackground: tokens['aura/semantic/light'].highlight?.focus?.background,
          color: tokens['aura/semantic/light'].highlight?.color,
          focusColor: tokens['aura/semantic/light'].highlight?.focus?.color
        },
        focusRing: Object.values({
          shadow: tokens['aura/semantic/light'].focus?.ring?.shadow
        }).some(value => value !== undefined) ? {
          shadow: tokens['aura/semantic/light'].focus?.ring?.shadow
        } : undefined,
        mask: tokens['aura/semantic/light'].mask,
        formField: {
          background: tokens['aura/semantic/light'].form?.field?.background,
          disabledBackground: tokens['aura/semantic/light'].form?.field?.disabled?.background,
          filledBackground: tokens['aura/semantic/light'].form?.field?.filled?.background,
          filledFocusBackground: tokens['aura/semantic/light'].form?.field?.filled?.focus?.background,
          borderColor: tokens['aura/semantic/light'].form?.field?.border?.color,
          hoverBorderColor: tokens['aura/semantic/light'].form?.field?.hover?.border?.color,
          focusBorderColor: tokens['aura/semantic/light'].form?.field?.focus?.border?.color,
          invalidBorderColor: tokens['aura/semantic/light'].form?.field?.invalid?.border?.color,
          color: tokens['aura/semantic/light'].form?.field?.color,
          disabledColor: tokens['aura/semantic/light'].form?.field?.disabled?.color,
          placeholderColor: tokens['aura/semantic/light'].form?.field?.placeholder?.color,
          floatLabelColor: tokens['aura/semantic/light'].form?.field?.float?.label?.color,
          floatLabelFocusColor: tokens['aura/semantic/light'].form?.field?.float?.label?.focus?.color,
          floatLabelInvalidColor: tokens['aura/semantic/light'].form?.field?.float?.label?.invalid?.color,
          iconColor: tokens['aura/semantic/light'].form?.field?.icon?.color,
          shadow: processTokens(tokens['aura/semantic/light'].form?.field?.shadow, primitiveTokens)
        },
        text: {
          color: tokens['aura/semantic/light'].text?.color,
          hoverColor: tokens['aura/semantic/light'].text?.hover?.color,
          mutedColor: tokens['aura/semantic/light'].text?.muted?.color,
          hoverMutedColor: tokens['aura/semantic/light'].text?.hover?.muted?.color
        },
        content: {
          background: tokens['aura/semantic/light'].content?.background,
          hoverBackground: tokens['aura/semantic/light'].content?.hover?.background,
          borderColor: tokens['aura/semantic/light'].content?.border?.color,
          color: tokens['aura/semantic/light'].content?.color,
          hoverColor: tokens['aura/semantic/light'].content?.hover?.color
        },
        overlay: {
          select: {
            background: tokens['aura/semantic/light'].overlay?.select?.background,
            borderColor: tokens['aura/semantic/light'].overlay?.select?.border?.color,
            color: tokens['aura/semantic/light'].overlay?.select?.color
          },
          popover: {
            background: tokens['aura/semantic/light'].overlay?.popover?.background,
            borderColor: tokens['aura/semantic/light'].overlay?.popover?.border?.color,
            color: tokens['aura/semantic/light'].overlay?.popover?.color
          },
          modal: {
            background: tokens['aura/semantic/light'].overlay?.modal?.background,
            borderColor: tokens['aura/semantic/light'].overlay?.modal?.border?.color,
            color: tokens['aura/semantic/light'].overlay?.modal?.color
          }
        },
        list: {
          option: {
            focusBackground: tokens['aura/semantic/light'].list?.option?.focus?.background,
            selectedBackground: tokens['aura/semantic/light'].list?.option?.selected?.background,
            selectedFocusBackground: tokens['aura/semantic/light'].list?.option?.selected?.focus?.background,
            color: tokens['aura/semantic/light'].list?.option?.color,
            focusColor: tokens['aura/semantic/light'].list?.option?.focus?.color,
            selectedColor: tokens['aura/semantic/light'].list?.option?.selected?.color,
            selectedFocusColor: tokens['aura/semantic/light'].list?.option?.selected?.focus?.color,
            icon: {
              color: tokens['aura/semantic/light'].list?.option?.icon?.color,
              focusColor: tokens['aura/semantic/light'].list?.option?.icon?.focus?.color
            }
          },
          optionGroup: {
            background: tokens['aura/semantic/light'].list?.option?.group?.background,
            color: tokens['aura/semantic/light'].list?.option?.group?.color
          }
        },
        navigation: {
          item: {
            focusBackground: tokens['aura/semantic/light'].navigation?.item?.focus?.background,
            activeBackground: tokens['aura/semantic/light'].navigation?.item?.active?.background,
            color: tokens['aura/semantic/light'].navigation?.item?.color,
            focusColor: tokens['aura/semantic/light'].navigation?.item?.focus?.color,
            activeColor: tokens['aura/semantic/light'].navigation?.item?.active?.color,
            icon: {
              color: tokens['aura/semantic/light'].navigation?.item?.icon?.color,
              focusColor: tokens['aura/semantic/light'].navigation?.item?.icon?.focus?.color,
              activeColor: tokens['aura/semantic/light'].navigation?.item?.icon?.active?.color
            }
          },
          submenuLabel: {
            background: tokens['aura/semantic/light'].navigation?.submenu?.label?.background,
            color: tokens['aura/semantic/light'].navigation?.submenu?.label?.color
          },
          submenuIcon: {
            color: tokens['aura/semantic/light'].navigation?.submenu?.icon?.color,
            focusColor: tokens['aura/semantic/light'].navigation?.submenu?.icon?.focus?.color,
            activeColor: tokens['aura/semantic/light'].navigation?.submenu?.icon?.active?.color
          }
        }
      }, primitiveTokens), 6)},
      dark: ${formatObject(processTokens({
        surface: tokens['aura/semantic/dark'].surface,
        primary: {
          color: tokens['aura/semantic/dark'].primary?.color,
          contrastColor: tokens['aura/semantic/dark'].primary?.contrast?.color,
          hoverColor: tokens['aura/semantic/dark'].primary?.hover?.color,
          activeColor: tokens['aura/semantic/dark'].primary?.active?.color
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        },
        focusRing: Object.values({
          shadow: tokens['aura/semantic/dark'].focus?.ring?.shadow
        }).some(value => value !== undefined) ? {
          shadow: tokens['aura/semantic/dark'].focus?.ring?.shadow
        } : undefined,
        mask: tokens['aura/semantic/dark'].mask,
        formField: {
          background: tokens['aura/semantic/dark'].form?.field?.background,
          disabledBackground: tokens['aura/semantic/dark'].form?.field?.disabled?.background,
          filledBackground: tokens['aura/semantic/dark'].form?.field?.filled?.background,
          filledFocusBackground: tokens['aura/semantic/dark'].form?.field?.filled?.focus?.background,
          borderColor: tokens['aura/semantic/dark'].form?.field?.border?.color,
          hoverBorderColor: tokens['aura/semantic/dark'].form?.field?.hover?.border?.color,
          focusBorderColor: tokens['aura/semantic/dark'].form?.field?.focus?.border?.color,
          invalidBorderColor: tokens['aura/semantic/dark'].form?.field?.invalid?.border?.color,
          color: tokens['aura/semantic/dark'].form?.field?.color,
          disabledColor: tokens['aura/semantic/dark'].form?.field?.disabled?.color,
          placeholderColor: tokens['aura/semantic/dark'].form?.field?.placeholder?.color,
          floatLabelColor: tokens['aura/semantic/dark'].form?.field?.float?.label?.color,
          floatLabelFocusColor: tokens['aura/semantic/dark'].form?.field?.float?.label?.focus?.color,
          floatLabelInvalidColor: tokens['aura/semantic/dark'].form?.field?.float?.label?.invalid?.color,
          iconColor: tokens['aura/semantic/dark'].form?.field?.icon?.color,
          shadow: processTokens(tokens['aura/semantic/dark'].form?.field?.shadow, primitiveTokens)
        },
        text: {
          color: tokens['aura/semantic/dark'].text?.color,
          hoverColor: tokens['aura/semantic/dark'].text?.hover?.color,
          mutedColor: tokens['aura/semantic/dark'].text?.muted?.color,
          hoverMutedColor: tokens['aura/semantic/dark'].text?.hover?.muted?.color
        },
        content: {
          background: tokens['aura/semantic/dark'].content?.background,
          hoverBackground: tokens['aura/semantic/dark'].content?.hover?.background,
          borderColor: tokens['aura/semantic/dark'].content?.border?.color,
          color: tokens['aura/semantic/dark'].content?.color,
          hoverColor: tokens['aura/semantic/dark'].content?.hover?.color
        },
        overlay: {
          select: {
            background: tokens['aura/semantic/dark'].overlay?.select?.background,
            borderColor: tokens['aura/semantic/dark'].overlay?.select?.border?.color,
            color: tokens['aura/semantic/dark'].overlay?.select?.color
          },
          popover: {
            background: tokens['aura/semantic/dark'].overlay?.popover?.background,
            borderColor: tokens['aura/semantic/dark'].overlay?.popover?.border?.color,
            color: tokens['aura/semantic/dark'].overlay?.popover?.color
          },
          modal: {
            background: tokens['aura/semantic/dark'].overlay?.modal?.background,
            borderColor: tokens['aura/semantic/dark'].overlay?.modal?.border?.color,
            color: tokens['aura/semantic/dark'].overlay?.modal?.color
          }
        },
        list: {
          option: {
            focusBackground: tokens['aura/semantic/dark'].list?.option?.focus?.background,
            selectedBackground: tokens['aura/semantic/dark'].list?.option?.selected?.background,
            selectedFocusBackground: tokens['aura/semantic/dark'].list?.option?.selected?.focus?.background,
            color: tokens['aura/semantic/dark'].list?.option?.color,
            focusColor: tokens['aura/semantic/dark'].list?.option?.focus?.color,
            selectedColor: tokens['aura/semantic/dark'].list?.option?.selected?.color,
            selectedFocusColor: tokens['aura/semantic/dark'].list?.option?.selected?.focus?.color,
            icon: {
              color: tokens['aura/semantic/dark'].list?.option?.icon?.color,
              focusColor: tokens['aura/semantic/dark'].list?.option?.icon?.focus?.color
            }
          },
          optionGroup: {
            background: tokens['aura/semantic/dark'].list?.option?.group?.background,
            color: tokens['aura/semantic/dark'].list?.option?.group?.color
          }
        },
        navigation: {
          item: {
            focusBackground: tokens['aura/semantic/dark'].navigation?.item?.focus?.background,
            activeBackground: tokens['aura/semantic/dark'].navigation?.item?.active?.background,
            color: tokens['aura/semantic/dark'].navigation?.item?.color,
            focusColor: tokens['aura/semantic/dark'].navigation?.item?.focus?.color,
            activeColor: tokens['aura/semantic/dark'].navigation?.item?.active?.color,
            icon: {
              color: tokens['aura/semantic/dark'].navigation?.item?.icon?.color,
              focusColor: tokens['aura/semantic/dark'].navigation?.item?.icon?.focus?.color,
              activeColor: tokens['aura/semantic/dark'].navigation?.item?.icon?.active?.color
            }
          },
          submenuLabel: {
            background: tokens['aura/semantic/dark'].navigation?.submenu?.label?.background,
            color: tokens['aura/semantic/dark'].navigation?.submenu?.label?.color
          },
          submenuIcon: {
            color: tokens['aura/semantic/dark'].navigation?.submenu?.icon?.color,
            focusColor: tokens['aura/semantic/dark'].navigation?.submenu?.icon?.focus?.color,
            activeColor: tokens['aura/semantic/dark'].navigation?.submenu?.icon?.active?.color
          }
        }
      }, primitiveTokens), 6)}
    }
  },
  components: {
    accordion: ${formatObject(processedPrimitive.accordion || {}, 4)},
    autocomplete: ${formatObject(processedPrimitive.autocomplete || {}, 4)},
    avatar: ${formatObject(processedPrimitive.avatar || {}, 4)},
    badge: ${formatObject(processedPrimitive.badge || {}, 4)},
    blockui: ${formatObject(processedPrimitive.blockui || {}, 4)},
    breadcrumb: ${formatObject(processedPrimitive.breadcrumb || {}, 4)},
    button: ${formatObject(processedPrimitive.button || {}, 4)},
    datepicker: ${formatObject(processedPrimitive.datepicker || {}, 4)},
    card: ${formatObject(processedPrimitive.card || {}, 4)},
    carousel: ${formatObject(processedPrimitive.carousel || {}, 4)},
    cascadeselect: ${formatObject(processedPrimitive.cascadeselect || {}, 4)},
    checkbox: ${formatObject(processedPrimitive.checkbox || {}, 4)},
    chip: ${formatObject(processedPrimitive.chip || {}, 4)},
    colorpicker: ${formatObject(processedPrimitive.colorpicker || {}, 4)},
    confirmdialog: ${formatObject(processedPrimitive.confirmdialog || {}, 4)},
    confirmpopup: ${formatObject(processedPrimitive.confirmpopup || {}, 4)},
    contextmenu: ${formatObject(processedPrimitive.contextmenu || {}, 4)},
    dataview: ${formatObject(processedPrimitive.dataview || {}, 4)},
    datatable: ${formatObject(processedPrimitive.datatable || {}, 4)},
    dialog: ${formatObject(processedPrimitive.dialog || {}, 4)},
    divider: ${formatObject(processedPrimitive.divider || {}, 4)},
    dock: ${formatObject(processedPrimitive.dock || {}, 4)},
    drawer: ${formatObject(processedPrimitive.drawer || {}, 4)},
    editor: ${formatObject(processedPrimitive.editor || {}, 4)},
    fieldset: ${formatObject(processedPrimitive.fieldset || {}, 4)},
    fileupload: ${formatObject(processedPrimitive.fileupload || {}, 4)},
    floatlabel: ${formatObject(processedPrimitive.floatlabel || {}, 4)},
    galleria: ${formatObject(processedPrimitive.galleria || {}, 4)},
    iconfield: ${formatObject(processedPrimitive.iconfield || {}, 4)},
    image: ${formatObject(processedPrimitive.image || {}, 4)},
    inlinemessage: ${formatObject(processedPrimitive.inlinemessage || {}, 4)},
    inplace: ${formatObject(processedPrimitive.inplace || {}, 4)},
    inputchips: ${formatObject(processedPrimitive.inputchips || {}, 4)},
    inputgroup: ${formatObject(processedPrimitive.inputgroup || {}, 4)},
    inputnumber: ${formatObject(processedPrimitive.inputnumber || {}, 4)},
    inputtext: ${formatObject(processedPrimitive.inputtext || {}, 4)},
    knob: ${formatObject(processedPrimitive.knob || {}, 4)},
    listbox: ${formatObject(processedPrimitive.listbox || {}, 4)},
    megamenu: ${formatObject(processedPrimitive.megamenu || {}, 4)},
    menu: ${formatObject(processedPrimitive.menu || {}, 4)},
    menubar: ${formatObject(processedPrimitive.menubar || {}, 4)},
    message: ${formatObject(processedPrimitive.message || {}, 4)},
    metergroup: ${formatObject(processedPrimitive.metergroup || {}, 4)},
    multiselect: ${formatObject(processedPrimitive.multiselect || {}, 4)},
    orderlist: ${formatObject(processedPrimitive.orderlist || {}, 4)},
    organizationchart: ${formatObject(processedPrimitive.organizationchart || {}, 4)},
    overlaybadge: ${formatObject(processedPrimitive.overlaybadge || {}, 4)},
    popover: ${formatObject(processedPrimitive.popover || {}, 4)},
    paginator: ${formatObject(processedPrimitive.paginator || {}, 4)},
    password: ${formatObject(processedPrimitive.password || {}, 4)},
    panel: ${formatObject(processedPrimitive.panel || {}, 4)},
    panelmenu: ${formatObject(processedPrimitive.panelmenu || {}, 4)},
    picklist: ${formatObject(processedPrimitive.picklist || {}, 4)},
    progressbar: ${formatObject(processedPrimitive.progressbar || {}, 4)},
    progressspinner: ${formatObject(processedPrimitive.progressspinner || {}, 4)},
    radiobutton: ${formatObject(processedPrimitive.radiobutton || {}, 4)},
    rating: ${formatObject(processedPrimitive.rating || {}, 4)},
    scrollpanel: ${formatObject(processedPrimitive.scrollpanel || {}, 4)},
    select: ${formatObject(processedPrimitive.select || {}, 4)},
    selectbutton: ${formatObject(processedPrimitive.selectbutton || {}, 4)},
    skeleton: ${formatObject(processedPrimitive.skeleton || {}, 4)},
    slider: ${formatObject(processedPrimitive.slider || {}, 4)},
    splitbutton: ${formatObject(processedPrimitive.splitbutton || {}, 4)},
    steps: ${formatObject(processedPrimitive.steps || {}, 4)},
    tabview: ${formatObject(processedPrimitive.tabview || {}, 4)},
    tag: ${formatObject(processedPrimitive.tag || {}, 4)},
    terminal: ${formatObject(processedPrimitive.terminal || {}, 4)},
    textarea: ${formatObject(processedPrimitive.textarea || {}, 4)},
    tieredmenu: ${formatObject(processedPrimitive.tieredmenu || {}, 4)},
    timeline: ${formatObject(processedPrimitive.timeline || {}, 4)},
    toast: ${formatObject(processedPrimitive.toast || {}, 4)},
    togglebutton: ${formatObject(processedPrimitive.togglebutton || {}, 4)},
    toolbar: ${formatObject(processedPrimitive.toolbar || {}, 4)},
    tooltip: ${formatObject(processedPrimitive.tooltip || {}, 4)},
    tree: ${formatObject(processedPrimitive.tree || {}, 4)},
    treeselect: ${formatObject(processedPrimitive.treeselect || {}, 4)},
    treenode: ${formatObject(processedPrimitive.treenode || {}, 4)},
    treetable: ${formatObject(processedPrimitive.treetable || {}, 4)},
    tristatecheckbox: ${formatObject(processedPrimitive.tristatecheckbox || {}, 4)},
    virtualscroller: ${formatObject(processedPrimitive.virtualscroller || {}, 4)}
  },
  directives: {
    ripple: ${formatObject(processedPrimitive.ripple || {}, 4)}
  }
});

export default Default;`;

  // Ensure the themes directory exists
  const defaultTsPath = path.join(__dirname, 'PrimeVueTest/assets/themes/default.ts');
  fs.mkdirSync(path.dirname(defaultTsPath), { recursive: true });

  // Write the theme file
  fs.writeFileSync(defaultTsPath, tsContent);
  console.log('Theme file generated successfully!');
} catch (error) {
  console.error('Error generating theme:', error);
} 