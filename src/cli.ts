#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import { generateTheme } from './theme'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface BaseOptions {
  output: string
}

interface ConvertOptions extends BaseOptions {
  input: string
  force?: boolean
}

const program = new Command()

program
  .command('create')
  .description('Create a new PrimeVue theme structure')
  .option('-o, --output <path>', 'Output directory', './')
  .action((options: BaseOptions) => {
    try {
      const outputAssetsDir = `${options.output}/assets`

      const packageAssetsDir = join(__dirname, '../src/runtime/assets')

      if (!existsSync(packageAssetsDir)) {
        console.error('Error: Package assets directory not found. Please ensure the package is properly installed.')
        process.exit(1)
      }

      if (!existsSync(outputAssetsDir)) {
        mkdirSync(outputAssetsDir, { recursive: true })
        console.warn(`Created directory: ${outputAssetsDir}`)
      }

      // Copy only the main theme file
      const themeFile = join(packageAssetsDir, 'themes', 'azoom-theme.ts')
      const outputThemeFile = join(outputAssetsDir, 'themes', 'azoom-theme.ts')

      if (!existsSync(join(outputAssetsDir, 'themes'))) {
        mkdirSync(join(outputAssetsDir, 'themes'), { recursive: true })
      }

      copyFileSync(themeFile, outputThemeFile)
      console.warn(`✅ Theme file created: ${outputThemeFile}`)

      console.warn(`\n📦 Components are auto-imported by the Nuxt module:`)
      console.warn(`   Add '@azoom/az-ui/nuxt' to your modules array`)
      console.warn(`   Components: v-label, v-link, v-dialog, v-confirm-dialog, v-breadcrumb`)
      console.warn(`   CSS and other theme files are imported automatically`)

      console.warn(`\n🎉 Theme structure created successfully!`)
    } catch (error) {
      console.error('Error creating theme structure:', error)
      process.exit(1)
    }
  })

program
  .command('convert-tokens')
  .description('Convert Studio Tokens to PrimeVue theme')
  .requiredOption('-i, --input <path>', 'Path to tokens.json')
  .option('-o, --output <path>', 'Output path', './themes/theme-tokens.ts')
  .option('-f, --force', 'Force overwrite if output file exists')
  .action((options: ConvertOptions) => {
    try {
      const inputPath = resolve(options.input)
      const outputPath = resolve(options.output)

      if (existsSync(outputPath) && !options.force) {
        console.error(`Error: Output file ${outputPath} already exists. Use --force to overwrite.`)
        process.exit(1)
      }

      generateTheme(inputPath, outputPath)
    } catch (error) {
      console.error('Error converting tokens:', error)
      process.exit(1)
    }
  })

program.parse()

function _copyTemplateFiles(src: string, dest: string): void {
  if (!existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`)
  }

  const files = readdirSync(src)
  files.forEach((file) => {
    const srcPath = join(src, file)
    const destPath = join(dest, file)

    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true })
        console.warn(`Created directory: ${destPath}`)
      }
      _copyTemplateFiles(srcPath, destPath)
    } else {
      if (!existsSync(destPath)) {
        copyFileSync(srcPath, destPath)
        console.warn(`Created file: ${destPath}`)
      }
    }
  })
}
