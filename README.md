# PrimeVue Theme Generator

A tool to generate PrimeVue theme files from design tokens. This generator processes token files and creates theme configurations compatible with PrimeVue components.

## Features

- Processes design tokens from JSON files
- Generates theme files for PrimeVue components
- Supports light and dark color schemes
- Handles complex token transformations
- Type-safe implementation with TypeScript
- Comprehensive test coverage

## Project Structure

```
.
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── types.ts           # TypeScript type definitions
│   ├── transformations.ts # Token transformation rules
│   ├── processors.ts      # Token processing logic
│   ├── theme.ts           # Theme generation logic
│   ├── validation.ts      # Token validation
│   └── __tests__/        # Test files
│       ├── processors.test.ts  # Token processor tests
│       ├── theme.test.ts      # Theme generation tests
│       └── validation.test.ts # Token validation tests
├── tokens/                # Design token files
│   └── tokens.json       # Main tokens file
├── assets/               # Generated theme files
│   └── themes/          # Theme output directory
├── package.json         # Project configuration
└── tsconfig.json       # TypeScript configuration
```

## Usage

1. Install dependencies:
```bash
npm install
```

2. Generate theme:
```bash
npm run theme
```

This will process the tokens from `tokens/tokens.json` and generate the theme file in `assets/themes/default.ts`.

## Development

The project is built with TypeScript and uses:
- `ts-node` for running TypeScript files directly
- TypeScript for type safety
- Node.js for file system operations
- Jest for testing

### Testing

Run tests:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

The test suite covers:
- Token processing (color, spacing, shadow values)
- Theme generation (primitive, semantic, color schemes)
- Token validation
