export type TokenValue = string | ShadowValue

export interface ProcessedToken {
  [key: string]: TokenValue | ProcessedToken
}

export interface TokenLeaf {
  $type: string
  $value: TokenValue
}

export type TokenNode = {
  [key: string]: TokenLeaf | TokenNode
}

export interface TokenSet {
  primitive?: ProcessedToken
  semantic?: ProcessedToken
  light?: ProcessedToken
  dark?: ProcessedToken
}

export interface ShadowValue {
  x?: string
  y?: string
  blur?: string
  spread?: string
  color?: string
  type: 'dropShadow'
}
