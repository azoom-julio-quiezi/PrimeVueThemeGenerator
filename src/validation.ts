import { TokenNode, TokenLeaf, ShadowValue } from './types';

export function validateTokenStructure(token: TokenNode | TokenLeaf): boolean {
  if (!token || typeof token !== 'object') {
    console.warn('Invalid token: not an object or null/undefined');
    return false;
  }

  // Skip validation for special keys that don't follow the token structure
  if ('$themes' in token) {
    return true;
  }

  // Check if it's a leaf node (has both $type and $value)
  if ('$value' in token) {
    if (!('$type' in token)) {
      return false;
    }

    // Validate shadow values
    if (token.$type === 'boxShadow' || token.$type === 'shadow') {
      const shadowValue = token.$value as ShadowValue;
      return (
        typeof shadowValue === 'object' &&
        'x' in shadowValue &&
        'y' in shadowValue &&
        shadowValue.type === 'dropShadow'
      );
    }

    return true;
  }

  // For non-leaf nodes, validate all children
  for (const [key, value] of Object.entries(token)) {
    
    if (!validateTokenStructure(value)) {
      console.warn(`Invalid token structure at key: ${key}`);
      return false;
    }
  }

  return true;
} 