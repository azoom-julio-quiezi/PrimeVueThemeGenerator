/// <reference types="jest" />
import { processBoxShadow, processFormField, processList, processNavigation, processTokenValue, processTransformableToken } from '../processors'
import type { ProcessedToken, ShadowValue, TokenLeaf, TokenNode, TokenValue } from '../types'

describe('token processors', () => {
  describe('primitive token processing', () => {
    describe('color tokens', () => {
      it('should process color tokens correctly', () => {
        const colorToken: TokenNode = {
          emerald: {
            50: {
              $type: 'color',
              $value: '#ecfdf5',
            } as TokenLeaf,
            100: {
              $type: 'color',
              $value: '#d1fae5',
            } as TokenLeaf,
            200: {
              $type: 'color',
              $value: '#a7f3d0',
            } as TokenLeaf,
          },
        }

        const result = processTokenValue(colorToken, {}, [])
        expect(result).toEqual({
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
          },
        })
      })
    })

    describe('border radius tokens', () => {
      it('should process nested border radius tokens correctly', () => {
        const borderToken: TokenNode = {
          border: {
            radius: {
              none: {
                $type: 'borderRadius',
                $value: '0',
              } as TokenLeaf,
              xs: {
                $type: 'borderRadius',
                $value: '2px',
              } as TokenLeaf,
              sm: {
                $type: 'borderRadius',
                $value: '4px',
              } as TokenLeaf,
              md: {
                $type: 'borderRadius',
                $value: '6px',
              } as TokenLeaf,
              lg: {
                $type: 'borderRadius',
                $value: '8px',
              } as TokenLeaf,
              xl: {
                $type: 'borderRadius',
                $value: '12px',
              } as TokenLeaf,
            },
          },
        }

        const result = processTokenValue(borderToken, {}, ['primitive'])
        expect(result).toEqual({
          borderRadius: {
            none: '0',
            xs: '2px',
            sm: '4px',
            md: '6px',
            lg: '8px',
            xl: '12px',
          },
        })
      })
    })

    it('should process multi-depth tokens correctly', () => {
      const multiDepthToken: TokenNode = {
        selected: {
          background: {
            $type: 'color',
            $value: '{highlight.background}',
          } as TokenLeaf,
          focus: {
            background: {
              $type: 'color',
              $value: '{highlight.focus.background}',
            } as TokenLeaf,
            color: {
              $type: 'color',
              $value: '{highlight.focus.color}',
            } as TokenLeaf,
          },
          color: {
            $type: 'color',
            $value: '{highlight.color}',
          } as TokenLeaf,
        },
      }

      const result = processTokenValue(multiDepthToken, {}, [])
      expect(result).toEqual({
        selectedBackground: '{highlight.background}',
        selectedFocusBackground: '{highlight.focus.background}',
        selectedFocusColor: '{highlight.focus.color}',
        selectedColor: '{highlight.color}',
      })
    })

    describe('box shadow tokens', () => {
      it('should process box shadow values correctly', () => {
        const shadowValue: ShadowValue = {
          color: '#000000',
          x: '0px',
          y: '2px',
          blur: '4px',
          spread: '0px',
          type: 'dropShadow',
        }

        const result = processBoxShadow(shadowValue)
        expect(result).toBe('0px 2px 4px 0px #000000')
      })

      it('should process nested shadow tokens correctly', () => {
        const focusRingToken: TokenNode = {
          focusRing: {
            width: {
              $type: 'dimension',
              $value: '1px',
            } as TokenLeaf,
            style: {
              $type: 'string',
              $value: 'solid',
            } as TokenLeaf,
            color: {
              $type: 'color',
              $value: '{primary.color}',
            } as TokenLeaf,
            offset: {
              $type: 'dimension',
              $value: '2px',
            } as TokenLeaf,
            shadow: {
              $type: 'boxShadow',
              $value: {
                x: '0',
                y: '0',
                blur: '0',
                spread: '0',
                color: 'rgba(0, 0, 0, 0)',
                type: 'dropShadow',
              },
            } as TokenLeaf,
          },
        }

        const result = processTokenValue(focusRingToken, {}, [])
        expect(result).toEqual({
          focusRing: {
            width: '1px',
            style: 'solid',
            color: '{primary.color}',
            offset: '2px',
            shadow: '0 0 0 0 rgba(0, 0, 0, 0)',
          },
        })
      })
    })
  })

  describe('special token processing', () => {
    describe('form field tokens', () => {
      it('should process form field tokens correctly', () => {
        const formFieldToken: TokenNode = {
          padding: {
            x: {
              $type: 'spacing',
              $value: '0.75rem',
            } as TokenLeaf,
            y: {
              $type: 'spacing',
              $value: '0.5rem',
            } as TokenLeaf,
          },
          sm: {
            font: {
              size: {
                $type: 'fontSizes',
                $value: '0.875rem',
              } as TokenLeaf,
            },
            padding: {
              x: {
                $type: 'spacing',
                $value: '0.625rem',
              } as TokenLeaf,
              y: {
                $type: 'spacing',
                $value: '0.375rem',
              } as TokenLeaf,
            },
          },
        }

        const result = processFormField(formFieldToken)
        expect(result).toEqual({
          paddingX: '0.75rem',
          paddingY: '0.5rem',
          sm: {
            fontSize: '0.875rem',
            paddingX: '0.625rem',
            paddingY: '0.375rem',
          },
        })
      })
    })

    describe('list tokens', () => {
      it('should process list tokens correctly', () => {
        const listToken: TokenNode = {
          padding: {
            $type: 'spacing',
            $value: '0.25rem 0.25rem',
          } as TokenLeaf,
          gap: {
            $type: 'spacing',
            $value: '2px',
          } as TokenLeaf,
          header: {
            padding: {
              $type: 'spacing',
              $value: '0.5rem 0.75rem 0.25rem 0.75rem',
            } as TokenLeaf,
          },
          option: {
            padding: {
              $type: 'spacing',
              $value: '3.5rem 3.75rem',
            } as TokenLeaf,
            border: {
              radius: {
                $type: 'borderRadius',
                $value: '{0.5rem}',
              } as TokenLeaf,
            },
            group: {
              padding: {
                $type: 'spacing',
                $value: '0.5rem 0.75rem',
              } as TokenLeaf,
              font: {
                weight: {
                  $type: 'fontWeights',
                  $value: '600',
                } as TokenLeaf,
              },
            },
          },
        }

        const result = processList(listToken)
        expect(result).toEqual({
          padding: '0.25rem 0.25rem',
          gap: '2px',
          header: {
            padding: '0.5rem 0.75rem 0.25rem 0.75rem',
          },
          option: {
            padding: '3.5rem 3.75rem',
            borderRadius: '{0.5rem}',
          },
          optionGroup: {
            padding: '0.5rem 0.75rem',
            fontWeight: '600',
          },
        })
      })
    })

    describe('navigation tokens', () => {
      it('should process navigation tokens correctly', () => {
        const navigationToken: TokenNode = {
          list: {
            padding: {
              $type: 'spacing',
              $value: '0.25rem 0.25rem',
            } as TokenLeaf,
            gap: {
              $type: 'spacing',
              $value: '2px',
            } as TokenLeaf,
          },
          item: {
            padding: {
              $type: 'spacing',
              $value: '0.5rem 0.75rem',
            } as TokenLeaf,
            border: {
              radius: {
                $type: 'borderRadius',
                $value: '{border.radius.sm}',
              } as TokenLeaf,
            },
            gap: {
              $type: 'spacing',
              $value: '0.5rem',
            } as TokenLeaf,
          },
          submenu: {
            label: {
              padding: {
                $type: 'spacing',
                $value: '0.5rem 0.75rem',
              } as TokenLeaf,
              font: {
                weight: {
                  $type: 'fontWeights',
                  $value: '600',
                } as TokenLeaf,
              },
            },
            icon: {
              size: {
                $type: 'sizing',
                $value: '0.875rem',
              } as TokenLeaf,
            },
          },
        }

        const result = processNavigation(navigationToken)
        expect(result).toEqual({
          list: {
            padding: '0.25rem 0.25rem',
            gap: '2px',
          },
          item: {
            padding: '0.5rem 0.75rem',
            borderRadius: '{border.radius.sm}',
            gap: '0.5rem',
          },
          submenuLabel: {
            padding: '0.5rem 0.75rem',
            fontWeight: '600',
          },
          submenuIcon: {
            size: '0.875rem',
          },
        })
      })
    })
  })

  describe('token transformation', () => {
    it('should process transformable tokens correctly', () => {
      const tokenKey = 'hover'
      const tokenValue = {
        background: {
          $type: 'color',
          $value: '{highlight.focus.background}',
        },
        color: {
          $type: 'color',
          $value: '{highlight.focus.color}',
        },
      }
      const currentPath = ['hover']
      const result: ProcessedToken = {}
      const primitiveTokens: TokenNode = {}

      processTransformableToken(tokenKey, tokenValue as unknown as TokenValue, currentPath, result, primitiveTokens)
      expect(result).toEqual({
        hoverBackground: '{highlight.focus.background}',
        hoverColor: '{highlight.focus.color}',
      })
    })
  })
})
