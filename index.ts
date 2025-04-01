import * as fs from 'fs';
import * as path from 'path';
import { TokenNode } from './types';
import { generateTheme, formatObject } from './theme';
import { validateTokenStructure } from './validation';

try {
  const tokensPath = path.join(__dirname, 'tokens/tokens.json');
  
  if (!fs.existsSync(tokensPath)) {
    throw new Error(`Tokens file not found at: ${tokensPath}`);
  }

  const fileContent = fs.readFileSync(tokensPath, 'utf-8');
  let tokens: TokenNode;
  
  try {
    tokens = JSON.parse(fileContent) as TokenNode;
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