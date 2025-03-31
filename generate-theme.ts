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
    icon?: {
      color?: string;
      focusColor?: string;
    }
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
  submenuIcon?: {
    color?: string;
    focusColor?: string;
    activeColor?: string;
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

  const padding = field.padding?.$value || field.padding;
  if (padding !== undefined) {
    result.padding = padding;
  }

  const gap = field.gap?.$value || field.gap;
  if (gap !== undefined) {
    result.gap = gap;
  }

  const headerPadding = field.header?.padding?.$value || field.header?.padding;
  if (headerPadding !== undefined) {
    result.header = {
      padding: headerPadding
    };
  }

  if (field.option) {
    const optionProps: any = {
      borderRadius: field.option.border?.radius?.$value,
      focusBackground: field.option.focus?.background?.$value,
      selectedBackground: field.option.selected?.background?.$value,
      selectedFocusBackground: field.option.selected?.focus?.background?.$value,
      color: field.option.color?.$value,
      focusColor: field.option.focus?.color?.$value,
      selectedColor: field.option.selected?.color?.$value,
      selectedFocusColor: field.option.selected?.focus?.color?.$value,
      padding: field.option.padding?.$value
    };

    if (field.option?.icon) {
      const iconColor = field.option.icon?.color?.$value;
      const iconFocusColor = field.option.icon?.focus?.color?.$value;
      
      if (iconColor !== undefined || iconFocusColor !== undefined) {
        optionProps.icon = {
          color: iconColor,
          focusColor: iconFocusColor
        };
      }
    }

    if (Object.values(optionProps).some(v => v !== undefined)) {
      result.option = optionProps;
    }

    if (field.option.group) {
      const groupProps = {
        fontWeight: field.option.group.font?.weight?.$value,
        background: field.option.group.background?.$value,
        color: field.option.group.color?.$value,
        padding: field.option.group.padding?.$value
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
    const itemProps: any = {
      padding: field.item.padding?.$value,
      borderRadius: field.item.border?.radius?.$value,
      gap: field.item.gap?.$value,
      focusBackground: field.item.focus?.background?.$value,
      activeBackground: field.item.active?.background?.$value,
      color: field.item.color?.$value,
      focusColor: field.item.focus?.color?.$value,
      activeColor: field.item.active?.color?.$value
    };

    if (field.item?.icon) {
      const iconColor = field.item.icon?.color?.$value;
      const iconFocusColor = field.item.icon?.focus?.color?.$value;
      
      if (iconColor !== undefined || iconFocusColor !== undefined) {
        itemProps.icon = {
          color: iconColor,
          focusColor: iconFocusColor
        };
      }
    }

    if (Object.values(itemProps).some(v => v !== undefined)) {
      result.item = itemProps;
    }
  }

  if (field.submenu?.label) {
    const labelProps = {
      background: field.submenu.label.background?.$value,
      color: field.submenu.label.color?.$value,
      padding: field.submenu.label.padding?.$value,
      fontWeight: field.submenu.label.font?.weight?.$value
    };
    if (Object.values(labelProps).some(v => v !== undefined)) {
      result.submenuLabel = labelProps;
    }
  }

  if (field.submenu?.icon) {
    const iconProps = {
      color: field.submenu.icon.color?.$value,
      focusColor: field.submenu.icon.focus?.color?.$value,
      activeColor: field.submenu.icon.active?.color?.$value,
      size: field.submenu.icon.size?.$value
    };
    if (Object.values(iconProps).some(v => v !== undefined)) {
      result.submenuIcon = iconProps;
    }
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
  'disabled.color': 'disabledColor',
  'disabled.opacity': 'disabledOpacity',
  'focus.background': 'focusBackground',
  'focus.color': 'focusColor',
  'focus.ring': 'focusRing',
  'form.field': 'formField',
  'hover.background': 'hoverBackground',
  'hover.color': 'hoverColor',
  'hover.muted.color': 'hoverMutedColor',
  'icon.size': 'iconSize',
  'muted.color': 'mutedColor',
  'transition.duration': 'transitionDuration',
};

// Parent properties that might need transformation
const TRANSFORM_PARENTS = new Set(['active', 'anchor', 'border', 'contrast', 'disabled', 'focus', 'form', 'hover', 'icon', 'muted', 'transition']);
  
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

function processTransformableToken(
  tokenKey: string,
  tokenValue: any,
  currentPath: string[],
  result: any,
  primitiveTokens: any
): void {
  if (!tokenValue || typeof tokenValue !== 'object') return;

  for (const [key, value] of Object.entries(tokenValue)) {
    const newPath = [...currentPath, key];

    if (shouldTransform(newPath)) {
      const transformedKey = getTransformedKey(newPath);
      const processed = processTokenValue(value as Token, primitiveTokens, newPath);
      if (processed !== undefined) {
        result[transformedKey] = processed;
      }

    } else if (typeof value === 'object' && value !== null && '$type' in value && '$value' in value) {
      // Process ultimate token values to return only value instead of object with $type and $value, e.g. disabled.color
      const processed = processTokenValue(tokenValue, primitiveTokens, newPath);
      if (processed !== undefined) {
       result[tokenKey] = processed;
      }

    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested object tokens, e.g. muted.color in hover.muted.color
      processTransformableToken(tokenKey, value, newPath, result, primitiveTokens);
    } else {
      throw new Error(`Could not process token properly: ${JSON.stringify(tokenValue)} at path ${currentPath.join('.')}`);
    }
  }
}

function processTokenValue(
  token: Token | string | number | object | null | undefined, 
  primitiveTokens: any,
  currentPath: string[] = []
): any {
  if (!token) return undefined;

  // Process ultimate token values to return only value instead of object with $type and $value
  if (typeof token === 'object' && '$type' in token && '$value' in token) {
    const value = (token as Token).$value;
    const type = (token as Token).$type;
    
    switch (type) {
      case 'boxShadow':
        return processBoxShadow(value);
      default:
        return value;
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
      } else if (pathStr === 'semantic.list' || pathStr === 'semantic.light.list' || pathStr === 'semantic.dark.list') {
        const processedList = processList(value);
        if (processedList) {
          result.list = processedList;
        }
      } else if (pathStr === 'semantic.navigation' || pathStr === 'semantic.light.navigation' || pathStr === 'semantic.dark.navigation') {
        const processedNavigation = processNavigation(value);
        if (processedNavigation) {
          result.navigation = processedNavigation;
        }
      } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
        // Transformable token, e.g. border.color to borderColor
        processTransformableToken(key, value, newPath, result, primitiveTokens);

      } else if (!shouldTransform(newPath)) {
        const processed = processTokenValue(value, primitiveTokens, newPath);
        if (processed !== undefined) {
          result[key] = processed;
        }
      }
    }
    return result;
  }

  throw new Error(`Could not process token properly: ${JSON.stringify(token)} at path ${currentPath.join('.')}`);
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
  const tokensPath = path.join(__dirname, 'tokens/tokens-customized.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  const theme = generateTheme(tokens);

  const content = `import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Default = definePreset(Aura, ${formatObject(theme, 2)});

export default Default;`;

  const outputPath = path.join(__dirname, 'PrimeVueTest/assets/themes/default.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  
  console.log('Theme file generated successfully!');
} catch (error) {
  console.error('Error generating theme:', error);
} 