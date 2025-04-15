import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import button from './button/button'

const Default = definePreset(Aura, {
  primitive: {
    az: {
      brand: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a1a1aa',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a'
      },
      brandAccent: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a1a1aa',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a'
      },
      unvisited: {
        50: '{blue.50}',
        100: '{blue.100}',
        200: '{blue.200}',
        300: '{blue.300}',
        400: '{blue.400}',
        500: '{blue.500}',
        600: '{blue.600}',
        700: '{blue.700}',
        800: '{blue.800}',
        900: '{blue.900}',
        950: '{blue.950}' 
      },
      visited: {
        50: '{fuchsia.50}',
        100: '{fuchsia.100}',
        200: '{fuchsia.200}',
        300: '{fuchsia.300}',
        400: '{fuchsia.400}',
        500: '{fuchsia.500}',
        600: '{fuchsia.600}',
        700: '{fuchsia.700}',
        800: '{fuchsia.800}',
        900: '{fuchsia.900}',
        950: '{fuchsia.950}' 
      },
    }
  },
  semantic: {
    primary: {
      50: '{brandq.50}',
      100: '{brand.100}',
      200: '{brand.200}',
      300: '{brand.300}',
      400: '{brand.400}',
      500: '{brand.500}',
      600: '{brand.600}',
      700: '{brand.700}',
      800: '{brand.800}',
      900: '{brand.900}',
      950: '{brand.950}'
    },
    az: {
      secondary: {
        50: '{brandAccent.50}',
        100: '{brandAccent.100}',
        200: '{brandAccent.200}',
        300: '{brandAccent.300}',
        400: '{brandAccent.400}',
        500: '{brandAccent.500}',
        600: '{brandAccent.600}',
        700: '{brandAccent.700}',
        800: '{brandAccent.800}',
        900: '{brandAccent.900}',
        950: '{brandAccent.950}'
      },
      danger: { 
        50: '{red.50}', 
        100: '{red.100}', 
        200: '{red.200}', 
        300: '{red.300}', 
        400: '{red.400}', 
        500: '{red.500}',
        600: '{red.600}',
        700: '{red.700}',
        800: '{red.800}',
        900: '{red.900}',
        950: '{red.950}'
      },
      disabled: {
        color: '{surface.300}',
      }
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}',
          1000: '#000000'
        },
        primary: {
          color: '{primary.700}',
          contrastColor: '{surface.0}',
          hoverColor: '{primary.500}',
          activeColor: '{primary.400}',
        },
        az: {
          secondary: {
            color: '{az.secondary.700}',
            contrastColor: '{surface.0}',
            hoverColor: '{az.secondary.500}',
            activeColor: '{az.secondary.400}',
          },
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.500}',
          600: '{neutral.600}',
          700: '{neutral.700}',
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}',
          1000: '#000000'
        },
        primary: {
          color: '{primary.700}',
          contrastColor: '{surface.0}',
          hoverColor: '{primary.500}',
          activeColor: '{primary.400}',
        },
        az: {
          secondary: {
            color: '{az.secondary.700}',
            contrastColor: '{surface.0}',
            hoverColor: '{az.secondary.500}',
            activeColor: '{az.secondary.400}',
          },
        },
      }
    }
  },

  components: {
    button,
  },
});

export default {
  preset: Default,
  options: {
    darkModeSelector: '.p-dark',
  },
}
