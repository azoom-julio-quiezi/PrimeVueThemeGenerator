#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
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
  .option('-o, --output <path>', 'Output directory', './')
  .action((options: BaseOptions) => {
    try {
      const outputAssetsDir = options.output + '/assets';
      const outputComponentsDir = options.output + '/components';
      
      const packageAssetsDir = join(__dirname, '../assets');
      const packageComponentsDir = join(__dirname, '../components');
      
      if (!existsSync(packageAssetsDir)) {
        console.error('Error: Package assets directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(packageComponentsDir)) {
        console.error('Error: Package components directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(outputAssetsDir)) {
        mkdirSync(outputAssetsDir, { recursive: true });
        console.log(`Created directory: ${outputAssetsDir}`);
      }

      if (!existsSync(outputComponentsDir)) {
        mkdirSync(outputComponentsDir, { recursive: true });
        console.log(`Created directory: ${outputComponentsDir}`);
      }

      copyTemplateFiles(packageAssetsDir, outputAssetsDir);
      copyTemplateFiles(packageComponentsDir, outputComponentsDir);
      console.log(`\nTheme structure created successfully in ${outputAssetsDir} and ${outputComponentsDir}!`);
    } catch (error) {
      console.error('Error creating theme structure:', error);
      process.exit(1);
    }
  });

program
  .command('convert-tokens')
  .description('Convert Studio Tokens to PrimeVue theme')
  .requiredOption('-i, --input <path>', 'Path to tokens.json')
  .option('-o, --output <path>', 'Output path', './themes/theme-tokens.ts')
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
  if (!existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }

  const files = readdirSync(src);
  files.forEach(file => {
    const srcPath = join(src, file);
    const destPath = join(dest, file);
    
    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
        console.log(`Created directory: ${destPath}`);
      }
      copyTemplateFiles(srcPath, destPath);
    } else {
      if (!existsSync(destPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`Created file: ${destPath}`);
      }
    }
  });
}