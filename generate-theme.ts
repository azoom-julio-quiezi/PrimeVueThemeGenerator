import * as fs from 'fs';
import * as path from 'path';

type TokenValue = string | ShadowValue;

interface ProcessedToken {
  [key: string]: TokenValue | ProcessedToken;
}

interface TokenLeaf {
  $type: string;
  $value: TokenValue;
}

type TokenNode = {
  [key: string]: TokenLeaf | TokenNode;
};

interface TokenSet {
  primitive?: ProcessedToken;
  semantic?: ProcessedToken;
  light?: ProcessedToken;
  dark?: ProcessedToken;
}

interface ShadowValue {
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
  type: 'dropShadow';
}

function processBoxShadow(value: ShadowValue | ShadowValue[]): string | undefined {
  if (Array.isArray(value)) {
    return value
      .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
      .join(', ');
  } else if (value !== null) {
    return `${value.x} ${value.y} ${value.blur} ${value.spread} ${value.color}`;
  }
  return undefined;
}

function processFormField(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {};

  if (!field || typeof field !== 'object') return result;

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) continue;

    if (key === 'padding') {
      const paddingValue = value as {
        x: TokenLeaf;
        y: TokenLeaf;
      };
      result.paddingX = paddingValue?.x?.$value;
      result.paddingY = paddingValue?.y?.$value;
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
    } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
      // Transformable token, e.g. border.color to borderColor
      processTransformableToken(key, (value as unknown) as TokenValue, [key], result, {});
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
      const { group, icon, ...optionWithoutGroup } = value as TokenNode;
      const optionProcessed = processTokenValue(optionWithoutGroup, {}, []);
      
      if (optionProcessed) {
        if (icon) {
          const iconValue = icon as {
            color: TokenLeaf;
            focus: {
              color: TokenLeaf;
            };
          };
          (optionProcessed as ProcessedToken).icon = {
            color: iconValue.color.$value,
            focusColor: iconValue.focus.color.$value
          };
        }
        
        result.option = optionProcessed;
      }

      const groupProcessed = processTokenValue(group, {}, []);
      if (groupProcessed) {
        result.optionGroup = groupProcessed;
      }
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
      const { label, icon } = value as TokenNode;
      const labelProcessed = processTokenValue(label, {}, []);
      if (labelProcessed) {
        result.submenuLabel = labelProcessed;
      }

      const iconProcessed = processTokenValue(icon, {}, []);
      if (iconProcessed) {
        result.submenuIcon = iconProcessed;
      }
    } else if (key === 'item') {
      const { icon, ...itemWithoutIcon } = value as TokenNode;
      const itemProcessed = processTokenValue(itemWithoutIcon, {}, []);
      
      if (itemProcessed) {
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
          (itemProcessed as ProcessedToken).icon = {
            color: iconValue.color.$value,
            focusColor: iconValue.focus.color.$value,
            activeColor: iconValue.active.color.$value
          };
        }
        
        result.item = itemProcessed;
      }
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
  tokenValue: TokenValue,
  currentPath: string[],
  result: ProcessedToken,
  primitiveTokens: TokenNode
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
          const tokenKeyObj = result[tokenKey] as ProcessedToken;
          tokenKeyObj[transformedKey] = processed;
        } else {
          // If no transformation pattern matches and token key is not in path, store under token key's object
          const tokenKeyObj = result[tokenKey] as ProcessedToken;
          tokenKeyObj[transformedKey] = processed;
        }
      }
    } else if (typeof value === 'object' && value !== null && '$type' in value && '$value' in value) {
      // Handle grandchild token values if it doesn't match transformable token
      const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath);
      if (processed !== undefined) {
        const tokenKeyObj = result[tokenKey] as ProcessedToken;
        tokenKeyObj[key] = processed;
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
  token: TokenNode | TokenLeaf | TokenValue, 
  primitiveTokens: TokenNode,
  currentPath: string[] = []
): TokenValue | ProcessedToken | undefined {
  if (!token) return undefined;

  // Process ultimate token values to return only value instead of object with $type and $value
  if (typeof token === 'object' && '$type' in token && '$value' in token) {
    const value = (token as TokenLeaf).$value;
    const type = (token as TokenLeaf).$type;
    
    switch (type) {
      case 'boxShadow':
        return processBoxShadow(value as ShadowValue | ShadowValue[]);
      default:
        return value;
    }
  }

  // For objects, process each property recursively
  if (typeof token === 'object') {
    const result: ProcessedToken = {};
    
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

function processPrimitiveTokens(tokens: TokenNode): ProcessedToken {
  const primitiveTokens = tokens['aura/primitive'];
  const processed = primitiveTokens && !('$type' in primitiveTokens) ? processTokenValue(primitiveTokens, primitiveTokens as TokenNode, ['primitive']) : {};
  return processed as ProcessedToken;
}

function processSemanticTokens(tokens: TokenNode, primitiveTokens: ProcessedToken): ProcessedToken {
  const semanticTokens = tokens['aura/semantic'];
  const processed = semanticTokens ? processTokenValue(semanticTokens, primitiveTokens as TokenNode, ['semantic']) : {};
  return processed as ProcessedToken;
}

function processColorScheme(tokens: TokenNode, primitiveTokens: ProcessedToken): { light: ProcessedToken; dark: ProcessedToken } {
  return {
    light: processTokenValue(tokens['aura/semantic/light'], primitiveTokens as TokenNode, ['semantic', 'light']) as ProcessedToken,
    dark: processTokenValue(tokens['aura/semantic/dark'], primitiveTokens as TokenNode, ['semantic', 'dark']) as ProcessedToken
  };
}

function generateTheme(tokens: TokenNode): TokenSet {
  const primitive = processPrimitiveTokens(tokens);
  const semantic = processSemanticTokens(tokens, primitive);
  const { light, dark } = processColorScheme(tokens, primitive);

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

function formatObject(obj: TokenSet, indent = 0): string {
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