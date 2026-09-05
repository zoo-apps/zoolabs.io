/**
 * The five hues of the Zoo mark — the CMYK Venn in components/ZooLogo — plus the
 * ink and paper they sit on, named for the gui props that need a value.
 *
 * The VALUES are in styles/globals.css. A hex here would be a second copy of a
 * colour, and worse, a copy no stylesheet can see: @hanzo/appearance retunes the
 * page by writing custom properties, so a colour that is not one is a colour the
 * reader's setting can never reach. Everything about size and spacing comes from
 * `@hanzo/ui/gui-config`; only the foundation's identity is local, and this is
 * how a component asks for it.
 */
export const BRAND = {
  ink: 'var(--ink)',
  paper: 'var(--paper)',
  magenta: 'var(--magenta)',
  green: 'var(--green)',
  blue: 'var(--blue)',
  cyan: 'var(--cyan)',
  yellow: 'var(--yellow)',
  red: 'var(--red)',
} as const

export type Hue = keyof typeof BRAND
export type Colour = (typeof BRAND)[Hue]
