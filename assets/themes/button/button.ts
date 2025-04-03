export default {
  root: {
    borderRadius: '{border.radius.sm}', // change formfield border radius
    roundedBorderRadius: '2rem',
    gap: '0.5rem',
    paddingX: '1rem',
    paddingY: '0.5rem',
    iconOnlyWidth: '2.75rem',
    fontSize: '1rem',
    sm: {
      fontSize: '1rem',
      paddingX: '1rem',
      paddingY: '0.25rem',
    },
    lg: {
      fontSize: '1rem',
      paddingX: '1rem',
      paddingY: '0.75rem',
    },
    label: {
      fontWeight: '600',
    },
    raisedShadow: '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    focusRing: {
      width: '1px', // change formfield focus ring width
      style: 'solid', // change formfield focus ring style
      offset: '4px', // change formfield focus ring offset
    },
    badgeSize: '1rem',
    transitionDuration: '150ms',
  },
  extend: {
    az: {
      transition: {
        duration: {
          instant: '0ms',
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
      },
      size: {
        xlg: {
          fontSize: '1rem',
          paddingX: '1rem',
          paddingY: '1.125rem',
        },
        xsm: {
          fontSize: '0.875rem',
          paddingX: '1rem',
          paddingY: '0.095rem',
        },
      },
      whiteBorder: {
        border: '1px solid {surface.0}',
      },
      float: {
        boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.30), 0px 10px 30px 6px rgba(0, 0, 0, 0.10)',
        border: '1px solid {surface.0}',
      },
      outlined: {
        primary: {
          disabledBackground: '{surface.0}',
          background: '{surface.0}',
        },
        secondary: {
          disabledBackground: '{surface.0}',
          background: '{surface.0}',
        },
        danger: {
          disabledBackground: '{surface.0}',
          background: '{surface.0}',
        },
      },
      primary: {
        disabledBackground: '{primary.az.disabledColor}',
        disabledBorder: '{primary.az.disabledColor}',
        contrastColor: '{primary.contrastColor}',
        disabledColor: '{primary.az.disabledColor}',
      },
      secondary: {
        disabledBackground: '{az.secondary.disabledColor}',
        disabledBorder: '{az.secondary.disabledColor}',
        contrastColor: '{az.secondary.contrastColor}',
        disabledColor: '{az.secondary.disabledColor}',
      },
      danger: {
        disabledBackground: '{surface.0}',
        disabledBorder: '{az.danger.200}',
        contrastColor: '{az.danger.contrastColor}',
        disabledColor: '{az.danger.200}',
      },
    },
  },
  css: (options: { dt: (path: string) => string | number | undefined }) => `
    .p-button:focus {
      transition-duration: ${options.dt('button.az.transition.duration.fast')};
      transition-timing-function: ease-out;
    }
    .p-button:active {
      transition-duration: ${options.dt('button.az.transition.duration.instant')};
    }

    .p-button-size-xlg {
      font-size: ${options.dt('button.az.size.xlg.fontSize')};
      padding-left: ${options.dt('button.az.size.xlg.paddingX')};
      padding-right: ${options.dt('button.az.size.xlg.paddingX')};
      padding-top: ${options.dt('button.az.size.xlg.paddingY')};
      padding-bottom: ${options.dt('button.az.size.xlg.paddingY')};
    }
    .p-button-size-xsm {
      font-size: ${options.dt('button.az.size.xsm.fontSize')};
      padding-left: ${options.dt('button.az.size.xsm.paddingX')};
      padding-right: ${options.dt('button.az.size.xsm.paddingX')};
      padding-top: ${options.dt('button.az.size.xsm.paddingY')};
      padding-bottom: ${options.dt('button.az.size.xsm.paddingY')};
    }

    .p-button-white-border {
      border: ${options.dt('button.az.whiteBorder.border')};
    }

    .p-button-float {
      box-shadow: ${options.dt('button.az.float.boxShadow')};
      border: ${options.dt('button.az.float.border')};
    }
    .p-button-float:hover {
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.30), 0px 2px 8px 1px rgba(0, 0, 0, 0.10);
    }
    .p-button-float:active {
      box-shadow: none;
    }
    .p-button-float:focus {
      box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.30), 0px 10px 30px 6px rgba(0, 0, 0, 0.10);
    }
    
    .p-button-outlined {
      background: ${options.dt('button.az.outlined.primary.background')};
    }
    .p-button-outlined.p-button-secondary {
      background: ${options.dt('button.az.outlined.secondary.background')};
    }
    .p-button-outlined.p-button-danger {
      background: ${options.dt('button.az.outlined.danger.background')};
    }

    .p-button-text:hover,
    .p-button-text:active {
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    .p-button:disabled {
      background-color: ${options.dt('button.az.primary.disabledBackground')};
      border-color: ${options.dt('button.az.primary.disabledBorder')};
      color: ${options.dt('button.az.primary.contrastColor')};
      opacity: 1;
    }
    .p-button-white-border:disabled {
      border: ${options.dt('button.az.whiteBorder.border')};
    }
    .p-button-outlined:disabled {
      border-color: ${options.dt('button.az.primary.disabledBorder')};
      color: ${options.dt('button.az.primary.disabledColor')};
      background-color: ${options.dt('button.az.outlined.primary.disabledBackground')};
    }
    .p-button-text:disabled {
      color: ${options.dt('button.az.primary.disabledColor')};
      background-color: transparent;
      border: none;
      text-decoration: none;
    }
    .p-button-danger:disabled {
      background-color: ${options.dt('button.az.danger.disabledBackground')};
      color: ${options.dt('button.az.danger.disabledColor')};
      border-color: ${options.dt('button.az.danger.disabledBorder')};
      opacity: 1;
    }
  `,
  colorScheme: {
    light: {
      root: {
        primary: {
          background: '{primary.color}',
          hoverBackground: '{primary.hover.color}',
          activeBackground: '{primary.active.color}',
          borderColor: '{primary.color}',
          hoverBorderColor: '{primary.hover.color}',
          activeBorderColor: '{primary.active.color}',
          color: '{primary.contrast.color}',
          hoverColor: '{primary.contrast.color}',
          activeColor: '{primary.contrast.color}',
          focusRing: {
            color: '{primary.color}',
          },
        },
        secondary: {
          background: '{secondary.color}',
          hoverBackground: '{secondary.hover.color}',
          activeBackground: '{secondary.active.color}',
          borderColor: '{secondary.color}',
          hoverBorderColor: '{secondary.hover.color}',
          activeBorderColor: '{secondary.active.color}',
          color: '{secondary.contrast.color}',
          hoverColor: '{secondary.contrast.color}',
          activeColor: '{secondary.contrast.color}',
          focusRing: {
            color: '{secondary.color}',
          },
        },
        danger: {
          background: '{az.danger.50}',
          hoverBackground: '{az.danger.800}',
          activeBackground: '{az.danger.700}',
          borderColor: '{az.danger.700}',
          hoverBorderColor: '{az.danger.800}',
          activeBorderColor: '{az.danger.700}',
          color: '{az.danger.700}',
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          focusRing: {
              color: '{az.danger.color}',
              shadow: 'none'
          }
        },
      },
      outlined: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          borderColor: '{primary.color}',
          color: '{primary.color}',
        },
        secondary: {
          hoverBackground: '{secondary.50}',
          activeBackground: '{secondary.100}',
          borderColor: '{secondary.color}',
          color: '{secondary.color}',
        },
        danger: {
          background: '{surface.0}',
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          borderColor: '{az.danger.700}',
          color: '{az.danger.700}',
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          focusRing: {
              color: '{az.danger.700}',
              shadow: 'none'
          }
        },
      },
      text: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          color: '{primary.color}',
        },
        secondary: {
          hoverBackground: '{secondary.50}',
          activeBackground: '{secondary.100}',
          color: '{secondary.color}',
        },
        danger: {
          background: '{transparent}',
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          borderColor: '{az.danger.700}',
          hoverBorderColor: '{az.danger.700}',
          activeBorderColor: '{az.danger.700}',
          color: '{az.danger.700}',
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          focusRing: {
              color: '{az.danger.700}',
              shadow: 'none'
          }
        },
      },
    },
    dark: {
      root: {
        primary: {
          background: '{primary.color}',
          hoverBackground: '{primary.hover.color}',
          activeBackground: '{primary.active.color}',
          borderColor: '{primary.color}',
          hoverBorderColor: '{primary.hover.color}',
          activeBorderColor: '{primary.active.color}',
          color: '{primary.contrast.color}',
          hoverColor: '{primary.contrast.color}',
          activeColor: '{primary.contrast.color}',
          focusRing: {
            color: '{primary.900}',
          },
        },
        secondary: {
          background: '{secondary.color}',
          hoverBackground: '{secondary.hover.color}',
          activeBackground: '{secondary.active.color}',
          borderColor: '{secondary.color}',
          hoverBorderColor: '{secondary.hover.color}',
          activeBorderColor: '{secondary.active.color}',
          color: '{secondary.contrast.color}',
          hoverColor: '{secondary.contrast.color}',
          activeColor: '{secondary.contrast.color}',
          focusRing: {
            color: '{secondary.900}',
          },
        },
      },
      outlined: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          borderColor: '{primary.color}',
          color: '{primary.color}',
        },
        secondary: {
          hoverBackground: '{secondary.50}',
          activeBackground: '{secondary.100}',
          borderColor: '{secondary.color}',
          color: '{secondary.color}',
        },
      },
      text: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          color: '{primary.color}',
        },
        secondary: {
          hoverBackground: '{secondary.50}',
          activeBackground: '{secondary.100}',
          color: '{secondary.color}',
        },
      },
    },
  },
}
