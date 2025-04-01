import { TokenNode, ProcessedToken, TokenSet } from './types';
import { processTokenValue } from './processors';

export function processPrimitiveTokens(tokens: TokenNode): ProcessedToken {
  const primitiveTokens = tokens['aura/primitive'];
  const processed = primitiveTokens && !('$type' in primitiveTokens) ? processTokenValue(primitiveTokens, primitiveTokens as TokenNode, ['primitive']) : {};
  return processed as ProcessedToken;
}

export function processSemanticTokens(tokens: TokenNode, primitiveTokens: ProcessedToken): ProcessedToken {
  const semanticTokens = tokens['aura/semantic'];
  const processed = semanticTokens ? processTokenValue(semanticTokens, primitiveTokens as TokenNode, ['semantic']) : {};
  return processed as ProcessedToken;
}

export function processColorScheme(tokens: TokenNode, primitiveTokens: ProcessedToken): { light: ProcessedToken; dark: ProcessedToken } {
  return {
    light: processTokenValue(tokens['aura/semantic/light'], primitiveTokens as TokenNode, ['semantic', 'light']) as ProcessedToken,
    dark: processTokenValue(tokens['aura/semantic/dark'], primitiveTokens as TokenNode, ['semantic', 'dark']) as ProcessedToken
  };
}

export function generateTheme(tokens: TokenNode): TokenSet {
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

export function formatObject(obj: TokenSet, indent = 0): string {
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