# PrimeVue Theme Generator

A tool that converts Figma Design Tokens to PrimeVue themes and provides custom design system components. This generator focuses on primitive and semantic tokens while offering pre-built custom components for consistent design implementation.

## 🚀 Features

- **Figma Token Conversion**: Converts Studio Tokens to PrimeVue-compatible theme tokens
- **Base AZoom Theme**: Provides a complete base theme with component configurations
- **Custom Components**: Pre-built design system components (Button, Link, and more coming soon)
- **Light & Dark Themes**: Full support for both theme modes
- **Type Safety**: Built with TypeScript for better development experience
- **Comprehensive Testing**: Extensive test coverage for reliable token conversion

## 📦 Installation

```bash
npm install git+https://github.com/azoom-julio-quiezi/PrimeVueThemeGenerator.git
```

## 🛠️ Usage

### 1. Create Theme Structure

Start by creating the base theme structure in your project:

```bash
# Create base theme structure in current directory
npx primevue-theme create

# Or specify a custom output directory
npx primevue-theme create -o ./src/themes
```

This creates the following structure:
```
assets/
├── themes/          # Theme configuration files
│   ├── azoom-theme.ts
│   └── button/
│       └── button.ts
└── styles/          # Global styles
    ├── main.css
    └── reset.css
components/          # Custom design system components
└── az/
    └── link/
        └── AzLink.vue
```

### 2. Convert Figma Tokens

Convert your Figma Design Tokens to PrimeVue theme tokens:

```bash
# Convert tokens using default paths
npx primevue-theme convert-tokens -i ./tokens/tokens.json

# Specify custom output path
npx primevue-theme convert-tokens -i ./tokens/tokens.json -o ./themes/custom-tokens.ts

# Force overwrite existing file
npx primevue-theme convert-tokens -i ./tokens/tokens.json -f
```

**Default Output:** By default, the generated file will be saved as `theme-tokens.ts` in the `./themes/` directory. The `themes/` directory will be created automatically if it doesn't exist.

### 3. Set Up Your Theme

After generating tokens, you need to import the generated file and use it inside `definePreset`. Create your main theme file:

```typescript
// src/themes/main-theme.ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { tokens } from './theme-tokens'; // ← Import the generated tokens file
import button from './button/button';

const Default = definePreset(Aura, {
  ...tokens, // ← Spread the imported tokens here
  components: {
    button,
    // Add more custom components here
  },
});

export default {
  preset: Default,
  options: {
    // Add other options here if necessary
  },
};
```

**Important:** The generated `theme-tokens.ts` file contains your converted Figma tokens. You must import it and spread it (`...tokens`) inside the `definePreset` function to apply your design tokens to the PrimeVue theme.

### 4. Import PrimeVue in Your App

```typescript
// main.ts
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import theme from './themes/main-theme';

const app = createApp(App);

app.use(PrimeVue, {
  theme: theme,
});

app.mount('#app');
```

## 🎨 Custom Components

### Available Components

#### AzLink Component
A custom link component with enhanced styling and accessibility features:

```vue
<template>
  <AzLink href="/about" variant="primary" size="medium">
    About Us
  </AzLink>
</template>

<script setup>
import AzLink from '@/components/az/link/AzLink.vue';
</script>
```

**Props:**
- `href`: Link destination
- `variant`: 'primary' | 'secondary' | 'tertiary'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: Boolean for disabled state

## 🔧 Development

### Project Structure
```
.
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── cli.ts             # Command-line interface
│   ├── types.ts           # TypeScript type definitions
│   ├── transformations.ts # Token transformation rules
│   ├── processors.ts      # Token processing logic
│   ├── theme.ts           # Theme generation logic
│   ├── validation.ts      # Token validation
│   └── __tests__/        # Test files
├── assets/               # Base theme files
│   ├── styles/          # General styles
│   └── themes/          # Theme templates
├── components/          # Custom design system components
│   └── az/             # AZoom design system components
├── tokens/             # Example token files
├── package.json        # Project configuration
└── tsconfig.json      # TypeScript configuration
```

### Local Development

```bash
# Clone repository
git clone https://github.com/azoom-julio-quiezi/PrimeVueThemeGenerator.git

# Install dependencies
npm install

# Create test theme structure
npm run create

# Convert tokens (outputs to test directory)
npm run convert-tokens

# Run tests
npm test

# Watch mode for development
npm run test:watch

# Build for production
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- processors.test.ts
```

## 📋 Token Structure

The generator expects Figma Design Tokens in the following structure. Here's a real example from our tokens file:

```json
{
  "aura/primitive": {
    "border": {
      "radius": {
        "none": {
          "$value": "0",
          "$type": "borderRadius"
        },
        "xs": {
          "$value": "2px",
          "$type": "borderRadius"
        },
        "sm": {
          "$value": "4px",
          "$type": "borderRadius"
        },
        "md": {
          "$value": "6px",
          "$type": "borderRadius"
        },
        "lg": {
          "$value": "8px",
          "$type": "borderRadius"
        }
      }
    },
    "emerald": {
      "50": {
        "$value": "#ecfdf5",
        "$type": "color"
      },
      "500": {
        "$value": "#10b981",
        "$type": "color"
      },
      "900": {
        "$value": "#064e3b",
        "$type": "color"
      }
    },
    "form": {
      "field": {
        "padding": {
          "x": {
            "$value": "0.75rem",
            "$type": "spacing"
          },
          "y": {
            "$value": "0.5rem",
            "$type": "spacing"
          }
        },
        "font": {
          "size": {
            "$value": "0.875rem",
            "$type": "fontSizes"
          }
        }
      }
    }
  },
  "aura/semantic": {
    "primary": {
      "50": {
        "$value": "{emerald.50}",
        "$type": "color"
      },
      "500": {
        "$value": "{emerald.500}",
        "$type": "color"
      },
      "900": {
        "$value": "{emerald.900}",
        "$type": "color"
      }
    },
    "form": {
      "field": {
        "border": {
          "radius": {
            "$value": "{border.radius.md}",
            "$type": "borderRadius"
          }
        },
        "focus": {
          "ring": {
            "color": {
              "$value": "{primary.color}",
              "$type": "color"
            }
          }
        }
      }
    }
  }
}
```

### Key Token Types Supported:

- **Colors**: `$type: "color"` - Hex values, RGB, HSL
- **Spacing**: `$type: "spacing"` - Pixels, rem, em units
- **Typography**: `$type: "fontSizes"`, `$type: "fontWeights"`, `$type: "lineHeights"`
- **Borders**: `$type: "borderRadius"`, `$type: "borderWidth"`
- **Shadows**: `$type: "boxShadow"` - Drop shadows and box shadows
- **Sizing**: `$type: "sizing"` - Width, height values
- **Opacity**: `$type: "opacity"` - Transparency values

### Token References:
The generator supports token references using `{token.path}` syntax, allowing you to reference other tokens within your design system.
