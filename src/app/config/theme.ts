import type { BernofarmThemeConfig } from '@bernofarm/core'

// Navy brand: satu sumber untuk primary dan brandBlue agar tidak pernah berbeda.
const brandBlue = '#123E6B'
const brandBlueHover = '#0A2440'

export const bernofarmTheme = {
  colors: {
    primary: brandBlue,
    primaryHover: brandBlueHover,
    primaryForeground: '#FFFFFF',
    primaryMuted: '#DCE6F2',
    secondary: '#64748B',
    secondaryHover: '#475569',
    secondaryForeground: '#FFFFFF',
    info: '#1E88E5',
    infoHover: '#1769AA',
    infoForeground: '#FFFFFF',
    success: '#16A34A',
    successForeground: '#FFFFFF',
    warning: '#D99A00',
    warningHover: '#B77D00',
    warningForeground: '#FFFFFF',
    danger: '#DC2626',
    dangerHover: '#B91C1C',
    dangerForeground: '#FFFFFF',
    neutral: '#64748B',
    neutralHover: '#475569',
    neutralForeground: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    text: '#0B1F3F',
    textMuted: '#64748B',
    border: '#E8EDF3',
    ring: '#93A2C8',
    dangerSurface: '#FEF2F2',
    warningSurface: '#FEF3C7',
    successSurface: '#DCFCE7',
    surfaceSubtle: '#EEF1F5',
    sidebar: '#011844',
    sidebarForeground: '#FFFFFF',
    sidebarMuted: '#CBD5E1',
    sidebarBorder: 'rgb(255 255 255 / 0.12)',
    sidebarHover: 'rgb(255 255 255 / 0.08)',
    sidebarAccent: '#60A5FA',
    foreground: '#FFFFFF',
    accent: '#FF6A00',
    brandBlue,
    brandBlueHover,
    brandSoftBlue: '#1E88E5',
  },
  radius: 'medium',
  shadows: 'subtle',
  animation: 'normal',
} satisfies BernofarmThemeConfig

export type BernofarmTheme = typeof bernofarmTheme

export default bernofarmTheme
