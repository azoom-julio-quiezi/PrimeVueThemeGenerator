# PrimeVue Theme Generator

A tool that provides a default PrimeVue theme (Azoom theme) and converts Studio Tokens into theme tokens. This generator focuses only on primitive and semantic tokens - component-specific tokens are handled separately in your theme configuration.

## Features

- Provides a base AZoom theme with component configurations
- Converts Studio Tokens to primitive tokens (colors, spacing, etc.)
- Converts Studio Tokens to semantic tokens with color schemes
- Supports light and dark themes
- Type-safe implementation with TypeScript
- Comprehensive test coverage

## Installation

```bash
# Install globally from repository
npm install -g git+https://github.com/your-org/primevue-theme-generator.git
```

## Usage

### Create Theme Structure
```bash
# Create base theme structure
primevue-theme create

# Or specify output directory
primevue-theme create -o ./custom/path
```

This creates:
```
themes/
├── themes/       # Theme files
│   ├── aura/    # Base Aura preset
│   └── default.ts
└── styles/      # Component styles
```

### Convert Tokens
```bash
# Convert tokens using default paths
primevue-theme convert-tokens -i ./tokens/tokens.json

# Specify output path
primevue-theme convert-tokens -i ./tokens/tokens.json -o ./themes/custom-tokens.ts

# Force overwrite existing file
primevue-theme convert-tokens -i ./tokens/tokens.json -f
```

### Using Generated Tokens
After generating tokens, import them in your theme file:

```typescript
// your-theme.ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { tokens } from './theme-tokens';
import button from './button/button';
import menubar from './menubar/menubar';

const Default = definePreset(Aura, {
  ...tokens,
  components: {
    button,
    menubar,
  },
});

export default {
  preset: Default,
  options: {
    darkModeSelector: '.p-dark',
    // Add other options here
  },
};
```

## Development

The project is built with TypeScript and uses:
- `ts-node` for running TypeScript files directly
- TypeScript for type safety
- Node.js for file system operations
- Jest for testing

### Project Structure
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
├── assets/               # Base theme files
│   └── themes/          # Theme templates
├── package.json         # Project configuration
└── tsconfig.json       # TypeScript configuration
```

### Local Development
```bash
# Clone repository
git clone https://github.com/your-org/primevue-theme-generator.git

# Install dependencies
npm install

# Create test theme structure
npm run create

# Convert tokens (outputs to test directory)
npm run convert-tokens
```

### Testing

```bash
# Run tests
npm test

# Watch mode for development
npm run test:watch
```