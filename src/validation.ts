import { TokenNode, TokenLeaf } from './types';

export function validateTokenStructure(token: TokenNode | TokenLeaf): boolean {
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