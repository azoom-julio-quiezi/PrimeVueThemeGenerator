# PrimeVue Theme Generator

A comprehensive design system package with two main features: **Custom AZoom Theme** for consistent UI implementation and **Figma token conversion** for seamless design-to-code workflow. This package provides pre-built components with automatic imports and a powerful token converter for design system integration.

## 🚀 Features

- **Custom AZoom Theme**: Provides a complete base theme with component configurations with pre-built design system components (Label, Link, Dialog, ConfirmDialog, Breadcrumb)
- **Figma Token Conversion**: Converts Studio Tokens to PrimeVue-compatible theme tokens

## 📦 Installation

### Install from npm (Recommended)
```bash
pnpm add @azoom/az-ui
```

### Install from GitHub
```bash
pnpm add git+https://github.com/azoom-julio-quiezi/PrimeVueThemeGenerator.git
```

**If you use the Nuxt module (`@azoom/az-ui/nuxt`), the theme file will be created automatically the first time Nuxt starts.**

**If you are not using the Nuxt module, or want to (re)generate the theme file manually, run:**
```bash
pnpm exec az-ui create
```
This will generate the theme file in your project root.

### Dependencies

This package has the following peer dependencies that must be installed in your Nuxt project:

```bash
# Required peer dependencies
pnpm add vue primevue @primevue/nuxt-module @primeuix/themes @azoom/az-icons nuxt@^3.0.0 sass @nuxtjs/google-fonts
```

**Peer Dependencies:**
- `vue` (^3.0.0) - Vue 3 framework
- `primevue` (^4.0.0) - PrimeVue component library
- `@primevue/nuxt-module` (^4.0.0) - PrimeVue Nuxt module
- `@primeuix/themes` (^1.0.0) - PrimeVue theme system
- `@azoom/az-icons` (^0.1.0) - Icon library used by components
- `nuxt` (^3.0.0) - Nuxt 3 framework
- `sass` (^1.87.0) - Sass preprocessor for styling
- `@nuxtjs/google-fonts` (^1.0.0) - Google Fonts integration for Nuxt

**Note:** These are declared as peer dependencies to avoid version conflicts and bundle bloat. Your Nuxt project should install these dependencies directly.

## 🎨 Custom AZoom Theme

### 1. Theme File (Auto-Created)

The main theme file is automatically created when you install the package or when Nuxt starts.

This creates the following structure:
```
assets/
└── themes/          # Theme configuration file
    └── azoom-theme.ts
```

**Note:** The theme file is created automatically. Components, CSS, and other theme files are imported automatically from the package via the Nuxt module.

**Fallback:** You can recreate it with:
```bash
pnpm exec az-ui create
```

**Important:** The `ConfirmDialog` component requires the PrimeVue ConfirmationService to be registered in your `app.vue` file. See the [ConfirmationService Setup](#-confirmationservice-setup) section below.

### 2. Configure Your Nuxt App

```typescript
// nuxt.config.ts
import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  modules: [
    '@primevue/nuxt-module',
    '@azoom/az-ui', // Auto-imports components with 'v' in order to match Primevue components
    '@azoom/az-icons',
    '@nuxtjs/google-fonts'
  ],
  primevue: {
    autoImport: false,
    options: {
      theme: {
        preset: Aura,
      },
    },
    components: {
      prefix: 'v',
      include: [
        // PrimeVue components example
        'Button',
        'InputText',
        'Select',
        'Toast'
      ],
    },
    importTheme: { from: '@/assets/themes/azoom-theme.ts' },
  },
})
```

**Custom Prefix Configuration:**
```typescript
export default defineNuxtConfig({
  modules: ['@azoom/az-ui'],

  azoomTheme: {
    prefix: 'az' // Custom prefix: az-label, az-link, etc.
  }
})
```

## 📦 Import Reference

### Auto-Import Usage (Recommended)

With the Nuxt module, components are automatically imported with the configured prefix (default: 'v'):

```vue
<template>
  <!-- Components are auto-imported with 'v' prefix by default -->
  <v-label label="Email" required />
  <v-link href="/about">About</v-link>
  <v-dialog v-model:visible="showDialog">Content</v-dialog>
  <v-confirm-dialog />
  <v-breadcrumb :model="breadcrumbItems" />
</template>
```

**With Custom Prefix:**
```vue
<template>
  <!-- If prefix is set to 'az', components are: -->
  <az-label label="Email" required />
  <az-link href="/about">About</az-link>
  <az-dialog v-model:visible="showDialog">Content</az-dialog>
  <az-confirm-dialog />
  <az-breadcrumb :model="breadcrumbItems" />
</template>
```

### Manual Import Usage

If you prefer manual imports (components are registered with the configured prefix):

```typescript
import {
  Breadcrumb,
  ConfirmDialog,
  Dialog,
  Label,
  Link
} from '@azoom/az-ui';
```

## 🔧 ConfirmationService Setup

**Register the ConfirmationService in your app.vue:**

```vue
<!-- app.vue -->
<template>
  <div>
    <!-- Your app content -->
  </div>
</template>

<script setup>
import ConfirmationService from 'primevue/confirmationservice'

const nuxtApp = useNuxtApp()
nuxtApp.vueApp.use(ConfirmationService)
</script>
```
** 🎨  Custom Tokens:**
- `button` - Button component styling and variants

```typescript
import { button } from '@azoom/az-ui'

const Default = definePreset(Aura, {
  components: {
    button,
  },
})
```

## 🎨 Custom Components

Our design system includes several custom components that enhance PrimeVue with additional functionality and consistent styling:

### Component Overview

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Label** | Form label with required indicators | Multiple variants, sizes, accessibility |
| **Link** | Smart link component | Auto-detects internal/external, multiple variants |
| **Dialog** | Enhanced dialog with custom close | Japanese close button |
| **ConfirmDialog** | Custom confirm dialog | Japanese close button, icon support |
| **Breadcrumb** | Navigation breadcrumb | Custom home icon |

### Quick Examples

```vue
<template>
  <!-- Label with required indicator -->
  <v-label label="Email" html-for="email" required variant="text" />
  <input id="email" type="email" />

  <!-- Link with smart element detection -->
  <v-link label="About Us" href="/about" variant="primary" />
  <v-link label="External" href="https://example.com" :external="true" />

  <!-- Dialog with custom close button -->
  <v-dialog v-model:visible="dialogVisible" header="Dialog Title">
    <p>Content here</p>
  </v-dialog>

  <!-- ConfirmDialog with custom styling -->
  <v-confirm-dialog group="custom" />
</template>

<script setup>
const dialogVisible = ref(false)
</script>
```

### Component Details

#### Label Component
Form label with built-in required field indicators and accessibility features.

**Key Props:**
- `label` (required): Label text
- `htmlFor`: Form control ID
- `required`: Show required indicator
- `variant`: 'text' | 'star' (default: 'star')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Features:**
- Japanese "必須" text or star (*) indicators
- Multiple size variants
- Full accessibility support
- Custom color overrides

#### Link Component
Smart link component that automatically chooses between `nuxt-link` and `<a>` tag.

**Key Props:**
- `label`: Link text
- `href`: Link destination
- `external`: Open in new tab
- `variant`: 'primary' | 'secondary' | 'text' | 'traditional' | 'white'
- `size`: 'xsm' | 'sm' | 'lg' | 'xlg'

**Smart Features:**
- Auto-detects internal vs external links
- Supports file downloads and analytics
- Built-in external link icon
- Prefetching controls for performance

#### Dialog Component
Enhanced dialog with custom Japanese close button and full PrimeVue integration.

**Key Props:**
- `visible`: Control dialog visibility (v-model support)
- All PrimeVue Dialog props supported

**Features:**
- Custom "閉じる" close button with icon
- Full slot passthrough
- Enhanced hover effects

#### ConfirmDialog Component
Custom confirm dialog with Japanese close button, icon support, and enhanced styling.

**Required Service for ConfirmDialog Component**
     - PrimeVue ConfirmationService must be registered (see plugin registration above)
     - [PrimeVue ConfirmationService](https://primevue.org/confirmdialog/#confirmation-service)

**Basic Setup:**
```vue
<template>
  <!-- Add the component to your app layout -->
  <v-confirm-dialog />
</template>

<script setup>
// Component is auto-imported!
</script>
```

**Usage with Composable:**

Note: ConfirmDialog functionality is handled directly by PrimeVue's ConfirmationService.
Users can use PrimeVue's useConfirm composable directly:

```vue
<template>
  <button @click="showBasicConfirm">Save item</button>
</template>

<script setup>
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const showBasicConfirm = () => {
  confirm.require({
    header: 'Basic Confirmation',
    message: 'Are you sure you want to proceed?',
    icon: 'help',
    iconProps: {
      type: 'outline',
      size: 20,
      color: 'red'
    },
    accept: () => {
      console.log('Item saved')
    },
    reject: () => {
      console.log('Item rejected')
    }
  })
}
</script>
```

**Key Features:**
- Japanese "閉じる" close button with icon
- Custom AzIcon support with configurable properties
- Customizable button labels and styling
- Optional group support for multiple confirm dialogs
- Advanced slot-based customization

**Note:** This component works with PrimeVue's ConfirmationService. Users should use PrimeVue's `useConfirm` composable directly for dialog functionality.

**Dependencies:**
- PrimeVue ConfirmDialog component
- PrimeVue ConfirmationService
- AzIcon component
- Nuxt 3 framework

**Service Setup:**
The ConfirmationService must be registered in your `app.vue` file. See the [ConfirmationService Setup](#-confirmationservice-setup) section above.

#### Breadcrumb Component
Custom breadcrumb component with home icon and consistent styling.

**Basic Setup:**
```vue
<template>
  <v-breadcrumb :model="breadcrumbItems" />
</template>

<script setup>
const breadcrumbItems = [
  { label: 'Products', url: '/products' },
  { label: 'Electronics', url: '/products/electronics' },
  { label: 'Smartphones' }
]
</script>
```

**Advanced Usage with Custom Home:**
```vue
<template>
  <v-breadcrumb
    :home="customHome"
    :model="breadcrumbItems" />
</template>

<script setup>
const customHome = {
  label: 'Dashboard',
  url: '/dashboard'
}

const breadcrumbItems = [
  { label: 'Settings', url: '/settings' },
  { label: 'Profile', url: '/settings/profile' },
  { label: 'Edit Profile' }
];
</script>
```

**Custom Separator:**
```vue
<template>
  <v-breadcrumb :model="breadcrumbItems">
    <template #separator>
      <AzIcon name="location" size="12" />
    </template>
  </v-breadcrumb>
</template>

<script setup>
import AzIcon from '@azoom/az-icons'

const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Current Page' }
]
</script>
```

**Key Features:**
- Custom home icon with consistent styling
- Customizable home item
- Custom separator support
- Full PrimeVue Breadcrumb integration
- TypeScript support

**Props:**
- `home`: Custom home item (optional, defaults to `{ label: 'Home', url: '/' }`)
- `model`: Array of breadcrumb items
- All PrimeVue Breadcrumb props supported

**BreadcrumbItem Interface:**
```typescript
interface BreadcrumbItem {
  label: string
  url?: string
  route?: any
  target?: string
  icon?: string
  [key: string]: any
}
```
**Note:** This component modifies the default left alignment to right alignment for improved number input UX.

## 🎨 Figma Token Conversion

Convert your Figma Design Tokens to PrimeVue theme tokens:

```bash
# Convert tokens using default paths
pnpm exec az-ui convert-tokens -i ./tokens/tokens.json

# Specify custom output path
pnpm exec az-ui convert-tokens -i ./tokens/tokens.json -o ./themes/custom-tokens.ts

# Force overwrite existing file
pnpm exec az-ui convert-tokens -i ./tokens/tokens.json -f
```

**Default Output:** By default, the generated file will be saved as `theme-tokens.ts` in the `./themes/` directory. The `themes/` directory will be created automatically if it doesn't exist.

### Set Up Your Theme

After generating tokens, you need to import the generated file and use it inside `definePreset`. Create your main theme file:

```typescript
// src/themes/main-theme.ts
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { tokens } from './theme-tokens' // ← Import the generated tokens file
import button from './button/button'

const Default = definePreset(Aura, {
  ...tokens, // ← Spread the imported tokens here
  components: {
    button,
    // Add more custom components here
  },
})

export default {
  preset: Default,
  options: {
    // Add other options here if necessary
  },
}
```

**Important:** The generated `theme-tokens.ts` file contains your converted Figma tokens. You must import it and spread it (`...tokens`) inside the `definePreset` function to apply your design tokens to the PrimeVue theme.

<details>
<summary><strong>🔧 Development</strong></summary>

### Project Structure
```
.
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── cli.ts             # Command-line interface
│   ├── module.ts          # Nuxt module configuration
│   ├── types.ts           # TypeScript type definitions
│   ├── transformations.ts # Token transformation rules
│   ├── processors.ts      # Token processing logic
│   ├── theme.ts           # Theme generation logic
│   ├── validation.ts      # Token validation
│   ├── __tests__/        # Test files
│   │   ├── processors.test.ts
│   │   ├── theme.test.ts
│   │   └── validation.test.ts
│   └── runtime/          # Runtime components and assets
│       ├── index.ts      # Runtime entry point
│       ├── types.ts      # Runtime type definitions
│       ├── components.d.ts # Component declarations
│       ├── components/   # Vue components
│       │   ├── v-breadcrumb.vue
│       │   ├── v-confirm-dialog.vue
│       │   ├── v-dialog.vue
│       │   ├── v-home-icon.vue
│       │   ├── v-label.vue
│       │   └── v-link.vue
│       └── assets/       # Theme assets
│           ├── styles/   # CSS styles
│           │   ├── main.css
│           │   └── reset.css
│           └── themes/   # Theme configurations
│               ├── azoom-theme.ts
│               ├── button.ts
│               └── index.ts
├── tokens/               # Example token files
│   ├── tokens.json
│   └── tokens-customized.json
├── test/                 # Generated test files
├── dist/                 # Built distribution files
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test configuration
└── eslint.config.js      # ESLint configuration
```

```bash
# Clone repository
git clone https://github.com/azoom-julio-quiezi/PrimeVueThemeGenerator.git

# Install dependencies
pnpm install
```

### Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `create-theme-test` | Create theme file in `./test/` directory | `pnpm run create-theme-test` |
| `create-theme` | Create theme file in current directory | `pnpm run create-theme` |
| `convert-tokens` | Convert Figma tokens to PrimeVue theme | `pnpm run convert-tokens` |
| `test` | Run all tests | `pnpm test` |
| `test:watch` | Run tests in watch mode | `pnpm run test:watch` |
| `build` | Build for production | `pnpm run build` |

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run specific test file
pnpm test -- processors.test.ts
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
</details>
