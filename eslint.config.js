import config from '@azoom/eslint-config'

export default config(
  {
    rules: {
      'no-irregular-whitespace': 'off',
      'vue/no-irregular-whitespace': 'off',
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'node/prefer-global/process': 'off',
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'beside',
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'never',
        selfClosingTag: {
          singleline: 'never',
          multiline: 'never',
        },
      }],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: false,
        ignores: [],
      }],
      'vue/attributes-order': ['error', {
        order: [
          'OTHER_ATTR',
          'GLOBAL',
          'CONDITIONALS',
          'DEFINITION',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'LIST_RENDERING',
          'RENDER_MODIFIERS',
          'UNIQUE',
          'SLOT',
          'EVENTS',
          'CONTENT',
        ],
      }],
    },
  },
  {
    ignores: [],
  },
)
