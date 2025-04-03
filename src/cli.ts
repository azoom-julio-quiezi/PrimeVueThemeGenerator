#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { generateTheme } from './index';
import fs from 'fs';

interface BaseOptions {
  output: string;
}

interface ConvertOptions extends BaseOptions {
  input: string;
  force?: boolean;
}

const program = new Command();

program
  .command('create')
  .description('Create a new PrimeVue theme structure')
  .option('-o, --output <path>', 'Output directory', './themes')
  .action((options: BaseOptions) => {
    try {
      const outputDir = options.output;
      mkdirSync(outputDir, { recursive: true });
      copyTemplateFiles(
        join(__dirname, '../assets'),
        outputDir
      );
      console.log(`Theme structure created successfully in ${outputDir}!`);
      console.log('\nDirectory structure:');
      console.log(`${outputDir}/
  ├── themes/       # Theme files
  │   ├── aura/    # Base Aura preset
  │   └── default.ts
  └── styles/      # Component styles`);
    } catch (error) {
      console.error('Error creating theme structure:', error);
      process.exit(1);
    }
  });

program
  .command('convert-tokens')
  .description('Convert Studio Tokens to PrimeVue theme')
  .requiredOption('-i, --input <path>', 'Path to tokens.json')
  .option('-o, --output <path>', 'Output path', './assets/themes/theme-tokens.ts')
  .option('-f, --force', 'Force overwrite if output file exists')
  .action((options: ConvertOptions) => {
    try {
      const inputPath = path.resolve(options.input);
      const outputPath = path.resolve(options.output);

      if (fs.existsSync(outputPath) && !options.force) {
        console.error(`Error: Output file ${outputPath} already exists. Use --force to overwrite.`);
        process.exit(1);
      }

      generateTheme(inputPath, outputPath);
    } catch (error) {
      console.error('Error converting tokens:', error);
      process.exit(1);
    }
  });

program.parse();

function copyTemplateFiles(src: string, dest: string): void {
  const files = readdirSync(src);
  files.forEach(file => {
    const srcPath = join(src, file);
    const destPath = join(dest, file);
    
    if (statSync(srcPath).isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyTemplateFiles(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  });
}