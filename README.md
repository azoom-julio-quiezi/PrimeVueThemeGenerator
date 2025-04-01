# PrimeVue Theme Generator

A tool to generate PrimeVue theme files from design tokens. This generator processes token files and creates theme configurations compatible with PrimeVue components.

## Features

- Processes design tokens from JSON files
- Generates theme files for PrimeVue components
- Supports light and dark color schemes
- Handles complex token transformations
- Type-safe implementation with TypeScript

## Usage

1. Install dependencies:
```bash
npm install
```

2. Generate theme:
```bash
npm run theme
```

This will process the tokens from `tokens/tokens.json` and generate the theme file in `PrimeVueTest/assets/themes/default.ts`.

## Project Structure

- `index.ts` - Main entry point
- `types.ts` - TypeScript type definitions
- `transformations.ts` - Token transformation rules
- `processors.ts` - Token processing logic
- `theme.ts` - Theme generation logic
- `validation.ts` - Token validation
- `tokens/` - Design token files

## Development

The project is built with TypeScript and uses:
- `ts-node` for running TypeScript files directly
- TypeScript for type safety
- Node.js for file system operations
