import { bernofarmTheme } from '@/app/config/theme'

type Shades = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>

const SCALE: Record<keyof Shades, number> = {
  50: 90,
  100: 80,
  200: 60,
  300: 40,
  400: 20,
  500: 0,
  600: -20,
  700: -40,
  800: -60,
  900: -75,
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ]
}

function adjust(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex)

  const shift = (c: number) => {
    if (percent > 0) {
      // lighten: mendekat ke 255 secara proporsional
      return Math.round(c + (255 - c) * (percent / 100))
    } else {
      return Math.round(c + c * (percent / 100))
    }
  }

  return `rgb(${shift(r)}, ${shift(g)}, ${shift(b)})`
}

function generateShades(baseHex: string): Shades {
  const result = {} as Shades
  for (const key in SCALE) {
    const level = Number(key) as keyof Shades
    result[level] = level === 500 ? baseHex : adjust(baseHex, SCALE[level])
  }
  return result
}

function withOpacity(color: string, opacity: number): string {
  let r: number, g: number, b: number

  if (color.startsWith('#')) {
    ;[r, g, b] = hexToRgb(color)
  } else {
    const match = color.match(/\d+/g)
    const [mr, mg, mb] = match ? match.map(Number) : [255, 255, 255]
    r = mr ?? 255
    g = mg ?? 255
    b = mb ?? 255
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const colorTokens = bernofarmTheme.colors

const Colors = {
  blue: generateShades(colorTokens.brandBlue),
  darkBlue: generateShades(colorTokens.sidebar),
  softBlue: generateShades(colorTokens.brandSoftBlue),
  orange: generateShades(colorTokens.accent),
  red: generateShades(colorTokens.danger),
  yellow: generateShades(colorTokens.warning),
  primary: generateShades(colorTokens.primary),

  withOpacity,
}

export { colorTokens }
export default Colors
