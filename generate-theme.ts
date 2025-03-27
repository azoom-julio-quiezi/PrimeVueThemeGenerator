import * as fs from 'fs';
import * as path from 'path';

interface Token {
  $type?: string;
  $value?: any;
  [key: string]: any;
}

interface ProcessedFormField {
  paddingX?: string;
  paddingY?: string;
  borderRadius?: string;
  fontSize?: string;
  transitionDuration?: string;
  focusRing?: {
    width?: string;
    style?: string;
    color?: string;
    offset?: string;
    shadow?: string;
  };
  sm?: {
    paddingX?: string;
    paddingY?: string;
    fontSize?: string;
  };
  lg?: {
    paddingX?: string;
    paddingY?: string;
    fontSize?: string;
  };
}

interface ShadowValue {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  type: 'dropShadow';
}

function isShadowValue(value: any): value is ShadowValue {
  return (
    value &&
    typeof value === 'object' &&
    'x' in value &&
    'y' in value &&
    'blur' in value &&
    'spread' in value &&
    'color' in value &&
    'type' in value &&
    value.type === 'dropShadow'
  );
}

function processTokenValue(value: any, primitiveTokens: any): any {
  // If it's a token object with $type and $value
  if (value && typeof value === 'object' && '$type' in value && '$value' in value) {
    const processedValue = value.$value;
    
    // Handle special types
    switch (value.$type) {
      case 'boxShadow':
        if (Array.isArray(processedValue)) {
          return processedValue
            .filter(isShadowValue)
            .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
            .join(', ');
        } else if (typeof processedValue === 'object' && processedValue !== null) {
          if (isShadowValue(processedValue)) {
            return `${processedValue.x} ${processedValue.y} ${processedValue.blur} ${processedValue.spread} ${processedValue.color}`;
          }
          return Object.values(processedValue)
            .filter(isShadowValue)
            .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
            .join(', ');
        }
        break;
      default:
        return processTokenValue(processedValue, primitiveTokens);
    }
  }

  // If it's a string that might contain a reference
  if (typeof value === 'string' && value.includes('{')) {
    const match = value.match(/\{([^}]+)\}/);
    if (!match) return value;

    // Keep the reference as is
    return value;
  }

  // If it's a color value that could be referenced from primitive tokens
  if (typeof value === 'string' && value.startsWith('#')) {
    // Try to find a matching primitive token
    for (const [category, colors] of Object.entries(primitiveTokens || {})) {
      if (typeof colors === 'object' && colors !== null) {
        for (const [shade, colorValue] of Object.entries(colors)) {
          if (colorValue === value) {
            return `{${category}.${shade}}`;
          }
        }
      }
    }
  }

  // For objects, process recursively
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const processed: any = {};
    for (const [key, val] of Object.entries(value)) {
      const processedValue = processTokenValue(val, primitiveTokens);
      if (processedValue !== undefined) {
        // Special handling for border.radius in primitive tokens
        if (key === 'border' && typeof val === 'object' && val !== null && 'radius' in val) {
          processed.borderRadius = processedValue.radius;
        } 
        // Special handling for list option group
        else if (key === 'option' && typeof val === 'object' && val !== null && 'group' in val) {
          processed[key] = { ...processedValue };
          delete processed[key].group;
          const group = val.group as { padding?: any; font?: { weight?: any } };
          if (group) {
            processed.optionGroup = {
              padding: group.padding ? processTokenValue(group.padding, primitiveTokens) : undefined,
              fontWeight: group.font?.weight ? processTokenValue(group.font.weight, primitiveTokens) : undefined
            };
          }
        }
        // Special handling for transition.duration
        else if (key === 'transition' && typeof val === 'object' && val !== null && 'duration' in val) {
          processed.transitionDuration = processTokenValue(val.duration, primitiveTokens);
        }
        // Special handling for navigation submenu
        else if (key === 'submenu' && typeof val === 'object' && val !== null) {
          const submenu = val as {
            label?: { padding?: any; font?: { weight?: any } };
            icon?: { size?: any }
          };
          if (submenu.label) {
            processed.submenuLabel = {
              padding: submenu.label.padding ? processTokenValue(submenu.label.padding, primitiveTokens) : undefined,
              fontWeight: submenu.label.font?.weight ? processTokenValue(submenu.label.font.weight, primitiveTokens) : undefined
            };
          }
          if (submenu.icon) {
            processed.submenuIcon = {
              size: submenu.icon.size ? processTokenValue(submenu.icon.size, primitiveTokens) : undefined
            };
          }
        }
        // Special handling for primary colors in colorScheme
        else if (key === 'primary' && typeof val === 'object' && val !== null) {
          const primary = val as {
            color?: any;
            contrast?: { color?: any };
            hover?: { color?: any };
            active?: { color?: any };
          };
          processed[key] = {
            color: primary.color ? processTokenValue(primary.color, primitiveTokens) : undefined,
            contrastColor: primary.contrast?.color ? processTokenValue(primary.contrast.color, primitiveTokens) : undefined,
            hoverColor: primary.hover?.color ? processTokenValue(primary.hover.color, primitiveTokens) : undefined,
            activeColor: primary.active?.color ? processTokenValue(primary.active.color, primitiveTokens) : undefined
          };
        }
        // Special handling for highlight colors
        else if (key === 'highlight' && typeof val === 'object' && val !== null) {
          const highlight = val as {
            background?: any;
            focus?: { background?: any; color?: any };
            color?: any;
          };
          processed[key] = {
            backgroundColor: highlight.background ? processTokenValue(highlight.background, primitiveTokens) : undefined,
            focusBackgroundColor: highlight.focus?.background ? processTokenValue(highlight.focus.background, primitiveTokens) : undefined,
            focusColor: highlight.focus?.color ? processTokenValue(highlight.focus.color, primitiveTokens) : undefined,
            color: highlight.color ? processTokenValue(highlight.color, primitiveTokens) : undefined
          };
        }
        // Special handling for content
        else if (key === 'content' && typeof val === 'object' && val !== null) {
          const content = val as {
            background?: any;
            hover?: { background?: any; color?: any };
            border?: { color?: any };
            color?: any;
          };
          processed[key] = {
            background: content.background ? processTokenValue(content.background, primitiveTokens) : undefined,
            hoverBackground: content.hover?.background ? processTokenValue(content.hover.background, primitiveTokens) : undefined,
            borderColor: content.border?.color ? processTokenValue(content.border.color, primitiveTokens) : undefined,
            color: content.color ? processTokenValue(content.color, primitiveTokens) : undefined,
            hoverColor: content.hover?.color ? processTokenValue(content.hover.color, primitiveTokens) : undefined
          };
        }
        // Special handling for text
        else if (key === 'text' && typeof val === 'object' && val !== null) {
          const text = val as {
            color?: any;
            hover?: { color?: any; muted?: { color?: any } };
            muted?: { color?: any };
          };
          processed[key] = {
            color: text.color ? processTokenValue(text.color, primitiveTokens) : undefined,
            hoverColor: text.hover?.color ? processTokenValue(text.hover.color, primitiveTokens) : undefined,
            mutedColor: text.muted?.color ? processTokenValue(text.muted.color, primitiveTokens) : undefined,
            hoverMutedColor: text.hover?.muted?.color ? processTokenValue(text.hover.muted.color, primitiveTokens) : undefined
          };
        }
        // Special handling for form field in colorScheme
        else if (key === 'form' && typeof val === 'object' && val !== null && 'field' in val) {
          const field = val.field as {
            background?: any;
            disabled?: { background?: any; color?: any };
            filled?: { background?: any; focus?: { background?: any }; hover?: { background?: any } };
            border?: { color?: any };
            hover?: { border?: { color?: any } };
            focus?: { border?: { color?: any } };
            invalid?: { border?: { color?: any }; placeholder?: { color?: any } };
            color?: any;
            placeholder?: { color?: any };
            float?: { label?: { color?: any; focus?: { color?: any }; invalid?: { color?: any } } };
            icon?: { color?: any };
            shadow?: any;
          };
          processed.formField = {
            background: field.background ? processTokenValue(field.background, primitiveTokens) : undefined,
            disabledBackground: field.disabled?.background ? processTokenValue(field.disabled.background, primitiveTokens) : undefined,
            filledBackground: field.filled?.background ? processTokenValue(field.filled.background, primitiveTokens) : undefined,
            filledFocusBackground: field.filled?.focus?.background ? processTokenValue(field.filled.focus.background, primitiveTokens) : undefined,
            borderColor: field.border?.color ? processTokenValue(field.border.color, primitiveTokens) : undefined,
            hoverBorderColor: field.hover?.border?.color ? processTokenValue(field.hover.border.color, primitiveTokens) : undefined,
            focusBorderColor: field.focus?.border?.color ? processTokenValue(field.focus.border.color, primitiveTokens) : undefined,
            invalidBorderColor: field.invalid?.border?.color ? processTokenValue(field.invalid.border.color, primitiveTokens) : undefined,
            color: field.color ? processTokenValue(field.color, primitiveTokens) : undefined,
            disabledColor: field.disabled?.color ? processTokenValue(field.disabled.color, primitiveTokens) : undefined,
            placeholderColor: field.placeholder?.color ? processTokenValue(field.placeholder.color, primitiveTokens) : undefined,
            floatLabelColor: field.float?.label?.color ? processTokenValue(field.float.label.color, primitiveTokens) : undefined,
            floatLabelFocusColor: field.float?.label?.focus?.color ? processTokenValue(field.float.label.focus.color, primitiveTokens) : undefined,
            floatLabelInvalidColor: field.float?.label?.invalid?.color ? processTokenValue(field.float.label.invalid.color, primitiveTokens) : undefined,
            iconColor: field.icon?.color ? processTokenValue(field.icon.color, primitiveTokens) : undefined,
            shadow: field.shadow ? processTokenValue(field.shadow, primitiveTokens) : undefined
          };
        }
        else {
          processed[key] = processedValue;
        }
      }
    }
    return Object.keys(processed).length > 0 ? processed : undefined;
  }

  return value;
}

function processFormField(formField: any): ProcessedFormField {
  const processed: ProcessedFormField = {};

  // Process padding
  if (formField.padding?.x?.$value) processed.paddingX = formField.padding.x.$value;
  if (formField.padding?.y?.$value) processed.paddingY = formField.padding.y.$value;

  // Process border radius
  if (formField.border?.radius?.$value) processed.borderRadius = formField.border.radius.$value;

  // Process font size
  if (formField.font?.size?.$value) processed.fontSize = formField.font.size.$value;

  // Process transition duration
  if (formField.transition?.duration?.$value) processed.transitionDuration = formField.transition.duration.$value;

  // Process focus ring
  if (formField.focus?.ring) {
    const ring = formField.focus.ring;
    const focusRing: any = {};

    if (ring.width?.$value) focusRing.width = ring.width.$value;
    if (ring.style?.$value) focusRing.style = ring.style.$value;
    if (ring.color?.$value) focusRing.color = ring.color.$value;
    if (ring.offset?.$value) focusRing.offset = ring.offset.$value;
    if (ring.shadow?.$value) {
      const shadowValue = ring.shadow.$value;
      if (shadowValue && typeof shadowValue === 'object' && 'x' in shadowValue && 'y' in shadowValue && 'blur' in shadowValue && 'spread' in shadowValue && 'color' in shadowValue) {
        focusRing.shadow = `${shadowValue.x} ${shadowValue.y} ${shadowValue.blur} ${shadowValue.spread} ${shadowValue.color}`;
      }
    }

    if (Object.keys(focusRing).length > 0) {
      processed.focusRing = focusRing;
    }
  }

  // Process variants
  if (formField.sm) {
    const sm: any = {};
    if (formField.sm.padding?.x?.$value) sm.paddingX = formField.sm.padding.x.$value;
    if (formField.sm.padding?.y?.$value) sm.paddingY = formField.sm.padding.y.$value;
    if (formField.sm.font?.size?.$value) sm.fontSize = formField.sm.font.size.$value;
    if (Object.keys(sm).length > 0) processed.sm = sm;
  }

  if (formField.lg) {
    const lg: any = {};
    if (formField.lg.padding?.x?.$value) lg.paddingX = formField.lg.padding.x.$value;
    if (formField.lg.padding?.y?.$value) lg.paddingY = formField.lg.padding.y.$value;
    if (formField.lg.font?.size?.$value) lg.fontSize = formField.lg.font.size.$value;
    if (Object.keys(lg).length > 0) processed.lg = lg;
  }

  return processed;
}

function generateTheme(tokens: any): any {
  const primitiveTokens = tokens['aura/primitive'];
  const result: any = { primitive: {}, semantic: {} };

  // Process primitive tokens
  if (primitiveTokens) {
    result.primitive = processTokenValue(primitiveTokens, primitiveTokens);
  }

  // Process semantic tokens
  const semanticTokens = tokens['aura/semantic'];
  if (semanticTokens) {
    // Extract and process special properties
    if (semanticTokens.form?.field) {
      result.semantic.formField = processFormField(semanticTokens.form.field);
    }

    // Process other semantic tokens
    const processed = processTokenValue(semanticTokens, primitiveTokens);
    
    // Extract flattened properties
    result.semantic = {
      ...result.semantic,
      transitionDuration: processed.transition?.duration?.$value || processed.transition?.duration,
      disabledOpacity: processed.disabled?.opacity?.$value || processed.disabled?.opacity,
      iconSize: processed.icon?.size?.$value || processed.icon?.size,
      anchorGutter: processed.anchor?.gutter?.$value || processed.anchor?.gutter,
      focusRing: {
        width: processed.focus?.ring?.width?.$value || processed.focus?.ring?.width,
        style: processed.focus?.ring?.style?.$value || processed.focus?.ring?.style,
        color: processed.focus?.ring?.color?.$value || processed.focus?.ring?.color,
        offset: processed.focus?.ring?.offset?.$value || processed.focus?.ring?.offset,
        shadow: processed.focus?.ring?.shadow?.$value || processed.focus?.ring?.shadow,
        stroke: processed.focus?.ring?.stroke
      },
      ...processed
    };

    // Clean up nested properties that were flattened
    delete result.semantic.transition?.duration;
    delete result.semantic.disabled?.opacity;
    delete result.semantic.icon?.size;
    delete result.semantic.anchor?.gutter;
    delete result.semantic.form?.field;
    delete result.semantic.focus?.ring;

    // Clean up empty objects
    ['transition', 'disabled', 'icon', 'anchor', 'form', 'focus'].forEach(key => {
      if (result.semantic[key] && Object.keys(result.semantic[key]).length === 0) {
        delete result.semantic[key];
      }
    });
  }

  // Process color schemes
  ['light', 'dark'].forEach(theme => {
    const themeTokens = tokens[`aura/semantic/${theme}`];
    if (themeTokens) {
      if (!result.semantic.colorScheme) result.semantic.colorScheme = {};
      result.semantic.colorScheme[theme] = processTokenValue(themeTokens, primitiveTokens);
    }
  });

  return result;
}

function formatObject(obj: any, indent = 0): string {
  if (!obj || Object.keys(obj).length === 0) return '{}';

  const spaces = ' '.repeat(indent);
  const innerSpaces = ' '.repeat(indent + 2);
  
  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined)
    .map(([key, value]) => {
      const formatted = typeof value === 'object' 
        ? formatObject(value, indent + 2)
        : typeof value === 'string' 
          ? `'${value}'` 
          : value;
      return `${innerSpaces}${key}: ${formatted}`;
    });

  return `{\n${entries.join(',\n')}\n${spaces}}`;
}

try {
  // Read tokens file
  const tokensPath = path.join(__dirname, 'tokens/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  // Generate theme structure
  const theme = generateTheme(tokens);

  // Generate theme file content
  const content = `import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Default = definePreset(Aura, ${formatObject(theme, 2)});

export default Default;`;

  // Write theme file
  const outputPath = path.join(__dirname, 'PrimeVueTest/assets/themes/default.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  
  console.log('Theme file generated successfully!');
} catch (error) {
  console.error('Error generating theme:', error);
} 