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
    raised: {
      boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.30), 0px 10px 30px 6px rgba(0, 0, 0, 0.10)',
      border: '1px solid {surface.0}',
      hover: {
        boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.30), 0px 2px 8px 1px rgba(0, 0, 0, 0.10)',
      },
      active: {
        boxShadow: 'none',
      },
      focus: {
        boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.30), 0px 10px 30px 6px rgba(0, 0, 0, 0.10)',
      },
    },
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
      disabled: {
        background: '{az.disabled.background}',
        border: '{az.disabled.border}',
        color: '{az.disabled.color}',
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

    .p-button-raised {
      box-shadow: ${options.dt('button.raised.boxShadow')};
      border: ${options.dt('button.raised.border')};
    }
    .p-button-raised:hover {
      box-shadow: ${options.dt('button.raised.hover.boxShadow')};
    }
    .p-button-raised:focus {
      box-shadow: ${options.dt('button.raised.focus.boxShadow')};
    }
    .p-button-raised:active {
      box-shadow: ${options.dt('button.raised.active.boxShadow')};
    }
    
    .p-button-outlined {
      background: ${options.dt('button.outlined.primary.az.background')};
    }
    .p-button-outlined.p-button-secondary {
      background: ${options.dt('button.outlined.secondary.az.background')};
    }
    .p-button-outlined.p-button-danger {
      background: ${options.dt('button.outlined.danger.background')};
    }

    .p-button-text:hover,
    .p-button-text:active {
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    .p-button:disabled {
      background-color: ${options.dt('button.az.disabled.background')};
      border-color: ${options.dt('button.az.disabled.border')};
      color: ${options.dt('button.az.disabled.color')};
      opacity: 1;
    }
    .p-button-white-border:disabled {
      border: ${options.dt('button.az.whiteBorder.border')};
    }
    .p-button-outlined:disabled {
      border-color: ${options.dt('button.outlined.az.disabled.border')};
      color: ${options.dt('button.outlined.az.disabled.color')};
      background-color: ${options.dt('button.outlined.az.disabled.background')};
    }
    .p-button-text:disabled {
      color: ${options.dt('button.text.az.disabled.color')};
      background-color: transparent;
      border: none;
      text-decoration: none;
    }
    .p-button-danger:disabled {
      background-color: ${options.dt('button.danger.az.disabledBackground')};
      color: ${options.dt('button.danger.az.disabledColor')};
      border-color: ${options.dt('button.danger.az.disabledBorder')};
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
          background: '{az.secondary.color}',
          hoverBackground: '{az.secondary.hover.color}',
          activeBackground: '{az.secondary.active.color}',
          borderColor: '{az.secondary.color}',
          hoverBorderColor: '{az.secondary.hover.color}',
          activeBorderColor: '{az.secondary.active.color}',
          color: '{az.secondary.contrast.color}',
          hoverColor: '{az.secondary.contrast.color}',
          activeColor: '{az.secondary.contrast.color}',
          focusRing: {
            color: '{az.secondary.color}',
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
          },
          extend: {
            az: {
              disabledBackground: '{surface.0}',
              disabledBorder: '{az.danger.200}',
              disabledColor: '{az.danger.200}',
            }
          }
        },
      },
      outlined: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          borderColor: '{primary.color}',
          color: '{primary.color}',
          extend: {
            az: {
              background: '{surface.0}',
            }
          }
        },
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.color}',
          extend: {
            az: {
              background: '{surface.0}',
            }
          }
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
        extend: {
          az: {
            disabledBackground: '{surface.0}',
            disabledBorderColor: '{az.disabled.border}',
            disabledColor: '{az.disabled.color}',
          }
        }
      },
      text: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          color: '{primary.color}',
        },
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          color: '{az.secondary.color}',
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
        extend: {
          az: {
            disabledColor: '{az.disabled.color}',
          }
        }
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
          extend: {
            az: {
              disabledBackground: '{primary.az.disabledColor}',
              disabledBorder: '{primary.az.disabledColor}',
              disabledColor: '{primary.az.disabledColor}',
            }
          }
        },
        secondary: {
          background: '{az.secondary.color}',
          hoverBackground: '{az.secondary.hover.color}',
          activeBackground: '{az.secondary.active.color}',
          borderColor: '{az.secondary.color}',
          hoverBorderColor: '{az.secondary.hover.color}',
          activeBorderColor: '{az.secondary.active.color}',
          color: '{az.secondary.contrast.color}',
          hoverColor: '{az.secondary.contrast.color}',
          activeColor: '{az.secondary.contrast.color}',
          focusRing: {
            color: '{az.secondary.900}',
          },
          extend: {
            az: {
              disabledBackground: '{az.secondary.disabledColor}',
              disabledBorder: '{az.secondary.disabledColor}',
              disabledColor: '{az.secondary.disabledColor}',
            }
          }
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
          },
          extend: {
            az: {
              disabledBackground: '{surface.0}',
              disabledBorder: '{az.danger.200}',
              disabledColor: '{az.danger.200}',
            }
          }
        },
      },
      outlined: {
        primary: {
          hoverBackground: '{primary.50}',
          activeBackground: '{primary.100}',
          borderColor: '{primary.color}',
          color: '{primary.color}',
          extend: {
            az: {
              background: '{surface.0}',
              disabledBackground: '{surface.0}',
              disabledBorder: '{primary.az.disabledColor}',
              disabledColor: '{primary.az.disabledColor}',
            }
          }
        },
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.color}',
          extend: {
            az: {
              background: '{surface.0}',
              disabledBackground: '{surface.0}',
              disabledBorder: '{az.secondary.disabledColor}',
              disabledColor: '{az.secondary.disabledColor}',
            }
          }
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
          extend: { 
            az: {
              disabledColor: '{primary.az.disabledColor}',
            }
          }
        },
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          color: '{az.secondary.color}',
          extend: {
            az: {
              disabledColor: '{az.secondary.disabledColor}',
            }
          }
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
  },
}
