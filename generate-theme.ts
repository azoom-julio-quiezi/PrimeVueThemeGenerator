import * as fs from 'fs';
import * as path from 'path';

interface Token {
  $type?: string;
  $value?: any;
  [key: string]: any;
}

interface ProcessedFormField {
  paddingX?: string;
  paddingY?: string;
  borderRadius?: string;
  fontSize?: string;
  transitionDuration?: string;
  focusRing?: {
    width?: string;
    style?: string;
    color?: string;
    offset?: string;
    shadow?: string;
  };
  sm?: {
    paddingX?: string;
    paddingY?: string;
    fontSize?: string;
  };
  lg?: {
    paddingX?: string;
    paddingY?: string;
    fontSize?: string;
  };
}

interface ShadowValue {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  type: 'dropShadow';
}

function isShadowValue(value: any): value is ShadowValue {
  return (
    value &&
    typeof value === 'object' &&
    'x' in value &&
    'y' in value &&
    'blur' in value &&
    'spread' in value &&
    'color' in value &&
    'type' in value &&
    value.type === 'dropShadow'
  );
}

function processTokenValue(value: any, primitiveTokens: any): any {
  // If it's a token object with $type and $value
  if (value && typeof value === 'object' && '$type' in value && '$value' in value) {
    const processedValue = value.$value;
    
    // Handle special types
    switch (value.$type) {
      case 'boxShadow':
        if (Array.isArray(processedValue)) {
          return processedValue
            .filter(isShadowValue)
            .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
            .join(', ');
        } else if (typeof processedValue === 'object' && processedValue !== null) {
          if (isShadowValue(processedValue)) {
            return `${processedValue.x} ${processedValue.y} ${processedValue.blur} ${processedValue.spread} ${processedValue.color}`;
          }
          return Object.values(processedValue)
            .filter(isShadowValue)
            .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
            .join(', ');
        }
        break;
      default:
        return processTokenValue(processedValue, primitiveTokens);
    }
  }

  // If it's a string that might contain a reference
  if (typeof value === 'string' && value.includes('{')) {
    const match = value.match(/\{([^}]+)\}/);
    if (!match) return value;

    // Keep the reference as is
    return value;
  }

  // If it's a color value that could be referenced from primitive tokens
  if (typeof value === 'string' && value.startsWith('#')) {
    // Try to find a matching primitive token
    for (const [category, colors] of Object.entries(primitiveTokens || {})) {
      if (typeof colors === 'object' && colors !== null) {
        for (const [shade, colorValue] of Object.entries(colors)) {
          if (colorValue === value) {
            return `{${category}.${shade}}`;
          }
        }
      }
    }
  }

  // For objects, process recursively
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const processed: any = {};
    for (const [key, val] of Object.entries(value)) {
      const processedValue = processTokenValue(val, primitiveTokens);
      if (processedValue !== undefined) {
        // Special handling for border.radius in primitive tokens
        if (key === 'border' && typeof val === 'object' && val !== null && 'radius' in val) {
          processed.borderRadius = processedValue.radius;
        } else {
          processed[key] = processedValue;
        }
      }
    }
    return Object.keys(processed).length > 0 ? processed : undefined;
  }

  return value;
}

function processFormField(formField: any): ProcessedFormField {
  const processed: ProcessedFormField = {};

  // Process padding
  if (formField.padding?.x?.$value) processed.paddingX = formField.padding.x.$value;
  if (formField.padding?.y?.$value) processed.paddingY = formField.padding.y.$value;

  // Process border radius
  if (formField.border?.radius?.$value) processed.borderRadius = formField.border.radius.$value;

  // Process font size
  if (formField.font?.size?.$value) processed.fontSize = formField.font.size.$value;

  // Process transition duration
  if (formField.transition?.duration?.$value) processed.transitionDuration = formField.transition.duration.$value;

  // Process focus ring
  if (formField.focus?.ring) {
    const ring = formField.focus.ring;
    const focusRing: any = {};

    if (ring.width?.$value) focusRing.width = ring.width.$value;
    if (ring.style?.$value) focusRing.style = ring.style.$value;
    if (ring.color?.$value) focusRing.color = ring.color.$value;
    if (ring.offset?.$value) focusRing.offset = ring.offset.$value;
    if (ring.shadow?.$value) {
      const shadowValue = ring.shadow.$value;
      if (shadowValue && typeof shadowValue === 'object' && 'x' in shadowValue && 'y' in shadowValue && 'blur' in shadowValue && 'spread' in shadowValue && 'color' in shadowValue) {
        focusRing.shadow = `${shadowValue.x} ${shadowValue.y} ${shadowValue.blur} ${shadowValue.spread} ${shadowValue.color}`;
      }
    }

    if (Object.keys(focusRing).length > 0) {
      processed.focusRing = focusRing;
    }
  }

  // Process variants
  if (formField.sm) {
    const sm: any = {};
    if (formField.sm.padding?.x?.$value) sm.paddingX = formField.sm.padding.x.$value;
    if (formField.sm.padding?.y?.$value) sm.paddingY = formField.sm.padding.y.$value;
    if (formField.sm.font?.size?.$value) sm.fontSize = formField.sm.font.size.$value;
    if (Object.keys(sm).length > 0) processed.sm = sm;
  }

  if (formField.lg) {
    const lg: any = {};
    if (formField.lg.padding?.x?.$value) lg.paddingX = formField.lg.padding.x.$value;
    if (formField.lg.padding?.y?.$value) lg.paddingY = formField.lg.padding.y.$value;
    if (formField.lg.font?.size?.$value) lg.fontSize = formField.lg.font.size.$value;
    if (Object.keys(lg).length > 0) processed.lg = lg;
  }

  return processed;
}

function generateTheme(tokens: any): any {
  const primitiveTokens = tokens['aura/primitive'];
  const result: any = { primitive: {}, semantic: {} };

  // Process primitive tokens
  if (primitiveTokens) {
    result.primitive = processTokenValue(primitiveTokens, primitiveTokens);
  }

  // Process semantic tokens
  const semanticTokens = tokens['aura/semantic'];
  if (semanticTokens) {
    // Extract and process special properties
    if (semanticTokens.form?.field) {
      result.semantic.formField = processFormField(semanticTokens.form.field);
    }

    // Process other semantic tokens
    const processed = processTokenValue(semanticTokens, primitiveTokens);
    
    // Extract flattened properties
    result.semantic = {
      ...result.semantic,
      transitionDuration: processed.transition?.duration?.$value || processed.transition?.duration,
      disabledOpacity: processed.disabled?.opacity?.$value || processed.disabled?.opacity,
      iconSize: processed.icon?.size?.$value || processed.icon?.size,
      anchorGutter: processed.anchor?.gutter?.$value || processed.anchor?.gutter,
      ...processed
    };

    // Clean up nested properties that were flattened
    delete result.semantic.transition?.duration;
    delete result.semantic.disabled?.opacity;
    delete result.semantic.icon?.size;
    delete result.semantic.anchor?.gutter;
    delete result.semantic.form?.field;

    // Clean up empty objects
    ['transition', 'disabled', 'icon', 'anchor', 'form'].forEach(key => {
      if (result.semantic[key] && Object.keys(result.semantic[key]).length === 0) {
        delete result.semantic[key];
      }
    });
  }

  // Process color schemes
  ['light', 'dark'].forEach(theme => {
    const themeTokens = tokens[`aura/semantic/${theme}`];
    if (themeTokens) {
      if (!result.semantic.colorScheme) result.semantic.colorScheme = {};
      result.semantic.colorScheme[theme] = processTokenValue(themeTokens, primitiveTokens);
    }
  });

  return result;
}

function formatObject(obj: any, indent = 0): string {
  if (!obj || Object.keys(obj).length === 0) return '{}';

  const spaces = ' '.repeat(indent);
  const innerSpaces = ' '.repeat(indent + 2);
  
  const entries = Object.entries(obj)
    .filter(([_, v]) => v !== undefined)
    .map(([key, value]) => {
      const formatted = typeof value === 'object' 
        ? formatObject(value, indent + 2)
        : typeof value === 'string' 
          ? `'${value}'` 
          : value;
      return `${innerSpaces}${key}: ${formatted}`;
    });

  return `{\n${entries.join(',\n')}\n${spaces}}`;
}

try {
  // Read tokens file
  const tokensPath = path.join(__dirname, 'tokens/tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  // Generate theme structure
  const theme = generateTheme(tokens);

  // Generate theme file content
  const content = `import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const Default = definePreset(Aura, ${formatObject(theme, 2)});

export default Default;`;

  // Write theme file
  const outputPath = path.join(__dirname, 'PrimeVueTest/assets/themes/default.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  
  console.log('Theme file generated successfully!');
} catch (error) {
  console.error('Error generating theme:', error);
} 