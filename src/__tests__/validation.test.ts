/// <reference types="jest" />
import { validateTokenStructure } from '../validation'
import type { TokenLeaf } from '../types'

describe('token validation', () => {
  // Common test data
  const mockTokens = {
    standardTokens: {
      valid: {
        color: {
          $type: 'color',
          $value: '#000000',
        } as TokenLeaf,
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
      },
    },
    shadow: {
      valid: {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              x: '0px',
              y: '2px',
              blur: '4px',
              spread: '0px',
              color: '#000000',
              type: 'dropShadow',
            },
          } as TokenLeaf,
          lg: {
            $type: 'boxShadow',
            $value: {
              x: '0px',
              y: '4px',
              blur: '8px',
              spread: '2px',
              color: '#000000',
              type: 'dropShadow',
            },
          } as TokenLeaf,
        },
      },
      invalid: {
        shadow: {
          sm: {
            $type: 'boxShadow',
            $value: {
              x: '0px',
              // Missing y property
              blur: '4px',
              color: '#000000',
            },
          } as unknown as TokenLeaf,
          lg: {
            $type: 'boxShadow',
            $value: {
              // Missing x property
              y: '4px',
              blur: '8px',
              color: '#000000',
            },
          } as unknown as TokenLeaf,
        },
      },
    },
    nested: {
      valid: {
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
      },
    },
    container: {
      valid: {
        primary: {
          color: {
            $type: 'color',
            $value: '#000000',
          } as TokenLeaf,
          contrast: {
            color: {
              $type: 'color',
              $value: '#ffffff',
            } as TokenLeaf,
          },
        },
      },
    },
    malformed: {
      missingValue: {
        color: {
          $type: 'color',
          $value: '#000000',
        } as TokenLeaf,
        padding: {
          x: {
            $type: 'spacing', // Missing $value
          } as unknown as TokenLeaf,
        },
      },
      missingType: {
        color: {
          $value: '#000000', // Missing $type
        } as unknown as TokenLeaf,
        padding: {
          x: {
            $type: 'spacing',
            $value: '0.75rem',
          } as TokenLeaf,
          y: {
            $value: '0.5rem', // Missing $type
          } as unknown as TokenLeaf,
        },
      },
    },
  }

  describe('valid structures', () => {
    describe('simple tokens', () => {
      it('should validate standard token structures', () => {
        expect(validateTokenStructure(mockTokens.standardTokens.valid)).toBe(true)
      })
    })

    describe('complex tokens', () => {
      it('should validate shadow values correctly', () => {
        expect(validateTokenStructure(mockTokens.shadow.valid)).toBe(true)
      })

      it('should validate nested token structures correctly', () => {
        expect(validateTokenStructure(mockTokens.nested.valid)).toBe(true)
      })

      it('should validate container tokens without $value', () => {
        expect(validateTokenStructure(mockTokens.container.valid)).toBe(true)
      })
    })
  })

  describe('invalid structures', () => {
    describe('missing properties', () => {
      it('should reject tokens without $value', () => {
        expect(validateTokenStructure(mockTokens.malformed.missingValue)).toBe(false)
      })

      it('should reject tokens without $type', () => {
        expect(validateTokenStructure(mockTokens.malformed.missingType)).toBe(false)
      })
    })

    describe('invalid values', () => {
      it('should reject shadow value tokens without required properties', () => {
        expect(validateTokenStructure(mockTokens.shadow.invalid)).toBe(false)
      })
    })
  })
})
