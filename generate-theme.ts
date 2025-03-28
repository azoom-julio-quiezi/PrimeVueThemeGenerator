import * as fs from 'fs';
import * as path from 'path';

interface Token {
  $type?: string;
  $value?: string | number | object;
  [key: string]: any;
}

interface TokenSet {
  primitive?: any;
  semantic?: any;
  light?: any;
  dark?: any;
}

interface ShadowValue {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
  type: 'dropShadow';
}
interface ProcessedFormField {
  background?: string;
  borderColor?: string;
  borderRadius?: string;
  color?: string;
  disabledBackground?: string;
  disabledColor?: string;
  filledBackground?: string;
  filledFocusBackground?: string;
  filledHoverBackground?: string;
  floatLabelColor?: string;
  floatLabelFocusColor?: string;
  floatLabelInvalidColor?: string;
  focusBorderColor?: string;
  focusRing?: {
    color?: string;
    offset?: string;
    shadow?: string;
    style?: string;
    width?: string;
  };
  fontSize?: string;
  hoverBorderColor?: string;
  iconColor?: string;
  invalidBorderColor?: string;
  invalidPlaceholderColor?: string;
  lg?: {
    fontSize?: string;
    paddingX?: string;
    paddingY?: string;
  };
  paddingX?: string;
  paddingY?: string;
  placeholderColor?: string;
  shadow?: string;
  sm?: {
    fontSize?: string;
    paddingX?: string;
    paddingY?: string;
  };
  transitionDuration?: string;
}

interface ProcessedList {
  padding?: string;
  gap?: string;
  header?: {
    padding?: string;
  }
  option?: {
    padding?: string;
    borderRadius?: string;
  }
  optionGroup?: {
    padding?: string;
    fontWeight?: string;
  }
}

interface ProcessedNavigation {
  list?: {
    padding?: string;
    gap?: string;
  }
  item?: {
    padding?: string;
    borderRadius?: string;
    gap?: string;
  }
  submenuLabel?: {
    padding?: string;
    fontWeight?: string;
  }
  submenuIconSize?: {
    size?: string;
  }
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

function processBoxShadow(value: any): string | undefined {
  if (Array.isArray(value)) {
    return value
      .filter(isShadowValue)
      .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
      .join(', ');
  } else if (typeof value === 'object' && value !== null) {
    if (isShadowValue(value)) {
      return `${value.x} ${value.y} ${value.blur} ${value.spread} ${value.color}`;
    }
    return Object.values(value)
      .filter(isShadowValue)
      .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
      .join(', ');
  }
  return undefined;
}

function processFormField(field: any): ProcessedFormField {
  const result: ProcessedFormField = {};

  const background = field.background?.$value || field.background;
  if (background !== undefined) {
    result.background = background;
  }

  const borderColor = field.border?.color?.$value;
  if (borderColor !== undefined) {
    result.borderColor = borderColor;
  }

  const borderRadius = field.border?.radius?.$value || field.borderRadius?.$value;
  if (borderRadius !== undefined) {
    result.borderRadius = borderRadius;
  }

  const color = field.color?.$value || field.color;
  if (color !== undefined) {
    result.color = color;
  }

  const disabledBackground = field.disabled?.background?.$value || field.disabled?.background;
  if (disabledBackground !== undefined) {
    result.disabledBackground = disabledBackground;
  }

  const disabledColor = field.disabled?.color?.$value || field.disabled?.color;
  if (disabledColor !== undefined) {
    result.disabledColor = disabledColor;
  }

  const filledBackground = field.filled?.background?.$value || field.filled?.background;
  if (filledBackground !== undefined) {
    result.filledBackground = filledBackground;
  }

  const filledFocusBackground = field.filled?.focus?.background?.$value || field.filled?.focus?.background;
  if (filledFocusBackground !== undefined) {
    result.filledFocusBackground = filledFocusBackground;
  }

  const filledHoverBackground = field.filled?.hover?.background?.$value || field.filled?.hover?.background; 
  if (filledHoverBackground !== undefined) {
    result.filledHoverBackground = filledHoverBackground;
  }

  const floatLabelColor = field.float?.label?.color?.$value || field.float?.label?.color;
  if (floatLabelColor !== undefined) {
    result.floatLabelColor = floatLabelColor;
  }

  const floatLabelFocusColor = field.float?.label?.focus?.color?.$value || field.float?.label?.focus?.color;  
  if (floatLabelFocusColor !== undefined) {
    result.floatLabelFocusColor = floatLabelFocusColor;
  }

  const floatLabelInvalidColor = field.float?.label?.invalid?.color?.$value || field.float?.label?.invalid?.color;
  if (floatLabelInvalidColor !== undefined) {
    result.floatLabelInvalidColor = floatLabelInvalidColor;
  }

  const focusBorderColor = field.focus?.border?.color?.$value;
  if (focusBorderColor !== undefined) {
    result.focusBorderColor = focusBorderColor;
  }

  if (field.focus?.ring) {
    const focusRingProps = {
      width: field.focus.ring.width?.$value || field.focus.ring.width,
      style: field.focus.ring.style?.$value || field.focus.ring.style,
      color: field.focus.ring.color?.$value || field.focus.ring.color,
      offset: field.focus.ring.offset?.$value || field.focus.ring.offset,
      shadow: processBoxShadow(field.focus.ring.shadow?.$value) || processBoxShadow(field.focus.ring.shadow)
    };
    if (Object.values(focusRingProps).some(v => v !== undefined)) {
      result.focusRing = focusRingProps;
    }
  }

  const fontSize = field.font?.size?.$value || field.fontSize?.$value;
  if (fontSize !== undefined) {
    result.fontSize = fontSize;
  }

  const hoverBorderColor = field.hover?.border?.color?.$value || field.hover?.borderColor;
  if (hoverBorderColor !== undefined) {
    result.hoverBorderColor = hoverBorderColor;
  }

  const iconColor = field.icon?.color?.$value || field.icon?.color;
  if (iconColor !== undefined) {
    result.iconColor = iconColor;
  }

  const invalidBorderColor = field.invalid?.border?.color?.$value || field.invalid?.borderColor;
  if (invalidBorderColor !== undefined) {
    result.invalidBorderColor = invalidBorderColor;
  }

  const invalidPlaceholderColor = field.invalid?.placeholder?.color?.$value || field.invalid?.placeholder?.color;
  if (invalidPlaceholderColor !== undefined) {
    result.invalidPlaceholderColor = invalidPlaceholderColor;
  }

  if (field.lg) {
    const lgProps = {
      paddingX: field.lg.padding?.x?.$value || field.lg.padding?.x,
      paddingY: field.lg.padding?.y?.$value || field.lg.padding?.y,
      fontSize: field.lg.font?.size?.$value || field.lg.font?.size
    };
    if (Object.values(lgProps).some(v => v !== undefined)) {
      result.lg = lgProps;
    }
  }

  const paddingX = field.padding?.x?.$value || field.padding?.x;
  if (paddingX !== undefined) {
    result.paddingX = paddingX;
  }

  const paddingY = field.padding?.y?.$value || field.padding?.y;
  if (paddingY !== undefined) {
    result.paddingY = paddingY;
  } 

  const placeholderColor = field.placeholder?.color?.$value || field.placeholder?.color;
  if (placeholderColor !== undefined) {
    result.placeholderColor = placeholderColor;
  }

  const shadow = field.shadow?.$value || field.shadow;
  if (shadow !== undefined) {
    result.shadow = processBoxShadow(field.shadow?.$value) || processBoxShadow(field.shadow)
  }

  if (field.sm) {
    const smProps = {
      paddingX: field.sm.padding?.x?.$value || field.sm.padding?.x,
      paddingY: field.sm.padding?.y?.$value || field.sm.padding?.y,
      fontSize: field.sm.font?.size?.$value || field.sm.font?.size
    };
    if (Object.values(smProps).some(v => v !== undefined)) {
      result.sm = smProps;
    }
  }

  const transitionDuration = field.transition?.duration?.$value || field.transitionDuration?.$value;
  if (transitionDuration !== undefined) {
    result.transitionDuration = transitionDuration;
  }

  return result;
}

function processList(field: any): ProcessedList {
  const result: ProcessedList = {};

  if (field.padding?.$value !== undefined) {
    result.padding = field.padding.$value;
  }

  if (field.gap?.$value !== undefined) {
    result.gap = field.gap.$value;
  }

  if (field.header?.padding?.$value !== undefined) {
    result.header = {
      padding: field.header.padding.$value
    };
  }

  if (field.option) {
    const optionProps = {
      padding: field.option.padding?.$value,
      borderRadius: field.option.border?.radius?.$value
    };
    if (Object.values(optionProps).some(v => v !== undefined)) {
      result.option = optionProps;
    }

    if (field.option.group) {
      const groupProps = {
        padding: field.option.group.padding?.$value,
        fontWeight: field.option.group.font?.weight?.$value
      };
      if (Object.values(groupProps).some(v => v !== undefined)) {
        result.optionGroup = groupProps;
      }
    }
  }
  
  return result;
}

function processNavigation(field: any): ProcessedNavigation {
  const result: ProcessedNavigation = {};

  if (field.list) {
    const listProps = {
      padding: field.list.padding?.$value,
      gap: field.list.gap?.$value
    };
    if (Object.values(listProps).some(v => v !== undefined)) {
      result.list = listProps;
    }
  }

  if (field.item) {
    const itemProps = {
      padding: field.item.padding?.$value,
      borderRadius: field.item.border?.radius?.$value,
      gap: field.item.gap?.$value
    };
    if (Object.values(itemProps).some(v => v !== undefined)) {
      result.item = itemProps;
    }
  }

  if (field.submenu?.label) {
    const labelProps = {
      padding: field.submenu.label.padding?.$value,
      fontWeight: field.submenu.label.font?.weight?.$value
    };
    if (Object.values(labelProps).some(v => v !== undefined)) {
      result.submenuLabel = labelProps;
    }
  }

  if (field.submenu?.icon?.size?.$value !== undefined) {
    result.submenuIconSize = {
      size: field.submenu.icon.size.$value
    };
  }

  return result;
}
  
// Special token transformations mapping
const TOKEN_TRANSFORMATIONS: { [key: string]: string } = {
  'active.color': 'activeColor',
  'anchor.gutter': 'anchorGutter',
  'border.color': 'borderColor',
  'border.radius': 'borderRadius',
  'contrast.color': 'contrastColor',
  'disabled.opacity': 'disabledOpacity',
  'focus.background': 'focusBackground',
  'focus.color': 'focusColor',
  'focus.ring': 'focusRing',
  'form.field': 'formField',
  'hover.color': 'hoverColor',
  'icon.size': 'iconSize',
  'transition.duration': 'transitionDuration'
};

// Parent properties that might need transformation
const TRANSFORM_PARENTS = new Set(['active', 'anchor', 'border', 'contrast', 'disabled', 'focus', 'form', 'hover', 'icon', 'transition']);
  
function shouldTransform(path: string[]): boolean {
  const pathStr = path.join('.');
  return Object.keys(TOKEN_TRANSFORMATIONS).some(pattern => pathStr.endsWith(pattern));
}

function getTransformedKey(path: string[]): string {
  const pathStr = path.join('.');
  for (const [pattern, replacement] of Object.entries(TOKEN_TRANSFORMATIONS)) {
    if (pathStr.endsWith(pattern)) {
      return replacement;
    }
  }
  return path[path.length - 1];
}

function processTransformableObject(
  obj: any,
  currentPath: string[],
  result: any,
  primitiveTokens: any
): void {
  if (!obj || typeof obj !== 'object') return;

  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...currentPath, key];
    const pathStr = newPath.join('.');

    // Check if this path needs transformation
    if (shouldTransform(newPath)) {
      const transformedKey = getTransformedKey(newPath);
      const processed = processTokenValue(value as Token, primitiveTokens, newPath);
      if (processed !== undefined) {
        result[transformedKey] = processed;
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      processTransformableObject(value, newPath, result, primitiveTokens);
    } else {
      // Process non-transformable values
      const processed = processTokenValue(value as Token | string | number | object | null | undefined, primitiveTokens, newPath);
      if (processed !== undefined) {
        let current = result;
        for (let i = 0; i < currentPath.length; i++) {
          if (!current[currentPath[i]]) {
            current[currentPath[i]] = {};
          }
          current = current[currentPath[i]];
        }
        current[key] = processed;
      }
    }
  }
}

function processTokenValue(
  token: Token | string | number | object | null | undefined, 
  primitiveTokens: any,
  currentPath: string[] = []
): any {
  // If token is null or undefined, return undefined
  if (!token) return undefined;

  // If it's a token object with $type and $value
  if (typeof token === 'object' && '$type' in token && '$value' in token) {
    const value = (token as Token).$value;
    
    switch ((token as Token).$type) {
      case 'boxShadow':
        return processBoxShadow(value);
      default:
        // For other types, just return the value
        return value;
    }
  }

  // If it's a reference string (e.g. "{primary.500}")
  if (typeof token === 'string' && token.includes('{')) {
    return token; // Keep references as is
  }

  // If it's a color value that could be referenced from primitive tokens
  if (typeof token === 'string' && token.startsWith('#')) {
    for (const [category, colors] of Object.entries(primitiveTokens || {})) {
      if (typeof colors === 'object' && colors !== null) {
        for (const [shade, colorValue] of Object.entries(colors)) {
          if (colorValue === token) {
            return `{${category}.${shade}}`;
          }
        }
      }
    }
  }

  // For objects, process each property recursively
  if (typeof token === 'object' && !Array.isArray(token)) {
    const result: any = {};
    
    for (const [key, value] of Object.entries(token)) {
      const newPath = [...currentPath, key];
      const pathStr = newPath.join('.');

      if (pathStr === 'semantic.form' || pathStr === 'semantic.light.form' || pathStr === 'semantic.dark.form') {
        const processedField = processFormField(value.field);
        if (processedField) {
          result.formField = processedField;
        }
      } else if (pathStr === 'semantic.list') {
        const processedList = processList(value);
        if (processedList) {
          result.list = processedList;
        }
      } else if (pathStr === 'semantic.navigation') {
        const processedNavigation = processNavigation(value);
        if (processedNavigation) {
          result.navigation = processedNavigation;
        }
      } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
        // Process transformable object recursively
        processTransformableObject(value, newPath, result, primitiveTokens);
      } else if (!shouldTransform(newPath)) {
        // Normal processing for non-transformable properties
        const processed = processTokenValue(value, primitiveTokens, newPath);
        if (processed !== undefined) {
          result[key] = processed;
        }
      }
    }
    
    return result;
  }

  // Return primitive values as is
  return token;
}

function processPrimitiveTokens(tokens: any): any {
  const primitiveTokens = tokens['aura/primitive'];
  return primitiveTokens ? processTokenValue(primitiveTokens, primitiveTokens, ['primitive']) : {};
}

function processSemanticTokens(tokens: any, primitiveTokens: any): any {
  const semanticTokens = tokens['aura/semantic'];
  return semanticTokens ? processTokenValue(semanticTokens, primitiveTokens, ['semantic']) : {};
}

function processColorScheme(tokens: any, primitiveTokens: any): { light: any; dark: any } {
  return {
    light: processTokenValue(tokens['aura/semantic/light'], primitiveTokens, ['semantic', 'light']),
    dark: processTokenValue(tokens['aura/semantic/dark'], primitiveTokens, ['semantic', 'dark'])
  };
}

function generateTheme(tokens: any): TokenSet {
  // Process each section separately
  const primitive = processPrimitiveTokens(tokens);
  const semantic = processSemanticTokens(tokens, primitive);
  const { light, dark } = processColorScheme(tokens, primitive);

  // Combine into final theme structure
  return {
    primitive,
    semantic: {
      ...semantic,
      colorScheme: {
        light,
        dark
      }
    }
  };
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