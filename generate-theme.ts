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

// Special token transformations mapping
const TOKEN_TRANSFORMATIONS: { [key: string]: string } = {
  'border.radius': 'borderRadius',
  'transition.duration': 'transitionDuration',
  'font.size': 'fontSize',
  'font.weight': 'fontWeight',
  'font.family': 'fontFamily',
  'line.height': 'lineHeight',
  'letter.spacing': 'letterSpacing',
  'anchor.gutter': 'anchorGutter',
  'icon.size': 'iconSize',
  'disabled.opacity': 'disabledOpacity',
  'form.field': 'formField',
  'focus.ring': 'focusRing'
};

// Parent properties that might need transformation
const TRANSFORM_PARENTS = new Set(['border', 'transition', 'font', 'line', 'letter', 'anchor', 'icon', 'disabled', 'form', 'focus']);

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

  // Handle padding at the root level
  if (field.padding) {
    result.paddingX = field.padding.x?.$value || field.padding.x;
    result.paddingY = field.padding.y?.$value || field.padding.y;
  }

  // Handle border radius
  if (field.border?.radius?.$value) {
    result.borderRadius = field.border.radius.$value;
  } else if (field.borderRadius?.$value) {
    result.borderRadius = field.borderRadius.$value;
  }

  // Handle transition duration
  if (field.transition?.duration?.$value) {
    result.transitionDuration = field.transition.duration.$value;
  } else if (field.transitionDuration?.$value) {
    result.transitionDuration = field.transitionDuration.$value;
  }

  // Handle focus ring
  if (field.focus?.ring) {
    result.focusRing = {
      width: field.focus.ring.width?.$value || field.focus.ring.width,
      style: field.focus.ring.style?.$value || field.focus.ring.style,
      color: field.focus.ring.color?.$value || field.focus.ring.color,
      offset: field.focus.ring.offset?.$value || field.focus.ring.offset,
      shadow: processBoxShadow(field.focus.ring.shadow?.$value) || processBoxShadow(field.focus.ring.shadow)
    };
  }

  // Handle size variants (sm, lg)
  if (field.sm) {
    result.sm = {
      paddingX: field.sm.padding?.x?.$value || field.sm.padding?.x,
      paddingY: field.sm.padding?.y?.$value || field.sm.padding?.y,
      fontSize: field.sm.font?.size?.$value || field.sm.font?.size
    };
  }

  if (field.lg) {
    result.lg = {
      paddingX: field.lg.padding?.x?.$value || field.lg.padding?.x,
      paddingY: field.lg.padding?.y?.$value || field.lg.padding?.y,
      fontSize: field.lg.font?.size?.$value || field.lg.font?.size
    };
  }

  return result;
}

function processList(field: any): ProcessedList {
  const result: ProcessedList = {};

  if (field.padding) {
    result.padding = field.padding.$value;
  }

  if (field.gap) {
    result.gap = field.gap.$value;
  }

  if (field.header) {
    result.header = {
      padding: field.header.padding.$value
    }
  }

  if (field.option) {
    result.option = {
      padding: field.option.padding.$value,
      borderRadius: field.option.border.radius.$value
    }
    if (field.option.group) {
      result.optionGroup = {
        padding: field.option.group.padding.$value,
        fontWeight: field.option.group.font.weight.$value
      }
    }
  }
  
  return result;
}

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

      if (pathStr === 'semantic.form') {
        // Process form field and add it directly to result
        const processedField = processFormField(value.field);
        if (processedField) {
          result.formField = processedField;
        }
      } else if (pathStr === 'semantic.list') {
        const processedList = processList(value);
        if (processedList) {
          result.list = processedList;
        }
      } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
        // Look ahead for transformable properties
        for (const [childKey, childValue] of Object.entries(value)) {
          const transformPath = [...newPath, childKey];
          if (shouldTransform(transformPath)) {
            // Process and store with transformed key
            const transformedKey = getTransformedKey(transformPath);
            const processed = processTokenValue(childValue as Token, primitiveTokens, transformPath);
            if (processed !== undefined) {
              result[transformedKey] = processed;
            }
          } else {
            // Process normally if not a transformable property
            const processed = processTokenValue(childValue as Token, primitiveTokens, transformPath);
            if (processed !== undefined) {
              if (!result[key]) result[key] = {};
              result[key][childKey] = processed;
            }
          }
        }
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