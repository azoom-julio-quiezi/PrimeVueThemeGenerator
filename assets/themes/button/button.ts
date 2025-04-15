export default {
  root: {
    paddingX: '1rem',
    paddingY: '0.5rem',
    iconOnlyWidth: '2.75rem',
    fontSize: '1rem',
    raised: {
      boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.3), 0px 10px 30px 6px rgba(0, 0, 0, 0.1)',
      extend: {
        az: {
          border: '1px solid {surface.0}',
          hover: {
            boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.3), 0px 2px 8px 1px rgba(0, 0, 0, 0.1)',
          },
          active: {
            boxShadow: 'none',
          },
          focus: {
            boxShadow: '0px 3px 12px 0px rgba(0, 0, 0, 0.3), 0px 10px 30px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
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
          fontSize: '1.25rem',
          icon: {
            only: {
              width: '3.5rem',
            },
          },
          paddingX: '1rem',
          paddingY: '0.75rem',
        },
        xsm: {
          fontSize: '0.75rem',
          icon: {
            only: {
              width: '1.5rem',
            },
          },
          paddingX: '0.5rem',
          paddingY: '0.25rem',
        },
      },
      whiteBorder: {
        border: '1px solid {surface.0}',
      },
      disabled: {
        background: '{az.disabled.color}',
        border: '{az.disabled.color}',
        color: '{primary.contrast.color}',
      },
    },
  },
  css: ({ dt }: { dt: (path: string) => string }) => `
    .p-button:focus {
      transition-duration: ${dt('button.az.transition.duration.fast')};
      transition-timing-function: ease-out;
    }
    .p-button:active {
      transition-duration: ${dt('button.az.transition.duration.instant')};
    }

    .p-button-xlg {
      font-size: ${dt('button.az.size.xlg.fontSize')};
      padding-left: ${dt('button.az.size.xlg.paddingX')};
      padding-right: ${dt('button.az.size.xlg.paddingX')};
      padding-top: ${dt('button.az.size.xlg.paddingY')};
      padding-bottom: ${dt('button.az.size.xlg.paddingY')};
    }
    .p-button-xsm {
      font-size: ${dt('button.az.size.xsm.fontSize')};
      padding-left: ${dt('button.az.size.xsm.paddingX')};
      padding-right: ${dt('button.az.size.xsm.paddingX')};
      padding-top: ${dt('button.az.size.xsm.paddingY')};
      padding-bottom: ${dt('button.az.size.xsm.paddingY')};
    }

    .p-button-xsm.p-button-icon-only {
      width: ${dt('button.az.size.xsm.icon.only.width')};
    }
    .p-button-xsm .p-button-icon {
      font-size: ${dt('button.az.size.xsm.fontSize')};
    }
    .p-button-xlg.p-button-icon-only {
      width: ${dt('button.az.size.xlg.icon.only.width')};
    }
    .p-button-xlg .p-button-icon {
      font-size: ${dt('button.az.size.xlg.fontSize')};
    }

    .p-button-white-border, .p-button-white-border:not(:disabled):hover {
      border: ${dt('button.az.whiteBorder.border')};
    }

    .p-button-raised {
      box-shadow: ${dt('button.raised.boxShadow')};
    }
    .p-button-raised:not(.p-button-outlined) {
      border: ${dt('button.raised.az.border')};
    }
    .p-button-raised:not(:disabled):hover {
      box-shadow: ${dt('button.raised.az.hover.boxShadow')};
    }
    .p-button-raised:not(:disabled):hover:not(.p-button-outlined) {
      border: ${dt('button.raised.az.border')};
    }
    .p-button-raised:not(:disabled):active {
      box-shadow: ${dt('button.raised.az.active.boxShadow')};
    }
    .p-button-raised:focus {
      box-shadow: ${dt('button.raised.az.focus.boxShadow')};
    }

    .p-button-outlined {
      background: ${dt('button.outlined.primary.az.background')};
    }
    .p-button-outlined.p-button-secondary {
      background: ${dt('button.outlined.secondary.az.background')};
    }
    .p-button-outlined.p-button-danger {
      background: ${dt('button.outlined.danger.az.background')};
    }

    .p-button-text:hover,
    .p-button-text:active {
      text-decoration: underline;
      text-underline-offset: 5px;
    }

    .p-button:disabled {
      background-color: ${dt('button.az.disabled.background')};
      border-color: ${dt('button.az.disabled.border')};
      color: ${dt('button.az.disabled.color')};
      opacity: 1;
    }
    .p-button-white-border:disabled {
      border: ${dt('button.az.whiteBorder.border')};
    }
    .p-button-outlined:disabled {
      border-color: ${dt('button.outlined.az.disabled.border.color')};
      color: ${dt('button.outlined.az.disabled.color')};
      background-color: ${dt('button.outlined.az.disabled.background')};
    }
    .p-button-text:disabled {
      color: ${dt('button.text.az.disabled.color')};
      background-color: transparent;
      border: none;
      text-decoration: none;
    }
    .p-button-danger:disabled {
      background-color: ${dt('button.danger.az.disabledBackground')};
      color: ${dt('button.danger.az.disabledColor')};
      border-color: ${dt('button.danger.az.disabledBorder')};
      opacity: 1;
    }
  `,
  colorScheme: {
    light: {
      root: {
        secondary: {
          background: '{az.secondary.color}',
          hoverBackground: '{az.secondary.hover.color}',
          hoverBorderColor: '{az.secondary.hover.color}',
          hoverColor: '{az.secondary.contrast.color}',
          activeBackground: '{az.secondary.active.color}',
          activeBorderColor: '{az.secondary.active.color}',
          activeColor: '{az.secondary.contrast.color}',
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.contrast.color}',
          focusRing: {
            color: '{az.secondary.color}',
          },
        },
        danger: {
          background: '{az.danger.50}',
          hoverBackground: '{az.danger.800}',
          hoverBorderColor: '{az.danger.800}',
          hoverColor: '{surface.0}',
          activeBackground: '{az.danger.700}',
          activeBorderColor: '{az.danger.700}',
          activeColor: '{surface.0}',
          borderColor: '{az.danger.700}',
          color: '{az.danger.700}',
          focusRing: {
            color: '{az.danger.color}',
          },
          extend: {
            az: {
              disabledBackground: '{surface.0}',
              disabledBorder: '{az.danger.200}',
              disabledColor: '{az.danger.200}',
            },
          },
        },
        info: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        success: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        warn: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        help: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
      },
      outlined: {
        primary: {
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
        },
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.color}',
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
        },
        danger: {
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          borderColor: '{az.danger.700}',
          color: '{az.danger.700}',
        },
        extend: {
          az: {
            disabledBackground: '{surface.0}',
            disabledBorderColor: '{az.disabled.color}',
            disabledColor: '{az.disabled.color}',
          },
        },
      },
      text: {
        secondary: {
          hoverBackground: '{az.secondary.50}',
          activeBackground: '{az.secondary.100}',
          color: '{az.secondary.color}',
        },
        danger: {
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          color: '{az.danger.700}',
        },
        extend: {
          az: {
            disabledColor: '{az.disabled.color}',
          },
        },
      },
    },
    dark: {
      root: {
        secondary: {
          background: '{az.secondary.color}',
          hoverBackground: '{az.secondary.hover.color}',
          hoverBorderColor: '{az.secondary.hover.color}',
          hoverColor: '{az.secondary.contrast.color}',
          activeBackground: '{az.secondary.active.color}',
          activeBorderColor: '{az.secondary.active.color}',
          activeColor: '{az.secondary.contrast.color}',
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.contrast.color}',
          focusRing: {
            color: '{az.secondary.color}',
          },
        },
        danger: {
          background: '{az.danger.50}',
          hoverBackground: '{az.danger.800}',
          hoverBorderColor: '{az.danger.800}',
          hoverColor: '{surface.0}',
          activeBackground: '{az.danger.700}',
          activeBorderColor: '{az.danger.700}',
          activeColor: '{surface.0}',
          borderColor: '{az.danger.700}',
          color: '{az.danger.700}',
          focusRing: {
            color: '{az.danger.color}',
          },
          extend: {
            az: {
              disabledBackground: '{surface.0}',
              disabledBorder: '{az.danger.200}',
              disabledColor: '{az.danger.200}',
            },
          },
        },
        info: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        success: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        warn: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
        help: {
          hoverColor: '{surface.0}',
          activeColor: '{surface.0}',
          color: '{surface.0}',
        },
      },
      outlined: {
        primary: {
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
        },
        secondary: {
          borderColor: '{az.secondary.color}',
          color: '{az.secondary.color}',
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
        },
        danger: {
          extend: {
            az: {
              background: '{surface.0}',
            },
          },
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          borderColor: '{az.danger.700}',
          color: '{az.danger.700}',
        },
        extend: {
          az: {
            disabledBackground: '{surface.0}',
            disabledBorderColor: '{az.disabled.color}',
            disabledColor: '{az.disabled.color}',
          },
        },
      },
      text: {
        secondary: {
          color: '{az.secondary.color}',
        },
        danger: {
          hoverBackground: '{az.danger.50}',
          activeBackground: '{az.danger.100}',
          color: '{az.danger.700}',
        },
        extend: {
          az: {
            disabledColor: '{az.disabled.color}',
          },
        },
      },
    },
  },
}
