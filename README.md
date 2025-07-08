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
│   └── button/
│       └── button.ts
└── styles/          # Global styles
    ├── main.css
    └── reset.css
components/          # Custom design system components
└── az/
    ├── label/
    │   └── az-label.vue
    └── link/
        └── az-link.vue
```

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

#### azLabel Component
A flexible label component with support for different variants, sizes, and required field indicators:

- **Multiple Variants**: Text-based and star-based required field indicators
- **Size Options**: Small (sm) and large (lg) font sizes
- **Custom Colors**: Support for custom color overrides
- **Accessibility**: Proper `for` attribute linking to form controls
- **Required Indicators**: Built-in support for required field marking
- **Responsive Design**: Clean, modern styling with proper spacing

```vue
<template>
  <!-- Basic label -->
  <az-label 
    label="Email Address"
    html-for="email">
  </az-label>

  <!-- Required field with text indicator -->
  <az-label 
    label="Full Name"
    html-for="name"
    variant="text">
  </az-label>

  <!-- Required field with star indicator -->
  <az-label 
    label="Phone Number"
    html-for="phone"
    variant="star">
  </az-label>

  <!-- Custom styling -->
  <az-label 
    label="Custom Label"
    html-for="custom"
    size="lg"
    color="#3b82f6">
  </az-label>

  <!-- Accessible label with ARIA -->
  <az-label 
    label="Username"
    html-for="username"
    aria-label="Enter your username"
    aria-describedby="username-help"
    aria-required="true">
  </az-label>

  <!-- Label with tooltip -->
  <az-label 
    label="Password"
    html-for="password"
    title="Must be at least 8 characters long"
    variant="star">
  </az-label>
</template>

<script setup>
import AzLabel from '@/components/az/label/az-label.vue';
</script>
```

**Props:**

**Core Properties:**
- `label`: Label text content (required)
- `htmlFor`: ID of the form control to associate with (optional)

**Styling & Variants:**
- `variant`: 'text' | 'star' - Type of required field indicator (optional)
- `color`: Custom color override (optional)
- `size`: 'sm' | 'lg' - Font size variant (optional)

**HTML Attributes:**
- `id`: Unique identifier for the label element (optional)
- `title`: Tooltip text that appears on hover (optional)

**Accessibility (ARIA) Properties:**
- `ariaLabel`: Alternative text for screen readers (optional)
- `ariaDescribedby`: References element that describes the label (optional)
- `ariaRequired`: Indicates if the associated form control is required (optional)

#### AzLink Component
A comprehensive link component that intelligently chooses between internal navigation (`nuxt-link`) and HTML anchor (`<a>` tag) based on the required functionality:

- **Smart Element Selection**: Automatically uses `nuxt-link` for pure internal navigation and `<a>` tag when HTML-specific features are needed
- **Multiple Variants**: Primary, secondary, text, traditional, and white color schemes
- **Size Options**: Extra small (xsm), small (sm), large (lg), and extra large (xlg)
- **Accessibility**: Proper focus states, keyboard navigation, and ARIA attributes
- **Icon Support**: Built-in external link icon with customizable visibility
- **State Management**: Hover, active, and disabled states
- **Traditional Links**: Special handling for visited/unvisited link states
- **Performance**: Prefetching controls for optimal loading
- **Security**: Automatic security attributes for external links
- **File Downloads**: Support for download links with custom filenames (works for both internal and external files)
- **Internationalization**: Language specification for multilingual sites
- **Analytics Integration**: Built-in support for link tracking and referrer control

```vue
<template>
  <!-- Internal navigation - uses nuxt-link -->
  <az-link 
    label="About Us"
    href="/about" 
    variant="primary" 
    size="lg"
    :showDefaultIcon="true">
  </az-link>

  <!-- External link - uses <a> tag -->
  <az-link 
    label="Visit GitHub"
    href="https://github.com" 
    :external="true"
    variant="traditional">
  </az-link>

  <!-- Internal download - uses <a> tag (not external but needs download) -->
  <az-link 
    label="Download PDF"
    href="/files/document.pdf" 
    download="my-document.pdf"
    type="application/pdf">
  </az-link>

  <!-- Internal link with analytics - uses <a> tag -->
  <az-link 
    label="Contact"
    href="/contact" 
    ping="/analytics/track"
    referrerpolicy="no-referrer">
  </az-link>

  <!-- International link - uses <a> tag -->
  <az-link 
    label="Sobre Nosotros"
    href="/es/about" 
    hreflang="es">
  </az-link>

  <!-- Link with tooltip and accessibility -->
  <az-link 
    label="Download Manual"
    href="/files/manual.pdf"
    :download="true"
    title="Download the complete user manual"
    aria-label="Download the complete user manual in PDF format"
    aria-describedby="manual-description">
  </az-link>

  <!-- Accessible external link -->
  <az-link 
    label="Visit Documentation"
    href="https://docs.example.com"
    :external="true"
    aria-label="Visit external documentation (opens in new tab)">
  </az-link>
</template>

<script setup>
import AzLink from '@/components/az/link/az-link.vue';
</script>
```

**Props:**

**Core Properties:**
- `label`: Link text content
- `href`: Link destination
- `external`: Boolean to open link in new page/tab (default: false)

**Styling & Variants:**
- `semanticColor`: 'primary' | 'secondary' | 'text' | 'traditional' | 'white'
- `variant`: 'primary' | 'secondary' | 'text' | 'traditional' | 'white'
- `size`: 'xsm' | 'sm' | 'lg' | 'xlg'
- `disabled`: Boolean for disabled state
- `showDefaultIcon`: Boolean to show/hide the default external link icon

**Element Selection Logic:**
The component automatically chooses between `nuxt-link` and HTML `<a>` tag based on the following conditions:
- Uses `<a>` tag if: any HTML-specific property is provided
- Uses `nuxt-link` if: No HTML-specific properties are needed (pure internal navigation)

**Nuxt-Link Properties (Internal Navigation):**
- `replace`: Boolean to replace current history entry instead of adding new one
- `activeClass`: CSS class applied when link is active
- `exactActiveClass`: CSS class applied when link is exactly active
- `ariaCurrent`: Accessibility attribute for active links ('page', 'step', 'location')
- `prefetch`: Boolean to control prefetching behavior
- `noPrefetch`: Boolean to disable prefetching
- `prefetchOnHover`: Boolean to prefetch only on hover

**HTML Anchor Properties (Triggers <a> tag usage):**
- `download`: String | Boolean for file downloads (true = original filename, string = custom filename)
- `hreflang`: String for language specification (e.g., 'en', 'es', 'fr')
- `ping`: String for analytics tracking URLs
- `referrerpolicy`: String for referrer control ('no-referrer', 'origin', etc.)
- `type`: String for MIME type specification (e.g., 'application/pdf')

**HTML Attributes:**
- `id`: Unique identifier for the link element (optional)
- `title`: Tooltip text that appears on hover (optional)

**Accessibility (ARIA) Properties:**
- `ariaLabel`: Alternative text for screen readers (optional)
- `ariaDescribedby`: References element that describes the link (optional)

**Note:** When any HTML-specific property is provided, the component automatically uses an `<a>` tag instead of `nuxt-link`, even for internal URLs. This enables features like internal file downloads, analytics tracking, and language specification for internal pages.

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
