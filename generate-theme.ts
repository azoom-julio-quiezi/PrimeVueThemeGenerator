import * as fs from 'fs';
import * as path from 'path';

type TokenValue = string | object;

interface ProcessedToken {
  [key: string]: TokenValue;
}

interface TokenLeaf {
  $type: string;
  $value: TokenValue;
}

type TokenNode = {
  [key: string]: TokenLeaf | TokenNode;
};

interface TokenSet {
  primitive?: TokenNode;
  semantic?: TokenNode;
  light?: TokenNode;
  dark?: TokenNode;
}

interface ShadowValue {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
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

function processFormField(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {};

  if (!field || typeof field !== 'object') return result;

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) continue;

    if (key === 'padding') {
      const paddingValue = value as TokenNode;
      result.paddingX = paddingValue?.x?.$value;
      result.paddingY = paddingValue?.y?.$value;
    } else if (key === 'border') {
      const borderValue = value as TokenNode;
      result.borderRadius = borderValue?.radius?.$value;
    } else if (key === 'transition') {
      const transitionValue = value as TokenNode;
      result.transitionDuration = transitionValue.duration.$value as string;
    } else if (key === 'disabled') {
      const disabledValue = value as TokenNode;
      result.disabledColor = disabledValue.color.$value;
      result.disabledBackground = disabledValue.background.$value;
    } else if (key === 'icon') {
      const iconValue = value as TokenNode;
      result.iconColor = iconValue.color.$value;
    } else if (key === 'hover') {
      const hoverValue = value as {
        border: {
          color: TokenLeaf;
        };
      };
      result.hoverBorderColor = hoverValue.border.color.$value;
    } else if (key === 'invalid') {
      const invalidValue = value as {
        border: {
          color: TokenLeaf;
        };
        placeholder: {
          color: TokenLeaf;
        };
      };
      result.invalidBorderColor = invalidValue.border.color.$value;
      result.invalidPlaceholderColor = invalidValue.placeholder.color.$value;
    } else if (key === 'filled') {
      const filledValue = value as {
        background: TokenLeaf;
        focus: {
          background: TokenLeaf;
        };
        hover: {
          background: TokenLeaf;
        };
      };
      result.filledBackground = filledValue.background.$value;
      result.filledFocusBackground = filledValue.focus.background.$value;
      result.filledHoverBackground = filledValue.hover.background.$value;
    } else if (key === 'float') {
      const floatValue = value as {
        label: {
          color: TokenLeaf;
          focus: {
            color: TokenLeaf;
          };
          invalid: {
            color: TokenLeaf;
          };
          active: {
            color: TokenLeaf;
          };
        };
      };
      result.floatLabelColor = floatValue.label.color.$value;
      result.floatLabelFocusColor = floatValue.label.focus.color.$value;
      result.floatLabelInvalidColor = floatValue.label.invalid.color.$value;
      result.floatLabelActiveColor = floatValue.label.active.color.$value;
    } else if (key === 'focus') {
        const { ring } = value as any;
        const ringProcessed = processTokenValue(ring, {}, []);
        result.focusRing = ringProcessed;
    } else if (key === 'sm' || key === 'lg') {
      const sizeValue = value as {
        font: {
          size: TokenLeaf;
        };
        padding: {
          x: TokenLeaf;
          y: TokenLeaf;
        };
      };
      result[key] = {
        fontSize: sizeValue?.font?.size?.$value,
        paddingX: sizeValue?.padding?.x?.$value,
        paddingY: sizeValue?.padding?.y?.$value
      };
    } else {
      const processed = processTokenValue(value, {}, []);
      if (processed !== undefined) {
        result[key] = processed;
      }
    }
  }

  return result;
}

function processList(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {};

  if (!field || typeof field !== 'object') return result;

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) continue;

    if (key === 'option') {
      const { group, selected, icon, ...optionWithoutGroup } = value as any;
      const optionProcessed = processTokenValue(optionWithoutGroup, {}, []);
      
      if (selected) {
        const selectedValue = selected as {
          background: TokenLeaf;
          focus: {
            background: TokenLeaf;
            color: TokenLeaf;
          };
          color: TokenLeaf;
        };
        optionProcessed.selectedBackground = selectedValue.background.$value;
        optionProcessed.selectedColor = selectedValue.color.$value;
        optionProcessed.selectedFocusBackground = selectedValue.focus.background.$value;
        optionProcessed.selectedFocusColor = selectedValue.focus.color.$value;
      }

      if (icon) {
        const iconValue = icon as {
          color: TokenLeaf;
          focus: {
            color: TokenLeaf;
          };
        };
        optionProcessed.icon = {
          color: iconValue.color.$value,
          focusColor: iconValue.focus.color.$value
        };
      }
      
      result.option = optionProcessed;

      // Process optionGroup properties
      const groupProcessed = processTokenValue(group, {}, []);
      result.optionGroup = groupProcessed;
    } else {
      const processed = processTokenValue(value, {}, []);
      if (processed !== undefined) {
        result[key] = processed;
      }
    }
  }

  return result;
}

function processNavigation(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {};

  if (!field || typeof field !== 'object') return result;

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) continue;

    if (key === 'submenu') {
      const { label, icon } = value as any;
      const labelProcessed = processTokenValue(label, {}, []);
      result.submenuLabel = labelProcessed;

      const iconProcessed = processTokenValue(icon, {}, []);
      result.submenuIcon = iconProcessed;
    } else if (key === 'item') {
      const { icon, ...itemWithoutIcon } = value as any;
      const itemProcessed = processTokenValue(itemWithoutIcon, {}, []);
      
      if (icon) {
        const iconValue = icon as {
          color: TokenLeaf;
          focus: {
            color: TokenLeaf;
          };
          active: {
            color: TokenLeaf;
          };
        };
        itemProcessed.icon = {
          color: iconValue.color.$value,
          focusColor: iconValue.focus.color.$value,
          activeColor: iconValue.active.color.$value
        };
      }
      
      result.item = itemProcessed;
    } else {
      const processed = processTokenValue(value, {}, []);
      if (processed !== undefined) {
        result[key] = processed;
      }
    }
  }

  return result;
}

// Special token transformations mapping
const TOKEN_TRANSFORMATIONS: { [key: string]: string } = {
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
  'selected.focus.background': 'selectedFocusBackground',
  'selected.focus.color': 'selectedFocusColor',
  'selected.color': 'selectedColor',
  'submenu.icon': 'submenuIcon',
  'submenu.label': 'submenuLabel',
  'transition.duration': 'transitionDuration',
};

// Parent properties that might need transformation
const TRANSFORM_PARENTS = new Set(['active', 'anchor', 'border', 'contrast', 'disabled', 'filled', 'float', 'focus', 'font', 'form', 'hover', 'icon', 'invalid', 'muted', 'option', 'placeholder', 'selected', 'submenu', 'transition']);
  
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

  // Initialize the result object for this token key if it doesn't exist
  if (!result[tokenKey]) {
    result[tokenKey] = {};
  }

  for (const [key, value] of Object.entries(tokenValue)) {
    const newPath = [...currentPath, key];
    if (shouldTransform(newPath)) {
      const transformedKey = getTransformedKey(newPath);
      const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath);
      if (processed !== undefined) {
        const currentKeyIndex = newPath.indexOf(key);
        const parentKey = newPath[currentKeyIndex - 1];
        const pathStr = newPath.join('.');
        const matchingPattern = Object.keys(TOKEN_TRANSFORMATIONS).find(pattern => pathStr.endsWith(pattern));
        
        if (matchingPattern && matchingPattern.split('.').length >= 3) {
          // If the matching pattern has 3 or more segments, store directly under transformed key
          result[transformedKey] = processed;
        } else if (parentKey === tokenKey) {
          // If the parent key is the same as the token key, store directly under transformed key
          result[transformedKey] = processed;
        } else if (newPath.includes(tokenKey)) {
          // If the token key is anywhere in the path, store under token key's object
          result[tokenKey][transformedKey] = processed;
        } else {
          // If no transformation pattern matches and token key is not in path, store under token key's object
          result[tokenKey][transformedKey] = processed;
        }
      }
    } else if (typeof value === 'object' && value !== null && '$type' in value && '$value' in value) {
      // Handle grandchild token values if it doesn't match transformable token
      const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath);
      if (processed !== undefined) {
        result[tokenKey][key] = processed;
      }
    } else if (typeof tokenValue === 'object' && value !== null && '$type' in tokenValue && '$value' in tokenValue) {
      // Handle child token values if it doesn't match transformable token
      const processed = processTokenValue(tokenValue as TokenLeaf, primitiveTokens, newPath);
      if (processed !== undefined) {
        result[tokenKey] = processed;
      }
    } else if (typeof value === 'object' && value !== null) {
      // Process nested objects recursively
      processTransformableToken(tokenKey, value, newPath, result, primitiveTokens);
    } else {
      throw new Error(`Could not process token properly: ${JSON.stringify(tokenValue)} at path ${currentPath.join('.')}`);
    }
  }

  // Remove empty objects from result
  if (result[tokenKey] && Object.keys(result[tokenKey]).length === 0) {
    delete result[tokenKey];
  }
}

function processTokenValue(
  token: TokenLeaf | string | object | null | undefined, 
  primitiveTokens: any,
  currentPath: string[] = []
): any {
  if (!token) return undefined;

  // Process ultimate token values to return only value instead of object with $type and $value
  if (typeof token === 'object' && '$type' in token && '$value' in token) {
    const value = (token as TokenLeaf).$value;
    const type = (token as TokenLeaf).$type;
    
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
      } else {
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