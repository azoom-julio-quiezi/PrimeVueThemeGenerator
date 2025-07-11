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
  .option('--skip-components', 'Skip copying components, composables, and plugins (import from package instead)')
  .action((options: BaseOptions & { skipComponents?: boolean }) => {
    try {
      const outputAssetsDir = options.output + '/assets';
      const outputComponentsDir = options.output + '/components';
      const outputComposablesDir = options.output + '/composables';
      const outputPluginsDir = options.output + '/plugins';
      
      const packageAssetsDir = join(__dirname, '../assets');
      const packageComponentsDir = join(__dirname, '../components');
      const packageComposablesDir = join(__dirname, '../composables');
      const packagePluginsDir = join(__dirname, '../plugins');
      
      if (!existsSync(packageAssetsDir)) {
        console.error('Error: Package assets directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(packageComponentsDir)) {
        console.error('Error: Package components directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(packageComposablesDir)) {
        console.error('Error: Package composables directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(packagePluginsDir)) {
        console.error('Error: Package plugins directory not found. Please ensure the package is properly installed.');
        process.exit(1);
      }

      if (!existsSync(outputAssetsDir)) {
        mkdirSync(outputAssetsDir, { recursive: true });
        console.log(`Created directory: ${outputAssetsDir}`);
      }

      // Always copy themes/assets
      copyTemplateFiles(packageAssetsDir, outputAssetsDir);
      console.log(`✅ Theme structure created successfully in ${outputAssetsDir}!`);

      // Conditionally copy components, composables, and plugins
      if (options.skipComponents) {
        console.log(`\n📦 Components, composables, and plugins skipped. Import them from the package:`);
        console.log(`   import { AzBreadcrumb } from '@azoom/primevue-theme-generator/components'`);
        console.log(`   import { useAzConfirmDialog } from '@azoom/primevue-theme-generator/composables'`);
        console.log(`   import confirmationPlugin from '@azoom/primevue-theme-generator/plugins/confirmation.client'`);
      } else {
        if (!existsSync(outputComponentsDir)) {
          mkdirSync(outputComponentsDir, { recursive: true });
          console.log(`Created directory: ${outputComponentsDir}`);
        }
        copyTemplateFiles(packageComponentsDir, outputComponentsDir);
        console.log(`✅ Components copied to ${outputComponentsDir}!`);

        if (!existsSync(outputComposablesDir)) {
          mkdirSync(outputComposablesDir, { recursive: true });
          console.log(`Created directory: ${outputComposablesDir}`);
        }
        copyTemplateFiles(packageComposablesDir, outputComposablesDir);
        console.log(`✅ Composables copied to ${outputComposablesDir}!`);

        if (!existsSync(outputPluginsDir)) {
          mkdirSync(outputPluginsDir, { recursive: true });
          console.log(`Created directory: ${outputPluginsDir}`);
        }
        copyTemplateFiles(packagePluginsDir, outputPluginsDir);
        console.log(`✅ Plugins copied to ${outputPluginsDir}!`);
      }
      
      console.log(`\n🎉 Theme structure created successfully!`);
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