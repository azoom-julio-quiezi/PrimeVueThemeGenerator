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
  try {
    if (!tokenValue || typeof tokenValue !== 'object') return;

    // Initialize the result object for this token key if it doesn't exist
    if (!result[tokenKey]) {
      result[tokenKey] = {};
    }

    for (const [key, value] of Object.entries(tokenValue)) {
      try {
        const newPath = [...currentPath, key];
        if (shouldTransform(newPath)) {
          const transformedKey = getTransformedKey(newPath);
          
          // Validate value before processing
          if (typeof value === 'object' && value !== null && '$type' in value && '$value' in value) {
            const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath);
            if (processed !== undefined) {
              const currentKeyIndex = newPath.indexOf(key);
              const parentKey = newPath[currentKeyIndex - 1];
              const pathStr = newPath.join('.');
              const matchingPattern = Object.keys(TOKEN_TRANSFORMATIONS).find(pattern => pathStr.endsWith(pattern));
              
              try {
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
              } catch (error) {
                console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error);
              }
            }
          } else {
            console.warn(`Warning: Invalid token value at path ${newPath.join('.')}:`, value);
          }
        } else if (typeof value === 'object' && value !== null) {
          if ('$type' in value && '$value' in value) {
            // Handle grandchild token values if it doesn't match transformable token
            const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath);
            if (processed !== undefined) {
              try {
                const tokenKeyObj = result[tokenKey] as ProcessedToken;
                tokenKeyObj[key] = processed;
              } catch (error) {
                console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error);
              }
            }
          } else if (typeof tokenValue === 'object' && '$type' in tokenValue && '$value' in tokenValue) {
            // Handle child token values if it doesn't match transformable token
            const processed = processTokenValue(tokenValue as TokenLeaf, primitiveTokens, newPath);
            if (processed !== undefined) {
              try {
                result[tokenKey] = processed;
              } catch (error) {
                console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error);
              }
            }
          } else {
            // Process nested objects recursively
            processTransformableToken(tokenKey, value, newPath, result, primitiveTokens);
          }
        } else {
          console.warn(`Warning: Could not process token at path ${newPath.join('.')}:`, value);
        }
      } catch (error) {
        console.warn(`Warning: Failed to process token at path ${[...currentPath, key].join('.')}:`, error);
      }
    }

    // Remove empty objects from result
    if (result[tokenKey] && Object.keys(result[tokenKey]).length === 0) {
      delete result[tokenKey];
    }
  } catch (error) {
    console.warn(`Warning: Error in processTransformableToken at path ${currentPath.join('.')}:`, error);
  }
}

function validateTokenStructure(token: any): boolean {
  if (!token || typeof token !== 'object') {
    console.warn('Invalid token: not an object or null/undefined');
    return false;
  }

  // Skip validation for special keys that don't follow the token structure
  if ('$themes' in token) {
    return true;
  }

  // Check if it's a leaf node (has $type and $value)
  if ('$type' in token && '$value' in token) {
    return true;
  }

  // For non-leaf nodes, validate all children
  for (const [key, value] of Object.entries(token)) {
    // Skip numeric keys (array indices)
    if (/^\d+$/.test(key)) {
      continue;
    }
    
    if (!validateTokenStructure(value)) {
      console.warn(`Invalid token structure at key: ${key}`);
      return false;
    }
  }

  return true;
}

function processTokenValue(
  token: TokenNode | TokenLeaf | TokenValue, 
  primitiveTokens: TokenNode,
  currentPath: string[] = []
): TokenValue | ProcessedToken | undefined {
  try {
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
        try {
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
            processTransformableToken(key, (value as unknown) as TokenValue, newPath, result, primitiveTokens);
          } else {
            const processed = processTokenValue(value, primitiveTokens, newPath);
            if (processed !== undefined) {
              result[key] = processed;
            }
          }
        } catch (error) {
          console.warn(`Warning: Failed to process token at path ${[...currentPath, key].join('.')}:`, error);
        }
      }
      return result;
    }

    console.warn(`Warning: Unexpected token type at path ${currentPath.join('.')}:`, token);
    return undefined;
  } catch (error) {
    console.warn(`Warning: Error processing token at path ${currentPath.join('.')}:`, error);
    return undefined;
  }
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
  
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`Tokens file not found at: ${tokensPath}`);
  }

  const fileContent = fs.readFileSync(tokensPath, 'utf-8');
  let tokens;
  
  try {
    tokens = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Invalid JSON in tokens file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate token structure
  if (!validateTokenStructure(tokens)) {
    throw new Error('Invalid token structure in tokens file');
  }

  const theme = generateTheme(tokens);

  const content = `import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Default = definePreset(Aura, ${formatObject(theme, 2)});

export default {
  preset: Default,
}`;

  const outputPath = path.join(__dirname, 'PrimeVueTest/assets/themes/default.ts');
  
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  fs.writeFileSync(outputPath, content);
  
  console.log('Theme file generated successfully!');
} catch (error) {
  console.error('Error generating theme:', error);
  process.exit(1);
} 