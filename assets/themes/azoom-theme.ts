import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import button from './button/button'

const Default = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px'
    },
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    lime: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05'
    },
    red: {
      50: '#FFF2F1',
      100: '#FFE2DF',
      200: '#FFC9C4',
      300: '#FFA39B',
      400: '#FF6F62',
      500: '#FF4231',
      600: '#E7000B',
      700: '#D91C0B',
      800: '#A71A0D',
      900: '#8A1C12',
      950: '#4C0903'
    },
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006'
    },
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e'
    },
    cyan: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344'
    },
    sky: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    indigo: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b'
    },
    violet: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065'
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    fuchsia: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e'
    },
    pink: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724'
    },
    rose: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519'
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    zinc: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b'
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a'
    },
    stone: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09'
    },
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
    anchorGutter: '2px',
    iconSize: '1rem',
    disabledOpacity: '0.6',
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '1px',
        style: 'solid',
        color: '{primary.color}',
        offset: '2px',
        shadow: '0 0 0 0 rgba(0, 0, 0, 0)'
      },
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        paddingY: '0.375rem'
      },
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        paddingY: '0.625rem'
      },
      transitionDuration: '{transition.duration}'
    },
    content: {
      borderRadius: '{border.radius.md}'
    },
    focusRing: {
      width: '1',
      color: '{primary.color}',
      offset: '2',
      shadow: '0 0 0 0 rgba(0, 0, 0, 0)',
      stroke: {
        color: '{focus.ring.color}',
        width: '{focus.ring.offset} + {focus.ring.width}',
        style: '{focus.ring.style}'
      },
      style: 'solid'
    },
    list: {
      padding: '0.25rem 0.25rem',
      gap: '2px',
      header: {
        padding: '0.5rem 0.75rem 0.25rem 0.75rem'
      },
      option: {
        padding: '0.5rem 0.75rem',
        borderRadius: '{border.radius.sm}'
      },
      optionGroup: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600'
      }
    },
    mask: {
      transitionDuration: '0.2s'
    },
    navigation: {
      list: {
        padding: '0.25rem 0.25rem',
        gap: '2px'
      },
      item: {
        padding: '0.5rem 0.75rem',
        borderRadius: '{border.radius.sm}',
        gap: '0.5rem'
      },
      submenuLabel: {
        padding: '0.5rem 0.75rem',
        fontWeight: '600'
      },
      submenuIcon: {
        size: '0.875rem'
      }
    },
    overlay: {
      select: {
        borderRadius: '{border.radius.md}',
        shadow: '0 4 6 -1 rgba(0, 0, 0, 0.1), 0 2 4 -2 rgba(0, 0, 0, 0.1)'
      },
      popover: {
        borderRadius: '{border.radius.md}',
        padding: '0.75rem',
        shadow: '0 4 6 -1 rgba(0, 0, 0, 0.1), 0 2 4 -2 rgba(0, 0, 0, 0.1)'
      },
      modal: {
        borderRadius: '{border.radius.xl}',
        padding: '1.25rem',
        shadow: '0 20 25 -5 rgba(0, 0, 0, 0.1), 0 8 10 -6 rgba(0, 0, 0, 0.1)'
      },
      navigation: {
        shadow: '0 4 6 -1 rgba(0, 0, 0, 0.1), 0 2 4 -2 rgba(0, 0, 0, 0.1)'
      }
    },
    transitionDuration: '0.2s',
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
          950: '{neutral.950}'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
          borderColor: '{primary.900}',
        },
        az: {
          secondary: {
            color: '{az.secondary.700}',
            contrastColor: '{surface.0}',
            hoverColor: '{az.secondary.500}',
            activeColor: '{az.secondary.400}',
            borderColor: '{az.secondary.900}',
          },
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          focusColor: '{primary.800}',
          color: '{primary.700}'
        },
        mask: {
          background: 'rgba(0,0,0,0.4)',
          color: '{surface.200}'
        },
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.200}',
          disabledColor: '{surface.500}',
          filledBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          filledHoverBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          invalidPlaceholderColor: '{red.600}',
          placeholderColor: '{surface.500}',
          floatLabelColor: '{surface.500}',
          floatLabelFocusColor: '{surface.500}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          floatLabelActiveColor: '{surface.500}',
          iconColor: '{surface.400}',
          shadow: '0 1 2 0 rgba(18, 18, 23, 0.05)',
          color: '{surface.700}'
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.100}',
          hoverColor: '{text.hover.color}',
          borderColor: '{surface.200}',
          color: '{text.color}'
        },
        text: {
          color: '{surface.700}',
          hoverColor: '{surface.800}',
          hoverMutedColor: '{surface.600}',
          mutedColor: '{surface.500}'
        },
        overlay: {
          select: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          popover: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          },
          modal: {
            background: '{surface.0}',
            borderColor: '{surface.200}',
            color: '{text.color}'
          }
        },
        list: {
          option: {
            focusBackground: '{surface.100}',
            focusColor: '{text.hover.color}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            selectedFocusColor: '{highlight.focus.color}',
            selectedColor: '{highlight.color}',
            color: '{text.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}'
            }
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}'
          }
        },
        navigation: {
          item: {
            focusBackground: '{surface.100}',
            focusColor: '{text.hover.color}',
            activeBackground: '{surface.100}',
            activeColor: '{text.hover.color}',
            color: '{text.color}',
            icon: {
              color: '{surface.400}',
              focusColor: '{surface.500}',
              activeColor: '{surface.500}'
            }
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}'
          },
          submenuIcon: {
            color: '{surface.400}',
            focusColor: '{surface.500}',
            activeColor: '{surface.500}'
          }
        }
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
          950: '{neutral.950}'
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '{surface.0}',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
          borderColor: '{primary.900}',
        },
        az: {
          secondary: {
            color: '{az.secondary.500}',
            contrastColor: '{surface.0}',
            hoverColor: '{az.secondary.600}',
            activeColor: '{az.secondary.700}',
            borderColor: '{az.secondary.900}',
          },
        },
        highlight: {
          background: '{primary.400}',
          focusBackground: '{primary.400}',
          focusColor: 'rgba(255,255,255,.87)',
          color: 'rgba(255,255,255,.87)'
        },
        mask: {
          background: 'rgba(0,0,0,0.6)',
          color: '{surface.200}'
        },
        formField: {
          background: '{surface.950}',
          disabledBackground: '{surface.700}',
          disabledColor: '{surface.400}',
          filledBackground: '{surface.800}',
          filledFocusBackground: '{surface.800}',
          filledHoverBackground: '{surface.800}',
          borderColor: '{surface.600}',
          hoverBorderColor: '{surface.500}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.300}',
          invalidPlaceholderColor: '{red.400}',
          placeholderColor: '{surface.400}',
          floatLabelColor: '{surface.400}',
          floatLabelFocusColor: '{surface.400}',
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
          floatLabelActiveColor: '{surface.400}',
          iconColor: '{surface.400}',
          shadow: '0 1 2 0 rgba(18, 18, 23, 0.05)',
          color: '{surface.0}'
        },
        content: {
          background: '{surface.900}',
          hoverBackground: '{surface.800}',
          hoverColor: '{text.hover.color}',
          borderColor: '{surface.700}',
          color: '{text.color}'
        },
        text: {
          color: '{surface.0}',
          hoverColor: '{surface.0}',
          hoverMutedColor: '{surface.300}',
          mutedColor: '{surface.400}'
        },
        overlay: {
          select: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}'
          },
          popover: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}'
          },
          modal: {
            background: '{surface.900}',
            borderColor: '{surface.700}',
            color: '{text.color}'
          }
        },
        list: {
          option: {
            focusBackground: '{surface.800}',
            focusColor: '{text.hover.color}',
            selectedBackground: '{highlight.background}',
            selectedFocusBackground: '{highlight.focus.background}',
            selectedFocusColor: '{highlight.focus.color}',
            selectedColor: '{highlight.color}',
            color: '{text.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}'
            }
          },
          optionGroup: {
            background: 'transparent',
            color: '{text.muted.color}'
          }
        },
        navigation: {
          item: {
            focusBackground: '{surface.800}',
            focusColor: '{text.hover.color}',
            activeBackground: '{surface.800}',
            activeColor: '{text.hover.color}',
            color: '{text.color}',
            icon: {
              color: '{surface.500}',
              focusColor: '{surface.400}',
              activeColor: '{surface.400}'
            }
          },
          submenuLabel: {
            background: 'transparent',
            color: '{text.muted.color}'
          },
          submenuIcon: {
            color: '{surface.500}',
            focusColor: '{surface.400}',
            activeColor: '{surface.400}'
          }
        }
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
