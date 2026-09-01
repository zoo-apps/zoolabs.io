/**
 * The five hues of the Zoo mark — the CMYK Venn in components/ZooLogo.
 *
 * These are the foundation's own colours, so they live here rather than in the
 * fleet token table: everything about size, spacing and type comes from
 * `@hanzo/ui/gui-config`, and only the brand's identity is local.
 */
export const BRAND = {
  ink: '#000000',
  paper: '#f5e8c8',
  magenta: '#ea018e',
  green: '#00a652',
  blue: '#2e3192',
  cyan: '#01acf1',
  yellow: '#fcf006',
  red: '#ed1c24',
} as const

export type Hue = keyof typeof BRAND
export type Colour = (typeof BRAND)[Hue]
