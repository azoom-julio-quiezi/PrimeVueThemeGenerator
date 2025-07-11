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
pnpm add git+https://github.com/azoom-julio-quiezi/PrimeVueThemeGenerator.git
```

### Dependencies

This package has the following peer dependencies that must be installed in your Nuxt project:

```bash
# Required peer dependencies
pnpm add vue primevue @azoom/az-icons nuxt@^3.0.0
```

**Peer Dependencies:**
- `vue` (^3.0.0) - Vue 3 framework
- `primevue` (^3.0.0) - PrimeVue component library
- `@azoom/az-icons` (^1.0.0) - Icon library used by components
- `nuxt` (^3.0.0) - Nuxt 3 framework

**Note:** These are declared as peer dependencies to avoid version conflicts and bundle bloat. Your Nuxt project should install these dependencies directly.

## 🛠️ Usage

### 1. Create Theme Structure

Start by creating the base theme structure in your project:

```bash
# Create base theme structure in current directory
pnpm exec primevue-theme create

# Or specify a custom output directory
pnpm exec primevue-theme create -o ./src/themes
```

This creates the following structure:
```
assets/
├── themes/          # Theme configuration files
│   ├── azoom-theme.ts
│   ├── button/
│   │   └── button.ts
│   └── inputnumber/
│       └── inputnumber.ts
└── styles/          # Global styles
    ├── main.css
    └── reset.css
components/          # Custom design system components
└── az/
    ├── label/
    │   └── az-label.vue
    ├── link/
    │   └── az-link.vue
    ├── dialog/
    │   └── az-dialog.vue
    ├── confirmDialog/
    │   └── az-confirm-dialog.vue
    └── breadcrumb/
        └── az-breadcrumb.vue
composables/         # Vue composables
└── use-az-confirm-dialog.ts
plugins/            # Nuxt plugins
└── confirmation.client.ts
```

### CLI Options

The `create` command supports additional options:

```bash
# Create with default settings (copies everything)
pnpm exec primevue-theme create

# Skip components, composables, and plugins (import from package instead)
pnpm exec primevue-theme create --skip-components

# Specify custom output directory
pnpm exec primevue-theme create -o ./src/themes --skip-components
```

**Note:** When using `--skip-components`, you'll need to import components, composables, and plugins from the package. See the [Import Reference](#import-reference) section below for complete examples.

### 2. Convert Figma Tokens

Convert your Figma Design Tokens to PrimeVue theme tokens:

```bash
# Convert tokens using default paths
pnpm exec primevue-theme convert-tokens -i ./tokens/tokens.json

# Specify custom output path
pnpm exec primevue-theme convert-tokens -i ./tokens/tokens.json -o ./themes/custom-tokens.ts

# Force overwrite existing file
pnpm exec primevue-theme convert-tokens -i ./tokens/tokens.json -f
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

### 4. Import PrimeVue in Your Nuxt App

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'primevue/nuxt'
  ],
  primevue: {
    theme: 'aura',
    components: {}
  }
})
```

## 📦 Import Reference

### Default Usage (Components Copied)

When using the default CLI behavior (components copied to your project):

```typescript
// Components
import AzLabel from './components/az/label/az-label.vue';
import AzLink from './components/az/link/az-link.vue';
import AzDialog from './components/az/dialog/az-dialog.vue';
import AzConfirmDialog from './components/az/confirmDialog/az-confirm-dialog.vue';
import AzBreadcrumb from './components/az/breadcrumb/az-breadcrumb.vue';

// Composables
import { useAzConfirmDialog } from './composables/use-az-confirm-dialog';

// Plugins (auto-registered in Nuxt)
// No manual import needed - plugins are automatically copied
```

### Package Import Usage (--skip-components flag)

When using the `--skip-components` flag:

```typescript
// Components
import { 
  AzLabel, 
  AzLink, 
  AzDialog, 
  AzConfirmDialog, 
  AzBreadcrumb 
} from '@azoom/primevue-theme-generator/components';

// Composables
import { useAzConfirmDialog } from '@azoom/primevue-theme-generator/composables';

// Plugins (manual registration required)
import { confirmationPlugin } from '@azoom/primevue-theme-generator/plugins';
```

**Plugin Registration for Package Import:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'primevue/nuxt'
  ],
  plugins: [
    // Only needed when using --skip-components
    '~/plugins/confirmation.client.ts'
  ]
})
```

## 🎨 Custom Components

Our design system includes several custom components that enhance PrimeVue with additional functionality and consistent styling:

### Component Overview

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **AzLabel** | Form label with required indicators | Multiple variants, sizes, accessibility |
| **AzLink** | Smart link component | Auto-detects internal/external, multiple variants |
| **AzDialog** | Enhanced dialog with custom close | Japanese close button, dark mode support |
| **AzConfirmDialog** | Custom confirm dialog | Japanese close button, icon support, dark mode |
| **AzBreadcrumb** | Navigation breadcrumb | AzIcon home, custom separators, dark mode |
| **InputNumber** | Customized number input | Right-aligned text for better readability |

### Quick Examples

```vue
<template>
  <!-- AzLabel with required indicator -->
  <az-label label="Email" html-for="email" required variant="text" />
  <input id="email" type="email" />

  <!-- AzLink with smart element detection -->
  <az-link label="About Us" href="/about" variant="primary" />
  <az-link label="External" href="https://example.com" :external="true" />

  <!-- AzDialog with custom close button -->
  <az-dialog v-model:visible="dialogVisible" header="Dialog Title">
    <p>Content here</p>
  </az-dialog>

  <!-- AzConfirmDialog with custom styling -->
  <az-confirm-dialog group="custom" />
</template>

<script setup>
// See Import Reference section above for import examples
import AzLabel from './components/az/label/az-label.vue';
import AzLink from './components/az/link/az-link.vue';
import AzDialog from './components/az/dialog/az-dialog.vue';
import AzConfirmDialog from './components/az/confirmDialog/az-confirm-dialog.vue';
</script>
```

### Component Details

#### AzLabel Component
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

#### AzLink Component
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

#### AzDialog Component
Enhanced dialog with custom Japanese close button and full PrimeVue integration.

**Key Props:**
- `visible`: Control dialog visibility (v-model support)
- All PrimeVue Dialog props supported

**Features:**
- Custom "閉じる" close button with icon
- Dark mode support
- Full slot passthrough
- Enhanced hover effects

#### AzConfirmDialog Component
Custom confirm dialog with Japanese close button, icon support, and enhanced styling.

**Required Plugin for ConfirmDialog Component**
     - `plugins/confirmation.client.ts`
     - [PrimeVue ConfirmationService](https://primevue.org/confirmdialog/#confirmation-service)

**Basic Setup:**
```vue
<template>
  <!-- Add the component to your app layout -->
  <az-confirm-dialog />
</template>

<script setup>
// See Import Reference section above for import examples
import AzConfirmDialog from './components/az/confirmDialog/az-confirm-dialog.vue';
</script>
```

**Usage with Composable:**
```vue
<template>
  <button @click="showDeleteConfirm">Delete Item</button>
</template>

<script setup>
// See Import Reference section above for import examples
import { useAzConfirmDialog } from './composables/use-az-confirm-dialog';

const { showConfirm } = useAzConfirmDialog();

const showDeleteConfirm = () => {
  showConfirm({
    message: 'Are you sure you want to delete this item?',
    header: 'Confirm Deletion',
    icon: 'warning',
    iconProps: {
      type: 'filled',
      size: 20,
      color: '#ef4444'
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    accept: () => {
      // Handle deletion
      console.log('Item deleted');
    },
    reject: () => {
      // Handle cancellation
      console.log('Deletion cancelled');
    }
  });
};
</script>
```

**Key Features:**
- Japanese "閉じる" close button with icon
- Custom icon support with configurable properties
- Dark mode support
- Customizable button labels and styling
- Optional group support for multiple confirm dialogs
- Advanced slot-based customization
- TypeScript support

**Complete API:**
```typescript
interface ConfirmDialogOptions {
  message: string
  header?: string
  group?: string
  icon?: string // AzIcon name (e.g., 'warning', 'info')
  iconProps?: {
    type?: 'outline' | 'filled' | 'duotone'
    size?: number
    bounded?: 'tight' | 'loose'
    color?: string
    [key: string]: any
  }
  accept?: () => void
  reject?: () => void
  acceptLabel?: string
  rejectLabel?: string
  acceptProps?: {
    label?: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
    outlined?: boolean
  }
  rejectProps?: {
    label?: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'
    outlined?: boolean
  }
}
```

**Dependencies:**
- PrimeVue ConfirmDialog component
- PrimeVue ConfirmationService
- AzIcon component
- Nuxt 3 framework

**Plugin Setup:**
The confirmation plugin is automatically copied to your project. For Nuxt 3, it will be auto-registered if placed in the `plugins/` directory. See the [Import Reference](#import-reference) section above for plugin registration when using `--skip-components`.

#### AzBreadcrumb Component
Custom breadcrumb component with AzIcon home icon and consistent styling.

**Basic Setup:**
```vue
<template>
  <az-breadcrumb :model="breadcrumbItems" />
</template>

<script setup>
// See Import Reference section above for import examples
import AzBreadcrumb from './components/az/breadcrumb/az-breadcrumb.vue';

const breadcrumbItems = [
  { label: 'Products', url: '/products' },
  { label: 'Electronics', url: '/products/electronics' },
  { label: 'Smartphones' }
];
</script>
```

**Advanced Usage with Custom Home:**
```vue
<template>
  <az-breadcrumb 
    :home="customHome"
    :model="breadcrumbItems" />
</template>

<script setup>
// See Import Reference section above for import examples
import AzBreadcrumb from './components/az/breadcrumb/az-breadcrumb.vue';

const customHome = {
  label: 'Dashboard',
  url: '/dashboard'
};

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
  <az-breadcrumb :model="breadcrumbItems">
    <template #separator>
      <AzIcon name="chevron-right" size="12" />
    </template>
  </az-breadcrumb>
</template>

<script setup>
// See Import Reference section above for import examples
import AzBreadcrumb from './components/az/breadcrumb/az-breadcrumb.vue';
import AzIcon from '@azoom/az-icons';

const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Products', url: '/products' },
  { label: 'Current Page' }
];
</script>
```

**Key Features:**
- AzIcon home icon with consistent styling
- Customizable home item
- Custom separator support
- Full PrimeVue Breadcrumb integration
- Dark mode support
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

#### InputNumber Component
Customized PrimeVue InputNumber with right-aligned text for better number readability.

**Note:** This component modifies the default left alignment to right alignment for improved number input UX.

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
pnpm install

# Create test theme structure
pnpm run create

# Convert tokens (outputs to test directory)
pnpm run convert-tokens

# Run tests
pnpm test

# Watch mode for development
pnpm run test:watch

# Build for production
pnpm run build
```

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
