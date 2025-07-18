import type { ProcessedToken, ShadowValue, TokenLeaf, TokenNode, TokenValue } from './types'
import { TOKEN_TRANSFORMATIONS, TRANSFORM_PARENTS, getTransformedKey, shouldTransform } from './transformations'

export function processBoxShadow(value: ShadowValue | ShadowValue[]): string | undefined {
  if (Array.isArray(value)) {
    return value
      .map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`)
      .join(', ')
  }

  if (value !== null) {
    return `${value.x} ${value.y} ${value.blur} ${value.spread} ${value.color}`
  }

  return undefined
}

export function processFormField(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {}

  if (!field || typeof field !== 'object') {
    return result
  }

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) {
      continue
    }

    if (key === 'padding') {
      const paddingValue = value as {
        x: TokenLeaf
        y: TokenLeaf
      }
      result.paddingX = paddingValue?.x?.$value
      result.paddingY = paddingValue?.y?.$value
    } else if (key === 'sm' || key === 'lg') {
      const sizeValue = value as {
        font: {
          size: TokenLeaf
        }
        padding: {
          x: TokenLeaf
          y: TokenLeaf
        }
      }
      result[key] = {
        fontSize: sizeValue?.font?.size?.$value,
        paddingX: sizeValue?.padding?.x?.$value,
        paddingY: sizeValue?.padding?.y?.$value,
      }
    } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
      // Since TypeScript doesn't know that TRANSFORM_PARENTS only has string keys, we need to cast to unknown and then to TokenValue
      processTransformableToken(key, (value as unknown) as TokenValue, [key], result, {})
    } else {
      const processed = processTokenValue(value, {}, [])
      if (processed !== undefined) {
        result[key] = processed
      }
    }
  }

  return result
}

export function processList(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {}

  if (!field || typeof field !== 'object') {
    return result
  }

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) {
      continue
    }

    if (key === 'option') {
      const { group, icon, ...optionWithoutGroup } = value as TokenNode
      const optionProcessed = processTokenValue(optionWithoutGroup, {}, [])

      if (optionProcessed) {
        if (icon) {
          const iconValue = icon as {
            color: TokenLeaf
            focus: {
              color: TokenLeaf
            }
          }
          (optionProcessed as ProcessedToken).icon = {
            color: iconValue.color.$value,
            focusColor: iconValue.focus.color.$value,
          }
        }

        result.option = optionProcessed
      }

      const groupProcessed = processTokenValue(group, {}, [])
      if (groupProcessed) {
        result.optionGroup = groupProcessed
      }
    } else {
      const processed = processTokenValue(value, {}, [])
      if (processed !== undefined) {
        result[key] = processed
      }
    }
  }

  return result
}

export function processNavigation(field: TokenNode): ProcessedToken {
  const result: ProcessedToken = {}

  if (!field || typeof field !== 'object') {
    return result
  }

  for (const [key, value] of Object.entries(field)) {
    if (value === undefined) {
      continue
    }

    if (key === 'submenu') {
      const { label, icon } = value as TokenNode
      const labelProcessed = processTokenValue(label, {}, [])
      if (labelProcessed) {
        result.submenuLabel = labelProcessed
      }

      const iconProcessed = processTokenValue(icon, {}, [])
      if (iconProcessed) {
        result.submenuIcon = iconProcessed
      }
    } else if (key === 'item') {
      const { icon, ...itemWithoutIcon } = value as TokenNode
      const itemProcessed = processTokenValue(itemWithoutIcon, {}, [])

      if (itemProcessed) {
        if (icon) {
          const iconValue = icon as {
            color: TokenLeaf
            focus: {
              color: TokenLeaf
            }
            active: {
              color: TokenLeaf
            }
          }
          (itemProcessed as ProcessedToken).icon = {
            color: iconValue.color.$value,
            focusColor: iconValue.focus.color.$value,
            activeColor: iconValue.active.color.$value,
          }
        }

        result.item = itemProcessed
      }
    } else {
      const processed = processTokenValue(value, {}, [])
      if (processed !== undefined) {
        result[key] = processed
      }
    }
  }

  return result
}

export function processTransformableToken(
  tokenKey: string,
  tokenValue: TokenValue,
  currentPath: string[],
  result: ProcessedToken,
  primitiveTokens: TokenNode,
): void {
  try {
    if (!tokenValue || typeof tokenValue !== 'object') {
      return
    }

    if (!result[tokenKey]) {
      result[tokenKey] = {}
    }

    for (const [key, value] of Object.entries(tokenValue)) {
      try {
        const newPath = [...currentPath, key]
        if (shouldTransform(newPath)) {
          const transformedKey = getTransformedKey(newPath)

          if (typeof value === 'object' && value !== null) {
            // Check if it's a leaf token with $type and $value
            if ('$type' in value && '$value' in value) {
              const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath)
              if (processed !== undefined) {
                const currentKeyIndex = newPath.indexOf(key)
                const parentKey = newPath[currentKeyIndex - 1]
                const pathStr = newPath.join('.')
                const matchingPattern = Object.keys(TOKEN_TRANSFORMATIONS).find(pattern => pathStr.endsWith(pattern))

                try {
                  if (matchingPattern && matchingPattern.split('.').length >= 3) {
                    result[transformedKey] = processed
                  } else if (parentKey === tokenKey) {
                    result[transformedKey] = processed
                  } else if (newPath.includes(tokenKey)) {
                    const tokenKeyObj = result[tokenKey] as ProcessedToken
                    tokenKeyObj[transformedKey] = processed
                  } else {
                    const tokenKeyObj = result[tokenKey] as ProcessedToken
                    tokenKeyObj[transformedKey] = processed
                  }
                } catch (error) {
                  console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error)
                }
              }
            } else {
              // Handle nested structure - process each child
              const processedNested: ProcessedToken = {}
              for (const [nestedKey, nestedValue] of Object.entries(value)) {
                if (typeof nestedValue === 'object' && nestedValue !== null && '$type' in nestedValue && '$value' in nestedValue) {
                  if (nestedValue.$type === 'boxShadow') {
                    const shadowValue = processBoxShadow(nestedValue.$value as ShadowValue)
                    if (shadowValue !== undefined) {
                      processedNested[nestedKey] = shadowValue
                    }
                  } else {
                    processedNested[nestedKey] = (nestedValue as TokenLeaf).$value
                  }
                }
              }
              if (Object.keys(processedNested).length > 0) {
                result[transformedKey] = processedNested
              }
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          if ('$type' in value && '$value' in value) {
            const processed = processTokenValue(value as TokenLeaf, primitiveTokens, newPath)
            if (processed !== undefined) {
              try {
                const tokenKeyObj = result[tokenKey] as ProcessedToken
                tokenKeyObj[key] = processed
              } catch (error) {
                console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error)
              }
            }
          } else if (typeof tokenValue === 'object' && '$type' in tokenValue && '$value' in tokenValue) {
            const processed = processTokenValue(tokenValue as TokenLeaf, primitiveTokens, newPath)
            if (processed !== undefined) {
              try {
                result[tokenKey] = processed
              } catch (error) {
                console.warn(`Warning: Failed to store processed token at path ${newPath.join('.')}:`, error)
              }
            }
          } else {
            processTransformableToken(tokenKey, value, newPath, result, primitiveTokens)
          }
        } else {
          console.warn(`Warning: Could not process token at path ${newPath.join('.')}:`, value)
        }
      } catch (error) {
        console.warn(`Warning: Failed to process token at path ${[...currentPath, key].join('.')}:`, error)
      }
    }

    if (result[tokenKey] && Object.keys(result[tokenKey]).length === 0) {
      delete result[tokenKey]
    }
  } catch (error) {
    console.warn(`Warning: Error in processTransformableToken at path ${currentPath.join('.')}:`, error)
  }
}

export function processTokenValue(
  token: TokenNode | TokenLeaf | TokenValue,
  primitiveTokens: TokenNode,
  currentPath: string[] = [],
): TokenValue | ProcessedToken | undefined {
  try {
    if (!token) {
      return undefined
    }

    if (typeof token === 'object' && '$type' in token && '$value' in token) {
      const value = (token as TokenLeaf).$value
      const type = (token as TokenLeaf).$type

      switch (type) {
        case 'boxShadow':
          return processBoxShadow(value as ShadowValue | ShadowValue[])
        default:
          return value
      }
    }

    if (typeof token === 'object') {
      const result: ProcessedToken = {}

      for (const [key, value] of Object.entries(token)) {
        try {
          const newPath = [...currentPath, key]
          const pathStr = newPath.join('.')

          if (pathStr === 'semantic.form' || pathStr === 'semantic.light.form' || pathStr === 'semantic.dark.form') {
            const processedField = processFormField(value.field)
            if (processedField) {
              result.formField = processedField
            }
          } else if (pathStr === 'semantic.list' || pathStr === 'semantic.light.list' || pathStr === 'semantic.dark.list') {
            const processedList = processList(value)
            if (processedList) {
              result.list = processedList
            }
          } else if (pathStr === 'semantic.navigation' || pathStr === 'semantic.light.navigation' || pathStr === 'semantic.dark.navigation') {
            const processedNavigation = processNavigation(value)
            if (processedNavigation) {
              result.navigation = processedNavigation
            }
          } else if (TRANSFORM_PARENTS.has(key) && typeof value === 'object') {
            // Since TypeScript doesn't know that TRANSFORM_PARENTS only has string keys, we need to cast to unknown and then to TokenValue
            processTransformableToken(key, (value as unknown) as TokenValue, newPath, result, primitiveTokens)
          } else {
            const processed = processTokenValue(value, primitiveTokens, newPath)
            if (processed !== undefined) {
              result[key] = processed
            }
          }
        } catch (error) {
          console.warn(`Warning: Failed to process token at path ${[...currentPath, key].join('.')}:`, error)
        }
      }
      return result
    }

    console.warn(`Warning: Unexpected token type at path ${currentPath.join('.')}:`, token)
    return undefined
  } catch (error) {
    console.warn(`Warning: Error processing token at path ${currentPath.join('.')}:`, error)
    return undefined
  }
}
