import * as fs from 'node:fs'
import * as path from 'node:path'

import type { ProcessedToken, TokenNode, TokenSet } from './types'
import { processTokenValue } from './processors'
import { validateTokenStructure } from './validation'

export function processPrimitiveTokens(tokens: TokenNode): ProcessedToken {
  const primitiveTokens = tokens['aura/primitive']
  const processed = primitiveTokens && !('$type' in primitiveTokens) ? processTokenValue(primitiveTokens, primitiveTokens as TokenNode, ['primitive']) : {}
  return processed as ProcessedToken
}

export function processSemanticTokens(tokens: TokenNode, primitiveTokens: ProcessedToken): ProcessedToken {
  const semanticTokens = tokens['aura/semantic']
  const processed = semanticTokens ? processTokenValue(semanticTokens, primitiveTokens as TokenNode, ['semantic']) : {}
  return processed as ProcessedToken
}

export function processColorScheme(tokens: TokenNode, primitiveTokens: ProcessedToken): { light: ProcessedToken, dark: ProcessedToken } {
  return {
    light: processTokenValue(tokens['aura/semantic/light'], primitiveTokens as TokenNode, ['semantic', 'light']) as ProcessedToken,
    dark: processTokenValue(tokens['aura/semantic/dark'], primitiveTokens as TokenNode, ['semantic', 'dark']) as ProcessedToken,
  }
}

export function createThemeStructure(tokens: TokenNode): TokenSet {
  const primitive = processPrimitiveTokens(tokens)
  const semantic = processSemanticTokens(tokens, primitive)
  const { light, dark } = processColorScheme(tokens, primitive)

  return {
    primitive,
    semantic: {
      ...semantic,
      colorScheme: {
        light,
        dark,
      },
    },
  }
}

export function formatObject(obj: TokenSet, indent = 0): string {
  if (!obj || Object.keys(obj).length === 0) {
    return '{}'
  }

  const spaces = ' '.repeat(indent)
  const innerSpaces = ' '.repeat(indent + 2)

  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined)
    .map(([key, value]) => {
      const formatted = typeof value === 'object'
        ? formatObject(value, indent + 2)
        : typeof value === 'string'
          ? `'${value}'`
          : value
      return `${innerSpaces}${key}: ${formatted}`
    })

  return `{\n${entries.join(',\n')}\n${spaces}}`
}

export function generateTheme(inputPath: string, outputPath: string): void {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Tokens file not found at: ${inputPath}`)
    }

    const fileContent = fs.readFileSync(inputPath, 'utf-8')
    let tokens: TokenNode

    try {
      tokens = JSON.parse(fileContent) as TokenNode
    } catch (error) {
      throw new Error(`Invalid JSON in tokens file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    if (!validateTokenStructure(tokens)) {
      throw new Error('Invalid token structure in tokens file')
    }

    const themeStructure = createThemeStructure(tokens)
    const outputDir = path.dirname(outputPath)

    fs.mkdirSync(outputDir, { recursive: true })

    // Export just the tokens
    const content = `// Generated from ${path.basename(inputPath)}
// This file contains only the theme tokens. Import it in your theme file.

export const tokens = {
  primitive: ${JSON.stringify(themeStructure.primitive, null, 2)},
  semantic: ${JSON.stringify(themeStructure.semantic, null, 2)}
};
`

    fs.writeFileSync(outputPath, content)

    console.warn(`Theme tokens generated successfully at ${outputPath}`)
    console.warn('\nTo use these tokens, import them in your theme file:')
    console.warn(`
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { tokens } from './${path.basename(outputPath)}';
import button from './button/button';

const Default = definePreset(Aura, {
  ...tokens,
  components: {
    button,
  },
});

export default {
  preset: Default,
  options: {
    // Add other options here
  },
}`)
  } catch (error) {
    console.error('Error generating theme:', error)
    process.exit(1)
  }
}
