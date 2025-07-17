import * as fs from 'fs';
import * as path from 'path';
import { TokenNode } from './types';
import { createThemeStructure } from './theme';
import { validateTokenStructure } from './validation';

export function generateTheme(inputPath: string, outputPath: string): void {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Tokens file not found at: ${inputPath}`);
    }

    const fileContent = fs.readFileSync(inputPath, 'utf-8');
    let tokens: TokenNode;
    
    try {
      tokens = JSON.parse(fileContent) as TokenNode;
    } catch (error) {
      throw new Error(`Invalid JSON in tokens file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    if (!validateTokenStructure(tokens)) {
      throw new Error('Invalid token structure in tokens file');
    }

    const themeStructure = createThemeStructure(tokens);
    const outputDir = path.dirname(outputPath);
    
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Export just the tokens
    const content = `// Generated from ${path.basename(inputPath)}
// This file contains only the theme tokens. Import it in your theme file.

export const tokens = {
  primitive: ${JSON.stringify(themeStructure.primitive, null, 2)},
  semantic: ${JSON.stringify(themeStructure.semantic, null, 2)}
};
`;

    fs.writeFileSync(outputPath, content);
    
    console.log(`Theme tokens generated successfully at ${outputPath}`);
    console.log('\nTo use these tokens, import them in your theme file:');
    console.log(`
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
}`);
  } catch (error) {
    console.error('Error generating theme:', error);
    process.exit(1);
  }
} 