/// <reference types="jest" />
import { createThemeStructure, processColorScheme, processPrimitiveTokens, processSemanticTokens } from '../theme'
import type { TokenLeaf, TokenNode } from '../types'

describe('theme generation', () => {
  // Common test data
  const mockTokens = {
    primitive: {
      simple: {
        'aura/primitive': {
          color: {
            primary: {
              $type: 'color',
              $value: '#000000',
            } as TokenLeaf,
            secondary: {
              $type: 'color',
              $value: '#ffffff',
            } as TokenLeaf,
          },
        },
      },
      processed: {
        color: {
          primary: '#000000',
          secondary: '#ffffff',
        },
      },
    },
    semantic: {
      simple: {
        'aura/semantic': {
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
      processed: {
        primary: {
          color: '#000000',
          contrastColor: '#ffffff',
        },
      },
    },
    colorScheme: {
      simple: {
        'aura/semantic/light': {
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
        'aura/semantic/dark': {
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
      processed: {
        light: {
          primary: {
            color: '#000000',
            contrastColor: '#ffffff',
          },
        },
        dark: {
          primary: {
            color: '#000000',
            contrastColor: '#ffffff',
          },
        },
      },
    },
  }

  describe('token processing', () => {
    describe('processPrimitiveTokens', () => {
      it('should process primitive tokens correctly', () => {
        const result = processPrimitiveTokens(mockTokens.primitive.simple)
        expect(result).toEqual(mockTokens.primitive.processed)
      })
    })

    describe('processSemanticTokens', () => {
      it('should process semantic tokens correctly', () => {
        const result = processSemanticTokens(
          mockTokens.semantic.simple,
          mockTokens.primitive.processed,
        )
        expect(result).toEqual(mockTokens.semantic.processed)
      })
    })

    describe('processColorScheme', () => {
      it('should process color schemes correctly', () => {
        const result = processColorScheme(
          mockTokens.colorScheme.simple,
          mockTokens.primitive.processed,
        )
        expect(result).toEqual(mockTokens.colorScheme.processed)
      })
    })
  })

  describe('theme structure', () => {
    describe('createThemeStructure', () => {
      it('should create a complete theme structure', () => {
        const completeTokens: TokenNode = {
          ...mockTokens.primitive.simple,
          ...mockTokens.semantic.simple,
          ...mockTokens.colorScheme.simple,
        }

        const expectedTheme = {
          primitive: mockTokens.primitive.processed,
          semantic: {
            ...mockTokens.semantic.processed,
            colorScheme: mockTokens.colorScheme.processed,
          },
        }

        const result = createThemeStructure(completeTokens)
        expect(result).toEqual(expectedTheme)
      })
    })
  })
})
